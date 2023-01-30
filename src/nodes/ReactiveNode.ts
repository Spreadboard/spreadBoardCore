import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

import { Observable } from 'rxjs';
import { ObservableVariable } from "../processor/variable";
import { Command, CompilerOptions, NodeCommand } from "./CompilerNode";

type ReactiveIO = {
    [key: string]: Observable<any>
}

type ProcessFunction = (rxIO: ReactiveIO) => (ReactiveIO);


abstract class ReactiveNode extends Component {

    abstract process: (node: NodeData) => ProcessFunction;
    abstract processDependencys: (node: NodeData) => string[];

    compile(node: NodeData, input_names: { [key: string]: Command }): NodeCommand {
        let func = this.process;
        let outputs: { [key: string]: Command } = {};
        Object.keys(node.outputs).forEach(
            (out) => outputs[out] = {
                commands: `${node.name}_${node.id}.${out}`,
                node_id: node.id
            }
        )
        return {
            node_id: node.id,
            processDependencys: this.processDependencys(node),
            outputs: outputs,
            commands: [
                {
                    node_id: node.id,
                    commands: `const ${node.name}_${node.name} = ( (rxIO)=>{${func.toString}} )( {`
                },
                ...(Object.keys(input_names).map(
                    (name) => {
                        return {
                            node_id: input_names[name].node_id,
                            commands:
                                (typeof input_names[name].commands == 'string')
                                    ? `'${name}' : ${input_names[name].commands as string}`
                                    : [
                                        {
                                            node_id: input_names[name].node_id,
                                            commands: `'${name}' :`
                                        },
                                        ...(input_names[name].commands as Command[])
                                    ]
                        }
                    }
                )),
                {
                    node_id: node.id,
                    commands: `} );`
                }
            ]
        }
    }


    override worker(node: NodeData, inputs: WorkerInputs, outputs: ReactiveIO | {}, compilerOptions: CompilerOptions): void {

        if (compilerOptions.compilerCommands) {
            let input_names: { [key: string]: Command } = {};
            Object.keys(inputs).forEach((key) => input_names[key] = (inputs[key][0] as Command))

            let command: NodeCommand = this.compile(node, input_names);

        }


        let rxInputs: ReactiveIO = {};
        for (let key of Object.keys(inputs)) {
            if (inputs[key].length > 1) {
                let rxInput = new ObservableVariable<any>(undefined);
                for (let input of inputs[key]) {
                    let obsInput = input as Observable<any>;
                    obsInput.subscribe((next) => rxInput.set(next));
                }
                rxInputs[key] = rxInput;
            }
            else if (inputs[key].length > 0) {
                rxInputs[key] = (inputs[key][0] as Observable<any>);
            }
        }



    }

}