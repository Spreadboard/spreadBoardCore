import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../editor/variable";

export class InputNumNode extends Component {

    data = {
        i18nKeys: ["numIn"],
        category: [["modules"]],
        module: {
            type : "input",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor(){
        super("InputNumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('val', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val:number)=>SpreadBoardEditor.instance?.trigger("process"), 'val', false));
        node.addControl(new TextControl((val:string)=>SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, stack?:SpreadBoardStack, moduleInputs?:WorkerInputs, moduleOuputs?:WorkerOutputs) {
        let key = node.data.key as string;
        if(moduleInputs && moduleInputs[node.id.toString()]){
            let inp = moduleInputs[node.id.toString()][0];
            //console.log("Taking input", key, inp)
            outputs['val'] = inp;
        }
        else{
            outputs['val'] = node.data.val ?? 0;
        }
    }


}

