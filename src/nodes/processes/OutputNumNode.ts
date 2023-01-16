import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../processor/variable";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";
import { CompilerIO, Evaluation, ProcessIO } from "../../processor/connections/packet";

export class OutputNumNode extends CompilerNode {

    data = {
        i18nKeys: ["numOut"],
        category: [["processes"]],
        process: {
            type : "output",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor(){
        super("OutputNumNode");
    }

    async builder(node: RNode) {
        const in1 = new Rete.Input('val', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);
        
        node.addControl(new NumControl((val:number)=>{}, 'val', true));
        node.addControl(new TextControl((val:string)=>SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addInput(in1);
    }

    process = (node: NodeData, outKey:string, inputConnection:CompilerIO, compilerOptions:CompilerOptions) => {
        switch (outKey) {
            case 'res':
                return (inputs: ProcessIO)=>{
                    let val =inputConnection['val'](inputs);
                    //console.log("Outputting->",val);
                    //console.log("Out silent:",compilerOptions.silent);


                    if(!compilerOptions.silent){
                        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('val') as NumControl|undefined;
                        preview?.setValue(val);
                    }


                    return val;
                }
            default:
                return (inputs: ProcessIO)=>undefined;
        }
    };

    compile(node: NodeData, worker_input_names: {[key:string]:string}, worker_output_name: string): Command {
        return {
            command_string: `output.${node.data.key as string} = ${worker_input_names.val}`,
            outputs: {},
            processDependencys:[]
        }
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: CompilerIO, compilerOptions:CompilerOptions): void {
        super.worker(node, inputs,outputs,compilerOptions);
        
        const key = node.data.key as string;
        const inputEval = inputs['val'][0] as Evaluation<number>??((_:ProcessIO)=>undefined)

        let proc = this.process(node,"res",{'val': inputEval},compilerOptions) ?? ( (_)=>{return undefined});


        if(compilerOptions.compilerOutputs){
            //console.log("Outputs:",key,"->",inputEval);
            compilerOptions.compilerOutputs[key] = proc; 
        }
        if(!compilerOptions.silent){
            //console.log("Output-Not-Silent",proc);
            proc({});
        }
    }

}

