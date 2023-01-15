import Rete, {Component, Node as RNode} from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {NumControl} from "../controls/NumControl";

import { SpreadBoardEditor, i18n } from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class MultNode extends CompilerNode {

    data = {
        i18nKeys: ["mult"],
        category: [["operators"]]
    }
    constructor(){
        super("MultNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',i18n(["multIn"])||"Addend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["multIn"])||"Addend", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"])||"Result", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, i18n(["multIn"])||"Addend"))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, i18n(["multIn"])||"Addend"))

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
                    const res: number = n1 * n2;

                    if(!compilerOptions.silent){
                        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('preview') as NumControl|undefined;
                        preview?.setValue(res);
                    }

                    return res;
                }
            default:
                return (inputs: ProcessIO)=>undefined;
    }};

    compile(node: NodeData, worker_input_name: string, worker_output_name: string): Command {
        return {
            command_string:
            `let ${node.name}_${node.id}_num1 = ${worker_input_name}.num1\n`+
            `if(${node.name}_${node.id}_num1 == undefined)\n`+
            `   ${node.name}_${node.id}_num1 = ${node.data.num1}\n`+
            `let ${node.name}_${node.id}_num2 = ${worker_input_name}.num2\n`+
            `if(${node.name}_${node.id}_num2 == undefined)\n`+
            `   ${node.name}_${node.id}_num2 = ${node.data.num2}\n`+
            `${worker_output_name}.res = ${node.name}_${node.id}_num1 * ${node.name}_${node.id}_num2\n`,
            outputs: {
                'res': `${worker_output_name}.res`
            },
            processDependencys: []
        }
    }
}