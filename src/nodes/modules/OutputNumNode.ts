import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../editor/variable";

export class OutputNumNode extends Component {

    data = {
        i18nKeys: ["numOut"],
        category: [["modules"]],
        module: {
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

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, stack?:SpreadBoardStack, moduleInputs?:WorkerInputs, moduleOuputs?:WorkerOutputs) {
        if(moduleOuputs){
            let outp = inputs['val'][0];
            //console.log("Putting output", node.data.key,outp);
            moduleOuputs[node.data.key as string] = outp;
        }else{
            node.data.val = inputs['val'][0];
            let preview = this.editor?.nodes.find((n:RNode)=>{return n.id == node.id})?.controls.get('val') as NumControl|undefined;
    
            preview?.setValue(inputs['val'][0] as number);
        }
    }
}

