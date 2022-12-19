import Rete, {Component, Node as RNode} from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {NumControl} from "../data/NumControl";

import { SpreadBoardEditor, i18n } from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";

export class SubNode extends Component {

    data = {
        i18nKeys: ["sub"],
        category: [["operators"]]
    }
    constructor(){
        super("Difference");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',i18n(["subIn"])||"Minuend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["subIn2"])||"Subrtahend", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"])||"Result", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, i18n(["subIn"])||"Minuend"))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, i18n(["subIn2"])||"Subrtahend"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((event:string,val:number)=>{}, 'preview', true, i18n(["res"])||"Result"))
            .addOutput(out);
    }

    worker(node: NodeData, inputs:WorkerInputs, outputs:WorkerOutputs, ...args: any) {
        const n1: number = (<number>(inputs['num'].length ? inputs['num'][0] : node.data.num))||0;
        const n2: number = <number>(inputs['num2'].length?inputs['num2'][0]:node.data.num2)||0;
        const sum: number = n1 - n2;

        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('preview') as NumControl|undefined;
        
        preview?.setValue(sum);
        outputs['num'] = sum;
    }
}