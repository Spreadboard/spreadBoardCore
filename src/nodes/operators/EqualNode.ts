import Rete, { Node as RNode } from "rete";
import { NodeData } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";

import { SocketTypes } from "../../processor/connections/sockets";
import { ReactiveNode } from "../ReactiveNode";
import { fromObservable, ObservableVariable, seperate } from "../../processor/variable";
import { combineLatest, Observable, OperatorFunction } from "rxjs";
import { i18n } from "../../editor/editor";
import { BoolControl } from "../controls/BoolControl";

export class EqualNode extends ReactiveNode<{ num: number, num2: number }, { bool: boolean }> {
    defaultOutputs = { bool: false };


    liveValues = new Map<number, ObservableVariable<number>>()
    liveValues2 = new Map<number, ObservableVariable<number>>()

    process(node: NodeData, silent?: boolean) {
        let operator: OperatorFunction<{ num: number, num2: number }, { bool: boolean }> = (obs: Observable<{ num: number, num2: number }>): Observable<{ bool: boolean }> => {

            let res = new ObservableVariable<{ bool: boolean }>({ bool: false });

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
                        bool: val.num == val.num2
                    })
                }
            )

            if (!silent) {
                res.subscribe(
                    (val: { bool: boolean }) =>
                        (this.editor?.nodes.find(n => n.id == node.id)?.controls.get('preview') as BoolControl)?.setValue(val.bool)
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
        i18nKeys: ["equal"],
        category: [["operators"]]
    }
    constructor() {
        super("EqualNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num', "A", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', "B", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('bool', i18n(["res"]) || "Result", SocketTypes.boolSocket().valSocket);

        if (this.editor) {
            this.liveValues.set(node.id, new ObservableVariable<number>(0));
            this.liveValues2.set(node.id, new ObservableVariable<number>(0));
        }

        inp1.addControl(new NumControl((val: number) => this.liveValues.get(node.id)?.set(val), 'num', false, "A"))
        inp2.addControl(new NumControl((val: number) => this.liveValues2.get(node.id)?.set(val), 'num2', false, "B"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new BoolControl((val: number) => { }, 'preview', true, i18n(["res"]) || "Result"))
            .addOutput(out);
    }

}