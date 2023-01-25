import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Evaluation, CompilerIO, ProcessIO } from "../processor/connections/packet";


export type CompilerOptions = {
    silent: boolean,
    compilerOutputs?: CompilerIO,
    compilerCommands?: NodeCommand[],
    options?: {
        [key: string]: any
    }
}

export type Command = {
    node_id: number,
    commands: string | Command[]
}

export type ProcessCommand = {
    id: string,
    commands: Command[],
    dependencys: string[]
}


export type NodeCommand = {
    node_id: number,
    outputs: { [key: string]: Command },
    processDependencys: string[],
    commands: Command[]
}

export abstract class CompilerNode extends Component {

    abstract compile(node: NodeData, worker_input_names: { [key: string]: Command }, worker_id: string): NodeCommand;

    abstract process: (node: NodeData, outkey: string, inputConnections: CompilerIO, compilerOptions: CompilerOptions) => Evaluation<any>;

    worker(node: NodeData, inputs: WorkerInputs, outputs: CompilerIO | { [key: string]: Command }, compilerOptions: CompilerOptions) {


        if (compilerOptions.compilerCommands) //Compile the whole Process
        {

            let worker_input_names: { [key: string]: Command } = {}

            Object.keys(inputs).forEach((key) => worker_input_names[key] = (inputs[key][0] as Command))

            let worker_output_name = node.name.toLowerCase() + "_" + node.id;

            let command = this.compile(node, worker_input_names, worker_output_name);

            let stitches: string = "";
            Object.keys(inputs).forEach((key) => {
                let command_out = inputs[key][0] as string;
                let stitch = `${worker_input_names}.${key} = ${command_out}\n`;
                stitches = stitches + stitch;
            });

            command.commands =
                (command.commands.length > 0 ?
                    [
                        {
                            node_id: node.id,
                            commands: `\n//Process Node ${node.name}-${node.id}\n`
                        },
                        ...command.commands
                    ] : []);


            compilerOptions.compilerCommands.push(command);

            Object.keys(node.outputs).forEach(
                (key) => {
                    outputs[key] = command.outputs[key];
                }
            )

            return;
        }
        else //Process the Node Live
        {
            let evaluateInputs: CompilerIO = {};
            Object.keys(inputs).forEach(
                (key: string) => {
                    evaluateInputs[key] =
                        (inputs[key].length > 0)
                            ? (inputs[key][0] as Evaluation<any>)
                            : (_) => { return undefined };
                });

            Object.keys(node.outputs).forEach(
                (outKey: string) => {
                    outputs[outKey] = this.process(node, outKey, evaluateInputs, compilerOptions);
                }
            );

            if (!compilerOptions.silent) {
                if ((Object.keys(node.outputs).find((outKey) => node.outputs[outKey].connections.length == 0) || Object.keys(node.outputs).length == 0)) {
                    for (let outKey of Object.keys(node.outputs)) {
                        this.process(node, outKey, evaluateInputs, compilerOptions)({});
                    }
                }
            } else {
            }
        }

    }
}