import Rete, { Component, Node as RNode } from "rete";

import { NumControl } from "../controls/NumControl";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ReactiveInputs, ReactiveIO, ReactiveNode } from "../ReactiveNode";
import { ObservableVariable } from "../../processor/variable";
import { Observable, OperatorFunction } from "rxjs";
import { resolveComponent } from "vue";
import { TextControl } from "../controls/TextControl";
import { CompilerOptions } from "../../processor/processor";

export class InputNumNode extends ReactiveNode<{ num: number }, { num: number }> {
    defaultOutputs = { num: 0 };

    liveValues = new Map<number, ObservableVariable<number>>()

    process(node: NodeData, silent?: boolean) {
        return {
            operator: (obs: Observable<{ num: number }>) => obs,
            id: 'node' + node.id,
            inputs: ['x'],
            outputs: Object.keys(node.outputs)
        };
    }

    dependencys(node: NodeData) {
        return {};
    }


    data = {
        i18nKeys: ["numIn"],
        category: [["values"]]
    }

    constructor() {
        super("InputNumNode");
    }

    worker(node: NodeData, inputs: ReactiveInputs<{ num: number; }>, outputs: ReactiveIO<{ num: number; }> | { [key: string]: any; }, compilerOptions: CompilerOptions): void {
        super.worker(node, inputs, outputs, compilerOptions);
        if (compilerOptions.result) {
            let trans = compilerOptions.result!.tranformers;
            let t = trans[trans.length - 1];
            t.compilerInputs['x'] = ['inputs', node.data.id as string]
        }

    }


    async builder(node: RNode) {
        const out1 = new Rete.Output('val', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => { if (this.editor) this.liveValues.get(node.id)?.set(val) }, 'val', false));
        node.addControl(new TextControl((val: string) => SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addOutput(out1);
    }
}
