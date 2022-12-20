import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../data/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../data/NumControl";

export class OutputNumNode extends Component {

    data = {
        i18nKeys: ["numOut"],
        category: [["modules"],["values"]],
        module: {
            type : "output",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor(){
        super("OutputNumNode");
    }

    async builder(node: RNode) {
        const in1 = new Rete.Input('num', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);
        
        node.addControl(new NumControl((val:number)=>SpreadBoardEditor.instance?.trigger("process"), 'num', true));
        node.addControl(new TextControl((val:string)=>SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addInput(in1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        node.data.num = inputs['num'][0];
    }
}

