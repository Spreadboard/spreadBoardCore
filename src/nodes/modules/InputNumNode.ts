import Rete, {Component, Node as RNode} from "rete";

import {TextControl} from "../data/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { NumControl } from "../data/NumControl";

export class InputNumNode extends Component {

    data = {
        i18nKeys: ["numIn"],
        category: [["modules"],["values"]],
        module: {
            type : "input",
            socket: SocketTypes.numSocket().valSocket
        }
    }

    constructor(){
        super("InputNumNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('num', i18n(["num"]) ?? "Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val:number)=>SpreadBoardEditor.instance?.trigger("process"), 'num', false));
        node.addControl(new TextControl((val:string)=>SpreadBoardEditor.instance?.trigger("process"), 'key', false)).addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['num'] = node.data.num ?? 0;
    }
}

