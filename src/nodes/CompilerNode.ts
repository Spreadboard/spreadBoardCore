import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Evaluation, CompilerIO, ProcessIO } from "../processor/connections/packet";

import uuidUtils from 'uuid'

export type CompilerOptions = {
    silent: boolean,
    compilerOutputs?: CompilerIO,
    compilerCommands?:Command[],
    options?:{
        [key:string]:any
    }
}

export type Command = {
    inputsNeeded:boolean,
    outputs:{[key:string]:string}
    processDependencys:string[],
    command_string:string
}

export abstract class CompilerNode extends Component{

    abstract compile(node: NodeData, worker_input_names:{[key:string]:string}, worker_output_name:string):Command;
    
    abstract process:(node: NodeData,outkey:string, inputConnections:CompilerIO, compilerOptions:CompilerOptions)=>Evaluation<any>;

    worker(node: NodeData, inputs: WorkerInputs, outputs: CompilerIO|{[key:string]:string}, compilerOptions:CompilerOptions) {


        if(compilerOptions.compilerCommands) //Compile the whole Process
        {

            let worker_input_names: {[key:string]:string} = {}

            Object.keys(inputs).forEach( (key) =>worker_input_names[key]=(inputs[key][0] as string))

            let worker_output_name = "output_"+node.name.toLowerCase()+"_"+node.id;

            let command = this.compile(node, worker_input_names, worker_output_name);

            let stitches: string = "";
            Object.keys(inputs).forEach((key)=>{

                let command_out = inputs[key][0] as string;
                let stitch = `${worker_input_names}.${key} = ${command_out}\n`;
                stitches = stitches + stitch;
            });

            command.command_string =
            (command.command_string.length>0?
                (`\n//Init Outputs ${node.name}\n`+
                `let ${worker_output_name} = {}\n`+
                `//Process Node ${node.name}-${node.id}\n`+
                `${command.command_string}`):""
                )
            

            compilerOptions.compilerCommands.push(command);
            
            Object.keys(node.outputs).forEach(
                (key)=>{
                    outputs[key] = command.outputs[key];
                }
            )

            return;
        }
        else //Process the Node Live
        {
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
}