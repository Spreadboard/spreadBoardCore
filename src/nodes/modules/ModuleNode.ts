import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { InputData, NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ModuleControl } from "../controls/ModuleControl";
import { AddIoControl } from "../controls/AddIoControl";

export class ModuleNode extends Component {

    data = {
        i18nKeys: ["module"],
        category: [["modules"]],
        custome_inputs : [],
        custome_outputs : [],
        module_inputs : [],
        module_outputs : [],
        add_control:null
    }

    constructor(){
        super("Module");
    }

    async builder(node: RNode) {
        let inpId = new Input('id', i18n(['id'])??'ID', SocketTypes.moduleSocket())
        inpId.addControl(new ModuleControl((module:string)=>this.updateIos(module, node), 'id', false));
        node.data.add_control = new AddIoControl(true,
            (title:string,type:Socket)=>
            {
                (node.data.custome_inputs as Input[]).push(new Input(title, title, type))
            },'addIo', 'Add In-/Output');
        node.addInput(inpId);
        node.addInput(new Input("eval", i18n(["eval"])??"Evaluate", SocketTypes.anySocket));
        this.updateIos(node.data.id as string, node);
    }

    updateIos(moduleId:string, node: Node){
        let inputs: {key:string, name:string, socket:Socket}[] = [];
        let outputs: {key:string, name:string, socket:Socket}[] = [];

        console.log('Test', node)
        if(node.inputs.get('id')?.hasConnection()){
            console.log('Test')
            inputs = node.data.custome_inputs as Input[];
            outputs = node.data.custome_outputs as Output[];
            if(!node.controls.has('addIo') && node.data.add_control)
                node.addControl(node.data.add_control as AddIoControl)
        }
        else{
            if(node.controls.get('addIo'))
                node.removeControl(node.controls.get('addIo')!);
            //console.log("Updating IO");
            let ios = SpreadBoardEditor.getIOS(moduleId);
            //console.log("new IO:", ios);

            node.inputs.forEach((input)=>{
                if(!ios.inputs.find((i)=>input.key == i.key) && input.key != "eval" && input.key != 'id'){
                    node.removeInput(input);
                }
            })

            inputs =  ios.inputs;
            outputs = ios.outputs;
        }


        node.outputs.forEach((output)=>{
            if(!outputs.find((i)=>output.key == i.key)){
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

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        if(inputs['id'] && inputs['id'].length>0 && this.editor?.nodes.find((n)=>n.id==node.id))
            this.updateIos(inputs['id'][0] as string,this.editor?.nodes.find((n)=>n.id==node.id)!);
        if(inputs["eval"][0] && inputs["eval"][0]==true)
            await SpreadBoardEditor.processModule(node.data.id as string, inputs, outputs);
    }
}

