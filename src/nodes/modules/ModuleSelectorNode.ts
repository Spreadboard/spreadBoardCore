import Rete, {Component, Input, Node, Node as RNode, Output, Socket} from "rete";

import {TextControl} from "../controls/TextControl";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";
import { InputData, NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ModuleControl } from "../controls/ModuleControl";
import { AddIoControl } from "../controls/AddIoControl";

export class ModuleSelectorNode extends Component {

    data = {
        i18nKeys: ["module"],
        category: [["modules"]],
    }

    constructor(){
        super("ModuleSelector");
    }

    async builder(node: RNode) {
        node.addControl(new ModuleControl((module:string)=>{this.editor?.trigger('process'); console.log('Selected',module)}, 'selected', false));
        node.addOutput(new Output('module', 'module', SocketTypes.moduleSocket()))
    }
    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['module'] = node.data.selected;
    }
}

