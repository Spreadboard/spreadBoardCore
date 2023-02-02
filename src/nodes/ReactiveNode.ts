import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

import { combineLatest, merge, mergeAll, Observable, OperatorFunction } from 'rxjs';
import { CompiledTransformer, CompilerOptions, Transformer } from "../processor/processor";
import { fromObservable, ObservableVariable, seperate } from "../processor/variable";

export type ReactiveIO<T extends { [key: string]: any }> = {
    [key: string]: ObservableVariable<T extends { [key: string]: infer P } ? P : never>
}

export type ReactiveInput<T extends { [key: string]: any }> = {
    [key: string]: Observable<T extends { [key: string]: infer P } ? P : never>
}



export type ReactiveInputs<T extends { [key: string]: any }> = {
    [key: string]: Observable<T extends { [key: string]: infer P } ? P : never>[]
}


export abstract class ReactiveNode<T extends { [key: string]: any }, R extends { [key: string]: any }> extends Component {

    abstract process(node: NodeData, silent?: boolean): Transformer<T, R>;
    abstract dependencys(node: NodeData): { [key: string]: string[] | string };
    abstract defaultOutputs: R;

    previousOutputs: Map<number, ReactiveIO<R>> = new Map();


    compile(node: NodeData): CompiledTransformer<T, R> {

        let compiledInputs: { [key: string]: [string, string] } = {};
        Object.keys(node.inputs).forEach(
            (key) => {
                let input = node.inputs[key];
                if (input.connections.length > 0) {
                    let nodeId = input.connections[0].node;
                    let output = input.connections[0].output;
                    compiledInputs[key] = ['node' + nodeId, output];
                }
            }
        )

        return {
            ...this.process(node),
            compilerInputs: compiledInputs,
        }
    }


    override worker(node: NodeData, inputs: ReactiveInputs<T>, outputs: ReactiveIO<R> | { [key: string]: any }, compilerOptions: CompilerOptions): void {

        if (compilerOptions.result) {

            let res = compilerOptions.result!;

            let compilerInputs = {};

            Object.keys(node.inputs).forEach(
                (key) => {
                    let input = node.inputs[key];
                }
            )


            let transform: CompiledTransformer<T, R> = {
                ...this.process(node),
                compilerInputs: compilerInputs
            };

            res.tranformers.push(transform);

            let deps = this.dependencys(node);
            Object.keys(deps).forEach((key) => {
                let dependency = deps[key];

                if (!res.dependencys[key])
                    res.dependencys[key] = dependency
                else
                    if (typeof dependency == 'string')
                        res.dependencys[key] = dependency;
                    else
                        res.dependencys[key] = (res.dependencys[key] as string[]).concat(dependency as string[]);
            });

        } else {
            if (this.previousOutputs.has(node.id))
                Object.values(this.previousOutputs.get(node.id)!).forEach(
                    (value) => value.removeListeners()
                );


            let reactiveIO: ReactiveInput<T> = {};
            Object.keys(inputs)
                .filter((key) => inputs[key].length > 0)
                .forEach(
                    (key) => {
                        console.log(`Node ${node.id} inputs.${key} -> ${inputs[key][0]}`)
                        reactiveIO[key] = merge(...(inputs[key].filter(inp => inp != undefined)));
                        reactiveIO[key].subscribe((val) => console.log(`Node ${node.id} inputs.${key} -> ${val}`))
                    }
                )


            let trans = this.process(node);
            if (typeof trans.operator != 'string') {
                let op = trans.operator as OperatorFunction<T, R>;
                let outs = seperate(fromObservable(op(combineLatest(reactiveIO) as Observable<T>), this.defaultOutputs));


                this.previousOutputs.set(node.id, outs);

                Object.keys(outs).forEach(key => {
                    outputs[key] = outs[key];
                    console.log(`Node ${node.id} outputs.${key} -> ${outputs[key]}`)
                })
            } else {
                this.previousOutputs.set(node.id, {});
            }
        }





    }

}
