import Rete, { Component, Node as RNode } from "rete";

import { BoolControl } from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SocketTypes } from "../../processor/connections/sockets";
import EditorManager from '../../manager/EditorManager';
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, startWith } from "rxjs";

export class BoolNode extends SpreadNode<{}, { bool: boolean }> {


    operator = (nodeData: NodeData) =>
        (nodeInputs: Observable<{}>) =>
            (obs: Observable<{ [key: string]: any }>) =>
                combineLatest([nodeInputs, obs.pipe(startWith({}))]).pipe(map(
                    (_) => {
                        let bool = nodeData.data.bool as boolean ?? false;
                        return { bool }
                    }
                ));

    data = {
        i18nKeys: ["bool"],
        category: [["values"]]
    }

    constructor() {
        super("BoolNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('bool', EditorManager.getInstance()?.i18n(["bool"]) || "Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => this.editor?.trigger("process"), 'bool', false))
            .addOutput(out1);
    }
}

