import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Evaluation, CompilerIO, ProcessIO } from "../processor/connections/packet";

export type CompilerOptions = {
    silent: boolean,
    compilerOutputs?: CompilerIO,
    options?:{
        [key:string]:any
    }
}


export abstract class CompilerNode extends Component{
    
    abstract process:(node: NodeData,outkey:string, inputConnections:CompilerIO, compilerOptions:CompilerOptions)=>Evaluation<any>;

    worker(node: NodeData, inputs: WorkerInputs, outputs: CompilerIO, compilerOptions:CompilerOptions) {

        let evaluateInputs: CompilerIO = {};
        Object.keys(inputs).forEach(
            (key: string)=>{
                evaluateInputs[key] = 
                    (inputs[key].length>0)
                    ?(inputs[key][0] as Evaluation<any>)
                    : (_)=>{return undefined};
        });

        Object.keys(node.outputs).forEach(
            (outKey: string)=>{
                outputs[outKey] = this.process(node,outKey,evaluateInputs,compilerOptions);
            }
        );
        
        //console.log(node.outputs);
        if(!compilerOptions.silent){
            //console.log("Non-Silent",node.name);
            if((Object.keys(node.outputs).find((outKey)=>node.outputs[outKey].connections.length==0) || Object.keys(node.outputs).length==0)){
                for (let outKey of Object.keys(node.outputs)){
                    this.process(node,outKey,evaluateInputs,compilerOptions)({});
                }
            }
        }else{
            //console.log("Silent",node.name);
        }
    }
}