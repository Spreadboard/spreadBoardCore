import Rete, { Component, Node as RNode } from "rete";

import { NumControl } from "../controls/NumControl";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ReactiveNode } from "../ReactiveNode";
import { ObservableVariable } from "../../processor/variable";
import { Observable, OperatorFunction } from "rxjs";
import { resolveComponent } from "vue";

export class NumNode extends ReactiveNode<{}, { num: number }> {
    defaultOutputs = { num: 0 };

    liveValues = new Map<number, ObservableVariable<number>>()

    process(node: NodeData, silent?: boolean) {
        let operator: OperatorFunction<{}, { num: number }> = (obs: Observable<{}>): Observable<{ num: number }> => {

            let res = new ObservableVariable<{ num: number }>({ num: 0 });

            if (!silent)
                this.liveValues.get(node.id)?.subscribe(
                    (val) => {
                        res.set({
                            num: val
                        })
                    });
            else {
                res.set({ num: node.data.num as number })
            }

            return res;
        };

        return {
            operator: operator,
            id: 'node' + node.id,
            inputs: Object.keys(node.inputs),
            outputs: Object.keys(node.outputs)
        };
    }

    dependencys(node: NodeData) {
        return {};
    }


    data = {
        i18nKeys: ["num"],
        category: [["values"]]
    }

    constructor() {
        super("NumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('num', i18n(["num"]) || "Number", SocketTypes.numSocket().valSocket);

        if (this.editor)
            this.liveValues.set(node.id, new ObservableVariable<number>(0));
        node
            .addControl(new NumControl((val: number) => this.liveValues.get(node.id)?.set(val), 'num', false))
            .addOutput(out1);
    }
}
