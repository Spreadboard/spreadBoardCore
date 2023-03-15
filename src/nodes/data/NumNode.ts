import Rete, { Component, Node as RNode } from "rete";

import { NumControl } from "../controls/NumControl";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NodeCommand, CompilerNode, CompilerOptions, Command } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";

export class NumNode extends CompilerNode {
    compile(node: NodeData, worker_input_names: { [key: string]: Command }, worker_id: string): NodeCommand {
        return {
            node_id: node.id,
            commands: [{
                commands: `const ${worker_id} = ${node.data.num}`,
                node_id: node.id
            }],
            outputs: {
                'num': {
                    node_id: node.id,
                    commands: `${worker_id}`
                }
            },
            processDependencys: []
        }
    }

    process = (node: NodeData, outKey: string, inputConnection: CompilerIO, compilerOptions: CompilerOptions) => {
        switch (outKey) {
            case 'num':
                return (inputs: ProcessIO) => node.data.num;
            default:
                return (inputs: ProcessIO) => undefined;
        }
    };

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

