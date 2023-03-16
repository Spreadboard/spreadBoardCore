import Rete, { Component, Node as RNode } from "rete";

import { TextControl } from "../controls/TextControl";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { map, Observable, OperatorFunction } from "rxjs";


export class InputNumNode extends SpreadNode<{}, { val: number }> {

    operator = (nodeData: NodeData) => (nodeInputs: Observable<{}>) => map((input: { [key: string]: any }) => input[nodeData.data['key'] as string] ?? (nodeData.data.val as number));

    data = {
        i18nKeys: ["numIn"],
        category: [["processes"]],
        process: {
            type: "input",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor() {
        super("InputNumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('val', EditorManager.getInstance()?.i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'val', false));
        node.addControl(new TextControl((val: string) => this.editor?.trigger("process"), 'key', false)).addOutput(out1);
    }


}

