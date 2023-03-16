import Rete, { Component, Node as RNode } from "rete";
import { SocketTypes } from "../../processor/connections/sockets";
import { BoolControl } from "../controls/BoolControl";
import { NumControl } from "../controls/NumControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, startWith } from "rxjs";

export class GreaterNode extends SpreadNode<{ num: number, num2: number }, { res: boolean }> {


    operator = (nodeData: NodeData) => {
        console.log('Lege Operator an')
        return (nodeInputs: Observable<{ num: number, num2: number }>) =>
            (obs: Observable<{ [key: string]: any }>) =>
                combineLatest([nodeInputs, obs.pipe(startWith({}))]).pipe(map(
                    ([obj, _]) => {
                        let num = (obj.num ?? nodeData.data.num as number) ?? 0;
                        let num2 = (obj.num2 ?? nodeData.data.num2 as number) ?? 0;
                        let res = num > num2;
                        this.editor?.nodes.filter(n => n.id == nodeData.id).map(
                            node => {
                                let prev = node.controls.get('preview') as BoolControl;
                                prev.setValue(res);
                            }
                        )
                        return { res }
                    }
                ));
    }

    data = {
        i18nKeys: ["greater"],
        category: [["operators"]]
    }
    compIn1 = () => EditorManager.getInstance()?.i18n(["compIn1"]) || "A";
    compIn2 = () => EditorManager.getInstance()?.i18n(["compIn1"]) || "B";
    res = () => EditorManager.getInstance()?.i18n(["res"]) || "Result";
    constructor() {
        super("GreaterNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num', this.compIn1(), SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', this.compIn2(), SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('bool', this.res(), SocketTypes.boolSocket().valSocket);

        inp1.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false, this.compIn1()))
        inp2.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num2', false, this.compIn2()))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new BoolControl((val: boolean) => { }, 'preview', true, this.res()))
            .addOutput(out);
    }

}