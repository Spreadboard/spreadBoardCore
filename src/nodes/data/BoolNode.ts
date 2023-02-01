import Rete, { Component, Node as RNode } from "rete";

import { BoolControl } from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { ObservableVariable } from "../../processor/variable";
import { combineLatest, Observable, OperatorFunction } from "rxjs";
import { ReactiveNode } from "../ReactiveNode";

export class BoolNode extends ReactiveNode<{}, { bool: boolean }> {
    defaultOutputs = { bool: false };

    liveValues = new Map<number, ObservableVariable<boolean>>()

    process(node: NodeData, silent?: boolean) {
        let operator: OperatorFunction<{}, { bool: boolean }> = (obs: Observable<{}>): Observable<{ bool: boolean }> => {

            let res = new ObservableVariable<{ bool: boolean }>({ bool: false });

            if (!silent)
                this.liveValues.get(node.id)?.subscribe(
                    (val) => {
                        res.set({
                            bool: val
                        })
                    });
            else {
                res.set({ bool: node.data.bool as boolean })
            }

            return res;
        };


        return {
            operator: operator,
            id: 'node' + node.id,
            inputs: Object.keys(node.inputs),
            outputs: Object.keys(node.outputs)
        };
    }

    dependencys(node: NodeData) {
        return {};
    }


    data = {
        i18nKeys: ["bool"],
        category: [["values"]]
    }

    constructor() {
        super("BoolNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('bool', i18n(["bool"]) || "Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => this.liveValues.get(node.id)?.set(val), 'bool', false))
            .addOutput(out1);
    }
}

