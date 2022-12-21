import Rete, {Component, Node as RNode} from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import {NumControl} from "../data/NumControl";

import { SpreadBoardEditor, i18n } from "../../editor/editor";
import {SocketTypes} from "../../editor/sockets";

export class AddNode extends Component {

    data = {
        i18nKeys: ["add"],
        category: [["operators"]]
    }
    constructor(){
        super("Addition");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',i18n(["addIn"])||"Addend", SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', i18n(["addIn"])||"Addend", SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('num', i18n(["res"])||"Result", SocketTypes.numSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, i18n(["addIn"])||"Addend"))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, i18n(["addIn"])||"Addend"))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl((event:string,val:number)=>{}, 'preview', true, i18n(["res"])||"Result"))
            .addOutput(out);
    }

    worker(node: NodeData, inputs:WorkerInputs, outputs:WorkerOutputs, ...args: any) {
        const n1: number = inputs['num'][0] as number ?? node.data.num as number  ?? 0;
        const n2: number = inputs['num2'][0] as number ?? node.data.num2 as number  ?? 0;
        const sum: number = n1 + n2;
        
        console.log("Added", n1,"+",n2+"=",sum);
        const preview = this.editor?.nodes?.find((n:RNode) => n.id == node.id)?.controls.get('preview') as NumControl|undefined;
        
        preview?.setValue(sum);
        outputs['num'] = sum;
    }
}