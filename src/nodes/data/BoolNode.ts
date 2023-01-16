import Rete, {Component, Node as RNode} from "rete";

import {BoolControl} from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class BoolNode extends CompilerNode {
    compile(node: NodeData, worker_input_names: {[key:string]:string}, worker_id: string): Command {
        return {
            command_string: `${worker_id}_result = ${node.data.bool}`,
            outputs: {
                'bool': `${worker_id}_result`
            },
            processDependencys: []
        }
    }
    
    process = (node: NodeData,outKey: string, inputConnection:CompilerIO, compilerOptions:CompilerOptions)=>{
        switch (outKey){
            case 'bool': 
                return (inputs: ProcessIO)=>node.data.bool;
            default:
                return (inputs: ProcessIO)=>undefined;
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
        const out1 = new Rete.Output('bool', i18n(["bool"])||"Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => this.editor?.trigger("process"), 'bool', false))
            .addOutput(out1);
    }
}

