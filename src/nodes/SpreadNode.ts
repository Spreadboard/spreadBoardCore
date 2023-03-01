import { Component, Node } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { combineLatest, distinctUntilChanged, map, merge, Observable, OperatorFunction } from "rxjs";
import { SpreadNodeData, Cell, CellType, StatefulOperator, SpreadData } from "./SpreadOperators";

export abstract class SpreadNode<T extends { [key: string]: any }, S, R extends { [key: string]: any }> extends Component {

    declare data: SpreadData<T, S, R>;


    operators: Map<number, [OperatorFunction<T, R>, CellType<S>]> = new Map();

    async builder(node: Node) {
        this.operators.set(node.id, StatefulOperator(this.data.operator));
    }

    worker(node: NodeData, inputs: { [key: string]: Observable<any>[] }, outputs: { [key: string]: Observable<any> }) {
        let inputKeys = Object.keys(inputs);
        let input: Observable<any>[] = inputKeys.map(
            key => merge(inputs[key])
        )
        let result = combineLatest(input).pipe(
            map((arr) => {
                let obj: any = {};
                arr.forEach(
                    (val, i) => { obj[inputKeys[i]] = val }
                )
                return obj;
            }),
            this.operators.get(node.id)![0]
        )
        Object.keys(node.outputs).forEach(
            (key) => {
                outputs[key] = result.pipe(map((res) => res[key]), distinctUntilChanged())
            }
        )
    }

}