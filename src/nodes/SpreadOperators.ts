
import { emit } from 'process';
import { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs, NodesData } from 'rete/types/core/data';
import { Observable, map, OperatorFunction, merge, pipe, fromEvent, from, combineLatest, distinctUntilChanged } from 'rxjs';
import { EventEmitter } from 'stream';



type KeyedObj = { [key: string]: any };

export type StatefulOperatorData<T extends KeyedObj, S, R extends KeyedObj> = {
    projection: OperatorFunction<[T, S], R>,
    initialState: S
}

export interface CellType<S> extends Observable<S> { set: (s: S) => void, reset: () => void, setInitial: (s: S) => void }


export function Cell<S>(initialState: S): CellType<S> {
    let emitter = new EventEmitter();
    let obs = fromEvent(emitter, '');
    emitter.emit('', initialState);
    let cell = obs as CellType<S>
    cell.set = (s: S) => emitter.emit('', s);
    cell.reset = () => {
        emitter.emit('', initialState);
    };
    cell.setInitial = (s: S) => (initialState = s);
    return cell;
}

export function StatefulOperator<T extends KeyedObj, S, R extends KeyedObj>(data: StatefulOperatorData<T, S, R>): [OperatorFunction<T, R>, CellType<S>] {
    let state = Cell(data.initialState);
    return [
        (t: Observable<T>) => combineLatest([t, state]).pipe(data.projection),
        state
    ];
}

export type SpreadData<T extends KeyedObj, S, R extends KeyedObj> = {
    operator: StatefulOperatorData<T, S, R>,
    i18n: string[],
    io: 'input' | 'output' | ''
} & { [key: string]: any };

export interface SpreadNodeData<T extends KeyedObj, S, R extends KeyedObj> extends NodeData {
    data: SpreadData<T, S, R>
}

export interface SpreadNodesData {
    [key: string]: SpreadNodeData<any, any, any>;
}

export function compile(nodes: SpreadNodesData): StatefulOperatorData<any, any, any> {
    let nodeKeys = Object.keys(nodes);
    let initialState: any = {};
    nodeKeys.map(nodeKey => nodes[nodeKey].data.operator.initialState)
        .forEach(
            (val, i) => {
                initialState[nodeKeys[i]] = val
            }
        )

    let projection = (input_state: Observable<[{ [key: string]: any }, { [key: string]: any }]>) => {

        let state = input_state.pipe(
            map(([input, state]) => state)
        );

        let transporter = new EventEmitter();

        let observers: Observable<any>[] = [];

        nodeKeys.forEach(
            key => {
                let node = nodes[key];
                if (node.data.io == 'input') {
                    let inputObs = input_state.pipe(
                        map(([inputs, state]) => {
                            inputs[key]
                        })
                    )
                    inputObs.subscribe(
                        inputVal => {
                            transporter.emit(`${key} - val`, inputVal)
                        }
                    )
                    return;
                }
                if (node.data.io == 'output') {
                    Object.keys(node.inputs).map(inputKey => node.inputs[inputKey].connections)
                        .forEach(
                            cons => cons.forEach(
                                con => transporter.on(`${con.node} - ${con.output}`, (val) => {
                                    transporter.emit(`output - ${key}`, val)

                                })
                            )
                        );
                    observers.push(fromEvent(transporter, `output - ${key}`).pipe(distinctUntilChanged()));
                }
                let inputKeys = Object.keys(node.inputs);
                let operatorInputs = inputKeys.map(
                    inputKey =>
                        merge(
                            ...node.inputs[inputKey]
                                .connections.map(
                                    con => fromEvent(transporter, `${con.node} - ${con.output}`)
                                )
                        )
                )

                let t = combineLatest(operatorInputs).pipe(
                    map(
                        (arr) => {
                            let operatorInput: any = {}
                            arr.forEach(
                                (val, index) => {
                                    operatorInput[inputKeys[index]] = val;
                                }
                            )
                            return operatorInput;
                        }
                    ),
                    distinctUntilChanged()
                );

                let result = combineLatest(
                    [
                        t,
                        state.pipe(map(s => s[key]))
                    ]
                ).pipe(node.data.operator.projection);


                Object.keys(nodes[key].outputs).forEach(
                    outputKey => result.pipe(
                        map(latest => latest[outputKey]),
                        distinctUntilChanged()
                    ).subscribe(
                        latestOutput => transporter.emit(`${key} - ${outputKey}`, latestOutput)
                    )
                );
            }
        )

        return combineLatest(observers).pipe(
            map(arr => {
                let obj: any = {};
                arr.forEach(
                    (val, index) => obj[nodeKeys[index]] = val
                )
                return obj;
            })
        )
    }


    return {
        projection: projection,
        initialState
    }

}

