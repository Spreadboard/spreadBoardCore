
import EventEmitter from 'events';
import { Component, Node as ReteNode } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { merge, Observable, OperatorFunction, map, combineLatest, pipe, startWith } from 'rxjs';

type IO = {
    [key: string]: any
};

export function mergeOperators<T, R>(...operators: OperatorFunction<T, R>[]): OperatorFunction<T, R> {
    return (obs: Observable<T>) => merge(...operators.map(op => op(obs)))
}

export function combineOperators<T, R>(operators: { [K in keyof R]: OperatorFunction<T, R[K]> }): OperatorFunction<T, R> {
    return (obs: Observable<T>) => {
        let obsR = Object.keys(operators).map(
            key => operators[key as keyof R](obs)
        )
        return combineLatest(obsR).pipe(
            map(
                (obsRArray) => {
                    let obj: Partial<R> = {};
                    Object.keys(operators).forEach(
                        (key, index) => {
                            obj[key as keyof R] = obsRArray[index];
                        }
                    )
                    return obj as R;
                }
            )
        );
    }
}


export abstract class SpreadNode<T extends IO, R extends IO> extends Component {

    abstract operator: (nodeData: NodeData) => (nodeInputs: Observable<T>) => OperatorFunction<IO, R>;

    declare data: { [key: string]: any } & {
        i18nKeys: string[],
        category: string[][],
        output?: boolean
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, outputOperators: OperatorFunction<IO, IO>[]): void {
        let inputOperators: Partial<{ [K in keyof T]: OperatorFunction<IO, T[K]> }> = {};
        Object.keys(inputs).forEach(
            (key) => inputOperators[key as keyof T] = mergeOperators(...inputs[key] as OperatorFunction<IO, any>[])
        );
        let input = combineOperators(inputOperators as { [K in keyof T]: OperatorFunction<IO, T[K]> });

        let result = (obs: Observable<IO>) => this.operator(node)(input(obs).pipe(startWith({} as T)))(obs);

        Object.keys(node.outputs).forEach(
            outKey => outputs[outKey] = (obs: Observable<IO>) => result(obs).pipe(map(res => res[outKey]))
        )


        if (this.data.output) {
            outputOperators.push(result);
        }
        else if (Object.keys(node.outputs).filter(outKey => node.outputs[outKey].connections.length > 0).length == 0) {
            outputOperators.push((obs: Observable<IO>) => result(obs).pipe(map(a => { return {} })));
        }


    }
}