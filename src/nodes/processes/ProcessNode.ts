import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessControl } from "../controls/ProcessControl";
import { CompilerIO, Evaluation, ProcessIO } from "../../processor/connections/packet";
import { Command, CompilerNode, CompilerOptions } from "../CompilerNode";

export class ProcessNode extends CompilerNode {

    data = {
        i18nKeys: ["process"],
        category: [["processes"]],
        custome_inputs : [],
        custome_outputs : [],
    }

    constructor(){
        super("ProcessNode");
    }


    async builder(node: RNode) {
        //let inpId = new Input('id', i18n(['id'])??'ID', SocketTypes.processSocket())
        node.addControl(new ProcessControl((process:string)=>{console.log('UpdateIO',process);this.updateIos(process, node)}, 'id', false));
        node.data.externalSelector = node.data.externalSelector ?? false;
        //node.addInput(inpId);
        //node.addInput(new Input("eval", i18n(["eval"])??"Evaluate", SocketTypes.anySocket));
        this.updateIos(node.data.id as string, node);
    }

    updateIos(processId:string, node: Node){
        let inputs: {key:string, name:string, socket:Socket}[] = [];
        let outputs: {key:string, name:string, socket:Socket}[] = [];

        if(node.data.externalSelector){
            inputs = ((node.data.custome_inputs ?? []) as {key:string, name:string, socket:string}[]).map((obj:{key:string, name:string, socket:string})=>{return {
                key:obj.key, name:obj.name, socket:SocketTypes.getSocket(obj.socket)??SocketTypes.anySocket
            }});
            outputs = ((node.data.custome_outputs ?? []) as {key:string, name:string, socket:string}[]).map((obj:{key:string, name:string, socket:string})=>{return {
                key:obj.key, name:obj.name, socket:SocketTypes.getSocket(obj.socket)??SocketTypes.anySocket
            }});
        }
        else{
            if(node.controls.has('addIo'))
                node.removeControl(node.controls.get('addIo')!);
            //console.log("Updating IO");
            let ios = SpreadBoardEditor.getIOS(processId);
            //console.log("new IO:", ios);

            inputs =  ios.inputs;
            outputs = ios.outputs;
        }


        node.inputs.forEach((input)=>{
            input.connections.forEach((con)=>{
                this.editor?.removeConnection(con);
                con.remove();
            });
            node.removeInput(input);
        })


        node.outputs.forEach((output)=>{
            output.connections.forEach((con)=>{
                this.editor?.removeConnection(con);
                con.remove();
            });
            node.removeOutput(output);
        })

        inputs.forEach((input)=>{
            if(!node.inputs.has(input.key))
            node.addInput(new Input(input.key,input.name, input.socket));
        });

        outputs.forEach((output)=>{
            if(!node.outputs.has(output.key))
            node.addOutput(new Output(output.key,output.name, output.socket));
        });
        
        node.update();
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: CompilerIO, compilerOptions:CompilerOptions) {

        //console.log("Update io");
        let connected = inputs['id'] && inputs['id'].length>0;
        let nodeComp = this.editor?.nodes.find((n)=>n.id==node.id);
        let id = connected ? inputs['id'][0] : node.data.id;
        if(nodeComp && ((!node.data.externalSelector && connected) || ( node.data.externalSelector && !connected))){
            nodeComp.data.externalSelector = connected;
            this.updateIos(inputs['id'][0] as string,nodeComp!);
        }
        //console.log("now passing on");
        super.worker(node,inputs, outputs, compilerOptions);
    }


    process = (node: NodeData, outKey: string, inputConnections: CompilerIO, compilerOptions: CompilerOptions) =>{

        let func = SpreadBoardEditor.instance!.processProcess(node.data.id as string);

        return (processI0: ProcessIO)=>{
            let externalInput: ProcessIO = {};
            Object.keys(inputConnections).forEach(
                (inputKey)=>{
                    externalInput[inputKey]= inputConnections[inputKey](processI0);
                }
            );

            //console.log("Process",node.data.id, inputConnections, Object.keys(processI0));
            if(!func){
                func = SpreadBoardEditor.instance!.processProcess(node.data.id as string);
                console.log("Fetching the Compiled Process");
            }
            if (func){
                let result;
                try{
                    result = func(externalInput);
                }catch(e){
                    console.log("Error During:", func.toString())
                }
                if(result && result[outKey]){
                    //console.log(evaluate);
                    return result[outKey];
                }else{
                    console.trace();
                }
            }
        }
    };


    compile(node: NodeData, worker_input_names: {[key:string]:string}, worker_output_name: string): Command {

        let function_id = node.data.id as string;

        let out = SpreadBoardEditor.getIOS(function_id).outputs;

        let outputs: {[key:string]:string} = {}

        let a;

        out.forEach(({key})=>{
            outputs[key] = ` (${function_id}(${node.name}_${node.id}_temp).${key}) `;
        });
        let command_string = `let ${node.name}_${node.id}_temp = {}\n`;
        Object.keys(worker_input_names).forEach((key)=>{
            command_string = command_string + `${node.name}_${node.id}_temp.${key} = ${worker_input_names[key]}\n`
        })

        return {
            inputsNeeded: true,
            command_string:command_string,
            outputs: outputs,
            processDependencys: [function_id]
        }
    }
}

