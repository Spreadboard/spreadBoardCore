import Rete, {Component, Node as RNode} from "rete";

import {NumControl} from "./NumControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class NumNode extends Component {

    data = {
        i18nKeys: ["num"],
        category: [["values"]]
    }

    constructor(){
        super("Number");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('num', i18n(["num"])||"Number", SocketTypes.numSocket().valSocket);

        node.addControl(new NumControl((val:number)=>SpreadBoardEditor.instance?.trigger("process"), 'num', false)).addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['num'] = node.data.num;
    }
}

