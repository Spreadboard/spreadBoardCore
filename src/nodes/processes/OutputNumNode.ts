import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../processor/variable";
import { ProcessData } from "../../processor/processor";

export class OutputNumNode extends Component {

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

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, processData: ProcessData) {
        if(processData.processOutputs){
            let outp = inputs['val'][0];
            //console.log("Putting output", node.data.key,outp);
            processData.processOutputs[node.data.key as string] = outp;
        }else{
            node.data.val = inputs['val'][0];
            let preview = this.editor?.nodes.find((n:RNode)=>{return n.id == node.id})?.controls.get('val') as NumControl|undefined;
    
            preview?.setValue(inputs['val'][0] as number);
        }
    }
}

