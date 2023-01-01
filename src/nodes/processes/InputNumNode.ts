import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../controls/NumControl";
import { SpreadBoardStack } from "../../editor/variable";
import { ProcessData } from "../../editor/processor";

export class InputNumNode extends Component {

    data = {
        i18nKeys: ["numIn"],
        category: [["processes"]],
        process: {
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

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, processData: ProcessData) {
        let key = node.data.key as string;
        if(processData.processInputs && processData.processInputs[key]){
            let inp = processData.processInputs[key][0];
            //console.log("Taking input", key, inp)
            outputs['val'] = inp;
        }
        else{
            outputs['val'] = node.data.val ?? 0;
        }
    }


}

