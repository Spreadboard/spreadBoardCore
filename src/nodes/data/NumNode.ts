import Rete, { Component, Node as RNode } from "rete";

import { NumControl } from "../controls/NumControl";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, startWith } from "rxjs";

export class NumNode extends SpreadNode<{}, { num: number }> {


    operator = (nodeData: NodeData) =>
        (nodeInputs: Observable<{}>) =>
            (obs: Observable<{ [key: string]: any }>) =>
                combineLatest([nodeInputs, obs.pipe(startWith({}))]).pipe(map(
                    (_) => {
                        let num = nodeData.data.num as number ?? 0;
                        console.log(`NumNode: ${num}`);
                        return { num }
                    }
                ));

    data = {
        i18nKeys: ["num"],
        category: [["values"]]
    }

    constructor() {
        super("NumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('num', EditorManager.getInstance()?.i18n(["num"]) || "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => this.editor?.trigger("process"), 'num', false)).addOutput(out1);
    }
}

