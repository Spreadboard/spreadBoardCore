import Rete, {Component, Node as RNode} from "rete";

import {BoolControl} from "../controls/BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {i18n, SpreadBoardEditor} from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";

export class BoolNode extends Component {


    data = {
        i18nKeys: ["bool"],
        category: [["values"]]
    }

    constructor() {
        super("BoolNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('bool', i18n(["bool"])||"Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => this.editor?.trigger("process"), 'bool', false))
            .addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['bool'] = node.data.bool;
    }
}

