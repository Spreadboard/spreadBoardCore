import Rete, { Component, Node as RNode } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { map } from "rxjs";
import EditorManager from "../../manager/EditorManager";
import { SocketTypes } from "../../manager/sockets";
import { NumControl } from "../controls/NumControl";
import { SpreadNode } from "../SpreadNode";


export class MultNode extends SpreadNode<{ num: number, num2: number }, undefined, { res: number }> {


    data = {
        i18n: ["mult"],
        category: [["operators"]],
        io: '' as '',
        operator: {
            projection: map(([{ num, num2 }, state]: [{ num: number, num2: number }, undefined]) => {
                return { res: num * num2 };
            }),
            initialState: undefined
        }
    }

    constructor() {
        super("Multiplication");
    }

    async builder(node: RNode): Promise<void> {
        let manager = EditorManager.getInstance();
        let i18n = manager!.i18n;

        const inp1 = new Rete.Input('num', i18n(["multIn"]) || "Faktor", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["multIn"]) || "Faktor", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"]) || "Ergebnis", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false, i18n(["multIn"]) || "Faktor"))
        inp2.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num2', false, i18n(["multIn"]) || "Faktor"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((event: string, val: number) => { }, 'preview', true, i18n(["res"]) || "Ergebnis"))
            .addOutput(out);
    }

}

