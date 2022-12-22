import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {TextControl} from "../data/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../data/NumControl";

export class ModuleNode extends Component {

    data = {
        i18nKeys: ["module"],
        category: [["modules"]]
    }

    constructor(){
        super("Module");
    }

    async builder(node: RNode) {
        node.addControl(new TextControl((val:string)=>this.updateIos(val, node), 'id', false));
        node.addInput(new Input("eval", i18n(["eval"])??"Evaluate", SocketTypes.anySocket));
        this.updateIos(node.data.id as string, node);
    }

    updateIos(moduleId:string, node: Node){
        //console.log("Updating IO");
        let ios = SpreadBoardEditor.getIOS(moduleId);
        //console.log("new IO:", ios);

        node.inputs.forEach((input)=>{
            if(!ios.inputs.find((i)=>input.key == i.key) && input.key != "eval"){
                node.removeInput(input);
            }
        })

        node.outputs.forEach((output)=>{
            if(!ios.outputs.find((i)=>output.key == i.key)){
                node.removeOutput(output);
            }
        })

        ios.inputs.forEach((input)=>{
            if(!node.inputs.has(input.key))
            node.addInput(new Input(input.key,input.name, input.socket));
        });

        ios.outputs.forEach((output)=>{
            if(!node.outputs.has(output.key))
            node.addOutput(new Output(output.key,output.name, output.socket));
        });
        console.log()
        node.update();
    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        if(inputs["eval"][0] && inputs["eval"][0]==true)
            await SpreadBoardEditor.processModule(node.data.id as string, inputs, outputs);
    }
}

