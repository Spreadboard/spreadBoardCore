import Rete, { Component, Node as RNode } from "rete";

import { TextControl } from "../controls/TextControl";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { NodeCommand, CompilerNode, CompilerOptions, Command } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";


export class InputNumNode extends CompilerNode {

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

    process = (node: NodeData, outKey: string, inputConnection: CompilerIO, compilerOptions: CompilerOptions) => {
        switch (outKey) {
            case 'val':
                return function inputNum(inputs: ProcessIO) {
                    let key = node.data.key as string;
                    let val = (compilerOptions.silent) ? inputs[key] : node.data.val ?? 0;
                    return val;
                };
            default:
                return (inputs: ProcessIO) => undefined;
        }
    };


    compile(node: NodeData, worker_input_names: { [key: string]: Command }, worker_output_name: string): NodeCommand {
        return {
            node_id: node.id,
            commands: [],
            outputs: {
                val: {
                    node_id: node.id,
                    commands: `inputs.${node.data.key as string}`
                }
            },
            processDependencys: []
        }
    }


}

