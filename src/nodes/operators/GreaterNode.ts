import Rete, {Component, Node as RNode} from "rete";
import {i18n } from "../../editor/editor";
import {SocketTypes} from "../../processor/connections/sockets";
import { BoolControl } from "../controls/BoolControl";
import {NumControl} from "../controls/NumControl";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export class GreaterNode extends Component {
    category:string[] = ["Mathe"];

    data = {
        i18nKeys: ["greater"],
        category: [["operators"]]
    }
    compIn1 = ()=>i18n(["compIn1"]) || "A";
    compIn2 = ()=>i18n(["compIn1"]) || "B";
    res = ()=>i18n(["res"]) || "Result";
    constructor(){
        super("GreaterNode");
    }

    async builder(node: RNode): Promise<void> {
        const inp1 = new Rete.Input('num',this.compIn1(), SocketTypes.numSocket().valSocket);
        const inp2 = new Rete.Input('num2', this.compIn2(), SocketTypes.numSocket().valSocket);
        const out = new Rete.Output('bool', this.res(), SocketTypes.boolSocket().valSocket);

        inp1.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num', false, this.compIn1()))
        inp2.addControl(new NumControl((val:number)=>this.editor?.trigger("process"), 'num2', false, this.compIn2()))

        node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new BoolControl((val:boolean)=>{}, 'preview', true, this.res()))
            .addOutput(out);
    }
    worker(node: NodeData, inputs:WorkerInputs, outputs:WorkerOutputs, ...args: any) {
        const n1: number = (<number>(inputs['num'].length ? inputs['num'][0] : node.data.num)) ||0;
        const n2: number = <number>(inputs['num2'].length?inputs['num2'][0]:node.data.num2) ||0;
        const compare: boolean = n1 > n2;

        const preview = this.editor?.nodes?.find((n: RNode) => n.id == node.id)?.controls.get('preview') as BoolControl|undefined;

        preview?.setValue(compare);
        outputs['bool'] = compare;
    }
}