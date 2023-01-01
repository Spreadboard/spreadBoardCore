import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { InputData, NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessControl } from "../controls/ProcessControl";
import { AddIoControl } from "../controls/AddIoControl";

export class ProcessSelectorNode extends Component {

    data = {
        i18nKeys: ["processSelector"],
        category: [["processes"]],
    }

    constructor(){
        super("ProcessSelector");
    }

    async builder(node: RNode) {
        node.addControl(new ProcessControl((process:string)=>{this.editor?.trigger('process'); console.log('Selected',process)}, 'selected', false));
        node.addOutput(new Output('process', 'process', SocketTypes.processSocket()))
    }
    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['process'] = node.data.selected;
    }
}

