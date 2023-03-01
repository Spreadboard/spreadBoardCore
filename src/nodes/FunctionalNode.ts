import { Component } from "rete";
import { Observable, ObservedValueOf, combineLatest, map, OperatorFunction, merge } from 'rxjs';
import { EventEmitter } from "events";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";


export interface StatefulOperatorData<S extends object, T extends object, R extends object> {
    initialState: S,
    operator: (t: T, s: S) => R
}

export function createStatefullOperator<S extends object, T extends object, R extends object>(
    data: StatefulOperatorData<S, T, R>
): OperatorFunction<T, R> {
    return (inputs: Observable<T>) => {
        let state = data.initialState;
        let obs = map((t: T) => data.operator(t, state))(inputs);

        return obs;
    }
}

export function isolateObs<T extends object>(key: keyof T, obs: Observable<T>) { return map((t: T) => t[key])(obs); }


export interface FunctionalProcessorOptions {
    operators?: StatefulOperatorData<any, any, any>[]
}

export abstract class FunctionalNode<S extends object, T extends object, R extends object> extends Component {

    abstract override data: {
        [key: string]: any,
        i18nKeys: [string],
        category: [[string]]
        state: S
    };

    abstract process: (t: T, s: S) => R;

    override worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, options: FunctionalProcessorOptions, ...args: unknown[]): void {
        if (options.operators) {
            //Compile
            let initialState: S = node.data.state as S;
            let rxInputs: { [K in keyof T]: Observable<T[K]> } = {} as { [K in keyof T]: Observable<T[K]> };
            Object.keys(inputs).forEach(key => {
                let k = key as keyof T;
                rxInputs[k] = merge(...inputs[key] as Observable<T[typeof k]>[]);
            })
        }
    }

}