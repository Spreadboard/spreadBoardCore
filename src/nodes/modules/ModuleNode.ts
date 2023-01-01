import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { InputData, NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ModuleControl } from "../controls/ModuleControl";
import { AddIoControl } from "../controls/AddIoControl";
import { ProcessData } from "../../editor/processor";

export class ModuleNode extends Component {

    data = {
        i18nKeys: ["module"],
        category: [["modules"]],
        custome_inputs : [],
        custome_outputs : [],
    }

    constructor(){
        super("Module");
    }

    addIoControl(node: Node){
        return new AddIoControl(true,
            (title:string,type:Socket, dir:boolean)=>
            {
                let io = {key:title,name:title,socket:type.name};
                if(dir){
                    if(!node.data.custome_outputs)
                        node.data.custome_outputs = [] as {key:string, name:string, socket:Socket}[];
                    (node.data.custome_outputs as {key:string, name:string, socket:string}[]).push(io)
                }
                else{
                    if(!node.data.custome_inputs)
                        node.data.custome_inputs = [] as {key:string, name:string, socket:Socket}[];
                    (node.data.custome_inputs as {key:string, name:string, socket:string}[]).push(io)
                }
                this.updateIos(node.data.id as string, node);
            },'addIo', 'Add In-/Output');
    }

    async builder(node: RNode) {
        let inpId = new Input('id', i18n(['id'])??'ID', SocketTypes.moduleSocket())
        inpId.addControl(new ModuleControl((module:string)=>{console.log('UpdateIO',module);this.updateIos(module, node)}, 'id', false));
        node.data.externalSelector = node.data.externalSelector ?? false;
        console.log('Ext',node.data.externalSelector,node)
        node.addInput(inpId);
        //node.addInput(new Input("eval", i18n(["eval"])??"Evaluate", SocketTypes.anySocket));
        this.updateIos(node.data.id as string, node);
    }

    updateIos(moduleId:string, node: Node){
        let inputs: {key:string, name:string, socket:Socket}[] = [];
        let outputs: {key:string, name:string, socket:Socket}[] = [];

        console.log('Test', node)
        if(node.data.externalSelector){
            console.log('Test')
            inputs = ((node.data.custome_inputs ?? []) as {key:string, name:string, socket:string}[]).map((obj:{key:string, name:string, socket:string})=>{return {
                key:obj.key, name:obj.name, socket:SocketTypes.getSocket(obj.socket)??SocketTypes.anySocket
            }});
            outputs = ((node.data.custome_outputs ?? []) as {key:string, name:string, socket:string}[]).map((obj:{key:string, name:string, socket:string})=>{return {
                key:obj.key, name:obj.name, socket:SocketTypes.getSocket(obj.socket)??SocketTypes.anySocket
            }});;
            if(!node.controls.has('addIo'))
                node.addControl(this.addIoControl(node))
        }
        else{
            if(node.controls.has('addIo'))
                node.removeControl(node.controls.get('addIo')!);
            //console.log("Updating IO");
            let ios = SpreadBoardEditor.getIOS(moduleId);
            //console.log("new IO:", ios);

            inputs =  ios.inputs;
            outputs = ios.outputs;
        }


        node.inputs.forEach((input)=>{
            if(!inputs.find((i)=>input.key == i.key) && input.key != "eval" && input.key != 'id'){
                input.connections.forEach((con)=>{
                    con.remove();
                });
                node.removeInput(input);
            }
        })


        node.outputs.forEach((output)=>{
            if(!outputs.find((i)=>output.key == i.key)){
                output.connections.forEach((con)=>{
                    con.remove();
                });
                node.removeOutput(output);
            }
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

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, processData: ProcessData) {
        let connected = inputs['id'] && inputs['id'].length>0;
        let nodeComp = this.editor?.nodes.find((n)=>n.id==node.id);
        let id = connected ? inputs['id'][0] : node.data.id;
        if(nodeComp && ((!node.data.externalSelector && connected) || ( node.data.externalSelector && !connected))){
            nodeComp.data.externalSelector = connected;
            this.updateIos(inputs['id'][0] as string,nodeComp!);
        }
        if(id != undefined && id != null){
            const uuid = Math.round(Math.random()*100);
            //console.log("(",uuid,") Starting Process", id as string, "with Inputs", inputs);
            await SpreadBoardEditor.processModule(id as string, inputs, outputs, processData?.path);
            //console.log("(",uuid,") Result",id as string,'in',inputs,'out',outputs)
        }
    }
}

