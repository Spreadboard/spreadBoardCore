import Rete, {Component, Node as RNode} from "rete";
import {i18n } from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { BoolControl } from "../controls/BoolControl";
import {NumControl} from "../controls/NumControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class GreaterNode extends CompilerNode {
    category:string[] = ["Mathe"];

    data = {
        i18nKeys: ["greater"],
        category: [["operators"]]
    }
    compIn1 = ()=>i18n(["compIn1"]) || "A";
    compIn2 = ()=>i18n(["compIn1"]) || "B";
    res = ()=>i18n(["res"]) || "Result";
    constructor(){
        super("GreaterNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',this.compIn1(), SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', this.compIn2(), SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('bool', this.res(), SocketTypes.boolSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, this.compIn1()))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, this.compIn2()))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new BoolControl((val:boolean)=>{}, 'preview', true, this.res()))
            .addOutput(out);
    }

    process = (node: NodeData,outKey:string, inputConnection:CompilerIO, compilerOptions:CompilerOptions)=>{
        switch(outKey){
            case 'bool':
                return (inputs: ProcessIO)=>{
                    const n1: number = inputConnection['num'](inputs) as number ?? node.data.num as number  ?? 0;
                    const n2: number = inputConnection['num2'](inputs) as number ?? node.data.num2 as number  ?? 0;
                    const res: boolean = n1 > n2;

                    if(!compilerOptions.silent){
                        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('preview') as BoolControl|undefined;
                        preview?.setValue(res);
                    }

                    return res;
                }
            default:
                return (inputs: ProcessIO)=>undefined;
    }};

    compile(node: NodeData, worker_input_names: {[key:string]:string}, worker_output_name: string): Command {

        let num = (worker_input_names.num)?worker_input_names.num:node.data.num??0;
        let num2 = (worker_input_names.num2)?worker_input_names.num2:node.data.num2??0;
        
        
        return {
            command_string: "",
            outputs: {
                'bool': `( ${num} > ${num2} )`
            },
            processDependencys: []
        }
    }
}