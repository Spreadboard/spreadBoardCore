import Rete, { Component, Node as RNode } from "rete";

import { TextControl } from "../controls/TextControl";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData } from "rete/types/core/data";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, OperatorFunction } from "rxjs";
import { NumControl } from "../controls/NumControl";

export class OutputNumNode extends SpreadNode<{ val: number }, { [key: string]: any }> {

    operator = (nodeData: NodeData) => (nodeInputs: Observable<{ val: number; }>) => (processInput: Observable<{ [key: string]: any }>) =>
        combineLatest([nodeInputs, processInput]).pipe(map(
            ([{ val }, _]: [{ val: number }, any]) => {
                let obj: { [key: string]: any } = {};
                obj[nodeData.data.key as string] = val;
                return obj;
            }
        ));



    data = {
        i18nKeys: ["numOut"],
        category: [["processes"]],
        process: {
            type: "output",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor() {
        super("OutputNumNode");
    }

    async builder(node: RNode) {
        const in1 = new Rete.Input('val', EditorManager.getInstance()?.i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => { }, 'val', true));
        node.addControl(new TextControl((val: string) => this.editor?.trigger("process"), 'key', false)).addInput(in1);
    }

}

