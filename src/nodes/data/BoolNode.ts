import Rete, {Component, Node as RNode} from "rete";

import {SocketTypes} from "../../sockets";
import {BoolControl} from "./BoolControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardEditor } from "../../editor";

export class BoolNode extends Component {

    category:string[] = ["Wahrheitswerte"];
    i18nKeys: string[] = ["bool"];
    constructor() {
        super("BoolNode");
    }

    async builder(node: RNode) {
        const out1 = new Rete.Output('bool', (this.editor as SpreadBoardEditor|null)?.i18n(["bool"])||"Boolean", SocketTypes.boolSocket().valSocket);

        node
            .addControl(new BoolControl((val: boolean) => this.editor?.trigger("process"), 'bool', false))
            .addOutput(out1);
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        outputs['bool'] = node.data.bool;
    }
}

