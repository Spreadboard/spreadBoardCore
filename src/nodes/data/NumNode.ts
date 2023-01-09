import Rete, {Component, Node as RNode} from "rete";

import {NumControl} from "../controls/NumControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class NumNode extends CompilerNode {

    process = (node: NodeData,outKey: string, inputConnection:CompilerIO, compilerOptions:CompilerOptions)=>{
        switch (outKey){
            case 'num': 
                return (inputs: ProcessIO)=>node.data.num;
            default:
                return (inputs: ProcessIO)=>undefined;
        }
    };
    
    data = {
        i18nKeys: ["num"],
        category: [["values"]]
    }

    constructor(){
        super("NumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('num', i18n(["num"])||"Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val:number)=>SpreadBoardEditor.instance?.trigger("process"), 'num', false)).addOutput(out1);
    }
}

