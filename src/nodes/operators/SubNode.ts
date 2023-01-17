import Rete, {Component, Node as RNode} from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {NumControl} from "../controls/NumControl";

import { SpreadBoardEditor, i18n } from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class SubNode extends CompilerNode {

    data = {
        i18nKeys: ["sub"],
        category: [["operators"]]
    }
    constructor(){
        super("Difference");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',i18n(["subIn"])||"Minuend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["subIn2"])||"Subrtahend", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"])||"Result", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, i18n(["subIn"])||"Minuend"))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, i18n(["subIn2"])||"Subrtahend"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((event:string,val:number)=>{}, 'preview', true, i18n(["res"])||"Result"))
            .addOutput(out);
    }

    process = (node: NodeData,outKey:string, inputConnection:CompilerIO, compilerOptions:CompilerOptions)=>{
        switch(outKey){
            case 'num':
                return (inputs: ProcessIO)=>{
                    const n1: number = inputConnection['num'](inputs) as number ?? node.data.num as number  ?? 0;
                    const n2: number = inputConnection['num2'](inputs) as number ?? node.data.num2 as number  ?? 0;
                    const res: number = n1 - n2;

                    if(!compilerOptions.silent){
                        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('preview') as NumControl|undefined;
                        preview?.setValue(res);
                    }

                    return res;
                }
            default:
                return (inputs: ProcessIO)=>undefined;
    }};

    compile(node: NodeData, worker_input_names: {[key:string]:string}, worker_id: string): Command {


        let num = (worker_input_names.num)?worker_input_names.num:node.data.num??0;
        let num2 = (worker_input_names.num2)?worker_input_names.num2:node.data.num2??0;
        
        return {
            node_id: node.id,
            command_string: "",
            outputs: {
                'num': ` ( ${num} - ${num2} ) `
            },
            processDependencys: []
        }
    }
}