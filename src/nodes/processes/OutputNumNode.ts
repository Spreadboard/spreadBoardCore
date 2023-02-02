import Rete, { Component, Input, Node as RNode } from "rete";

import { NumControl } from "../controls/NumControl";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ReactiveInputs, ReactiveIO, ReactiveNode } from "../ReactiveNode";
import { ObservableVariable } from "../../processor/variable";
import { Observable, OperatorFunction } from "rxjs";
import { resolveComponent } from "vue";
import { TextControl } from "../controls/TextControl";
import { CompilerOptions } from "../../processor/processor";

export class OutputNumNode extends ReactiveNode<{ val: number }, { val: number }> {
    defaultOutputs = { val: 0 };

    liveValues = new Map<number, ObservableVariable<number>>()

    process(node: NodeData, silent?: boolean) {
        let operator: OperatorFunction<{ val: number }, { val: number }> = (obs: Observable<{ val: number }>): Observable<{ val: number }> => {

            let res = new ObservableVariable<{ val: number }>({ val: 0 });

            if (!silent)
                obs.subscribe(
                    (val) => (this.editor?.nodes.find(n => n.id == node.id)?.controls.get('preview') as NumControl).setValue(val.val)
                )
            else {
                res.set({ val: node.data.num as number })
            }

            return res;
        };

        return {
            operator: operator,
            id: 'node' + node.id,
            inputs: Object.keys(node.inputs),
            outputs: ['val']
        };
    }

    dependencys(node: NodeData) {
        return {};
    }


    data = {
        i18nKeys: ["numOut"],
        category: [["values"]]
    }

    constructor() {
        super("OutputNumNode");
    }

    override worker(node: NodeData, inputs: ReactiveInputs<{ val: number; }>, outputs: ReactiveIO<{ val: number; }> | { [key: string]: any; }, compilerOptions: CompilerOptions): void {
        super.worker(node, inputs, outputs, compilerOptions);
        if (compilerOptions.result) {
            let res = compilerOptions.result!;
            res.outputs[node.data.key as string] = ['node' + node.id, 'val'];
        }
    }

    async builder(node: RNode) {
        node.addInput(new Input('val', i18n(['num']) ?? 'number', SocketTypes.numSocket().valSocket));
        node.addControl(new NumControl((val: number) => { }, 'preview', true));
        node.addControl(new TextControl((val: string) => SpreadBoardEditor.instance?.trigger("process"), 'key', false));
    }
}
