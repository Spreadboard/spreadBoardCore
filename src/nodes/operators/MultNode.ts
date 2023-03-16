import Rete, { Component, Node as RNode } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";

import { SocketTypes } from "../../processor/connections/sockets";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, startWith } from "rxjs";

export class MultNode extends SpreadNode<{ num: number, num2: number }, { res: number }> {


    operator = (nodeData: NodeData) => {
        console.log('Lege Operator an')
        return (nodeInputs: Observable<{ num: number, num2: number }>) =>
            (obs: Observable<{ [key: string]: any }>) =>
                combineLatest([nodeInputs, obs.pipe(startWith({}))]).pipe(map(
                    ([obj, _]) => {
                        let num = (obj.num ?? nodeData.data.num as number) ?? 0;
                        let num2 = (obj.num2 ?? nodeData.data.num2 as number) ?? 0;
                        let res = num * num2;
                        this.editor?.nodes.filter(n => n.id == nodeData.id).map(
                            node => {
                                let prev = node.controls.get('preview') as NumControl;
                                prev.setValue(res);
                            }
                        )
                        return { res }
                    }
                ));
    }

    data = {
        i18nKeys: ["mult"],
        category: [["operators"]]
    }
    constructor() {
        super("MultNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num', EditorManager.getInstance()?.i18n(["multIn"]) || "Addend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', EditorManager.getInstance()?.i18n(["multIn"]) || "Addend", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', EditorManager.getInstance()?.i18n(["res"]) || "Result", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false, EditorManager.getInstance()?.i18n(["multIn"]) || "Addend"))
        inp2.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num2', false, EditorManager.getInstance()?.i18n(["multIn"]) || "Addend"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((event: string, val: number) => { }, 'preview', true, EditorManager.getInstance()?.i18n(["res"]) || "Result"))
            .addOutput(out);
    }


}