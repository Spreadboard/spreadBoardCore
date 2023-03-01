import Rete, { Component, Node as RNode } from "rete";

import { BoolControl } from "../controls/BoolControl";
import { NumControl } from "../controls/NumControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadNode } from "../SpreadNode";
import { map } from "rxjs";
import { SocketTypes } from "../../manager/sockets";
import EditorManager from "../../manager/EditorManager";

export class GreaterNode extends SpreadNode<{ num: number, num2: number }, undefined, { res: boolean }> {


    data = {
        i18n: ["greater"],
        category: [["operators"]],
        io: '' as '',
        operator: {
            projection: map(([{ num, num2 }, state]: [{ num: number, num2: number }, undefined]) => {
                return { res: num > num2 };
            }),
            initialState: undefined
        }
    }

    constructor() {
        super("Greater");
    }

    async builder(node: RNode): Promise<void> {
        let manager = EditorManager.getInstance();
        let i18n = manager!.i18n;

        const inp1 = new Rete.Input('num', i18n(["compIn1"]) ?? "A", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["compIn2"]) ?? "B", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('bool', i18n(['res']) ?? 'Result', SocketTypes.boolSocket().valSocket);

        inp1.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false, i18n(["compIn1"]) ?? "A"))
        inp2.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num2', false, i18n(["compIn2"]) ?? "B"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new BoolControl((val: boolean) => { }, 'preview', true, i18n(['res']) ?? 'Result'))
            .addOutput(out);
    }

}