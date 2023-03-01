import Rete, { Component, Node as RNode } from "rete";
import { map } from "rxjs";
import EditorManager from "../../manager/EditorManager";
import { SocketTypes } from "../../manager/sockets";

import { NumControl } from "../controls/NumControl";
import { SpreadNode } from "../SpreadNode";

export class NumNode extends SpreadNode<{}, number, { res: number }> {

    data = {
        i18n: ["bool"],
        category: [["values"]],
        io: '' as '',
        operator: {
            projection: map(([{ }, state]: [{}, number]) => {
                return { res: state }
            }),
            initialState: 0
        }
    }

    constructor() {
        super("NumNode");
    }

    async builder(node: RNode) {

        let manager = EditorManager.getInstance();
        let i18n = manager!.i18n;

        const out1 = new Rete.Output('num', i18n(["num"]) || "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false)).addOutput(out1);
    }
}

