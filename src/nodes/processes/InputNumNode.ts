import Rete, { Component, Node as RNode } from "rete";

import { TextControl } from "../controls/TextControl";
import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../processor/variable";
import { NodeCommand, CompilerNode, CompilerOptions, Command } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";


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
        const out1 = new Rete.Output('val', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val: number) => SpreadBoardEditor.instance?.trigger("process"), 'val', false));
        node.addControl(new TextControl((val: string) => SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addOutput(out1);
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

