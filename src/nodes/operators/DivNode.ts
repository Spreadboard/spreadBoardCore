import Rete, { Node as RNode } from "rete";
import { NodeData } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";

import { SocketTypes } from "../../processor/connections/sockets";
import { ReactiveNode } from "../ReactiveNode";
import { fromObservable, ObservableVariable, seperate } from "../../processor/variable";
import { combineLatest, Observable, OperatorFunction } from "rxjs";
import { i18n } from "../../editor/editor";

export class DivNode extends ReactiveNode<{ num: number, num2: number }, { num: number }> {
    defaultOutputs = { num: 0 };


    liveValues = new Map<number, ObservableVariable<number>>()
    liveValues2 = new Map<number, ObservableVariable<number>>()

    process(node: NodeData, silent?: boolean) {
        let operator: OperatorFunction<{ num: number, num2: number }, { num: number }> = (obs: Observable<{ num: number, num2: number }>): Observable<{ num: number }> => {

            let res = new ObservableVariable<{ num: number }>({ num: 0 });

            let { num, num2 } = seperate(fromObservable(obs, { num: 0, num2: 0 }));

            if (!silent) {
                if (node.inputs.num.connections.length == 0 && this.liveValues.has(node.id)) {
                    num = this.liveValues.get(node.id)!;
                }
                if (node.inputs.num2.connections.length == 0 && this.liveValues2.has(node.id))
                    num2 = this.liveValues2.get(node.id)!;
                obs = combineLatest({ num, num2 });
            }

            obs.subscribe(
                (val) => {
                    res.set({
                        num: val.num / val.num2
                    })
                }
            )

            if (!silent) {
                res.subscribe(
                    (val: { num: number }) =>
                        (this.editor?.nodes.find(n => n.id == node.id)?.controls.get('preview') as NumControl)?.setValue(val.num)
                )
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
        i18nKeys: ["div"],
        category: [["operators"]]
    }
    constructor() {
        super("DivNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num', i18n(["divIn"]) || "Dividend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["divIn"]) || "Divisor", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"]) || "Result", SocketTypes.numSocket().valSocket);

        if (this.editor) {
            this.liveValues.set(node.id, new ObservableVariable<number>(0));
            this.liveValues2.set(node.id, new ObservableVariable<number>(0));
        }

        inp1.addControl(new NumControl((val: number) => this.liveValues.get(node.id)?.set(val), 'num', false, i18n(["divIn"]) || "Dividend"))
        inp2.addControl(new NumControl((val: number) => this.liveValues2.get(node.id)?.set(val), 'num2', false, i18n(["divIn"]) || "Divisor"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((val: number) => { }, 'preview', true, i18n(["res"]) || "Result"))
            .addOutput(out);
    }

}