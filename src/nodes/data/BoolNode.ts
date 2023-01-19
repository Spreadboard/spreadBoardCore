import Rete, { Component, Node as RNode } from "rete";

import { BoolControl } from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { ProcessCommand, CompilerNode, CompilerOptions, Command } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class BoolNode extends CompilerNode {
    compile(node: NodeData, worker_input_names: { [key: string]: Command }, worker_id: string): ProcessCommand {
        return {
            node_id: node.id,
            commands: [{
                commands: `const ${worker_id} = ${node.data.bool}`,
                node_id: node.id
            }],
            outputs: {
                'bool': {
                    node_id: node.id,
                    commands: `${worker_id}`
                }
            },
            processDependencys: []
        }
    }

    process = (node: NodeData, outKey: string, inputConnection: CompilerIO, compilerOptions: CompilerOptions) => {
        switch (outKey) {
            case 'bool':
                return (inputs: ProcessIO) => node.data.bool;
            default:
                return (inputs: ProcessIO) => undefined;
        }
    };

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
            .addControl(new BoolControl((val: boolean) => this.editor?.trigger("process"), 'bool', false))
            .addOutput(out1);
    }
}

