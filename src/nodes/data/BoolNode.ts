import Rete, { Component, Node as RNode } from "rete";

import { BoolControl } from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadNode } from "../SpreadNode";
import { map } from "rxjs";
import EditorManager from '../../manager/EditorManager';
import { SocketTypes } from "../../manager/sockets";

export class BoolNode extends SpreadNode<{}, boolean, { res: boolean }> {

    data = {
        i18n: ["bool"],
        category: [["values"]],
        io: '' as '',
        operator: {
            projection: map(([{ }, state]: [{}, boolean]) => {
                return { res: state }
            }),
            initialState: false
        }
    }

    constructor() {
        super("BoolNode");
    }

    async builder(node: RNode) {

        let manager = EditorManager.getInstance();
        let i18n = manager!.i18n;

        const out1 = new Rete.Output('bool', i18n(["bool"]) || "Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => { this.editor?.trigger("process"); this.operators.get(node.id)?.[1].setInitial(val) }, 'bool', false))
            .addOutput(out1);
    }
}

