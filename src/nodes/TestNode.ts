import { Component, Input, Node, Socket } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { AddIoControl } from "./controls/AddIoControl";

export class TestNode extends Component{
    constructor(){
        super('TestNode')
    }
    data={
        custome_inputs :[]
    }
    async builder(node: Node) {
        node.data.custome_inputs = node.data.custome_inputs ?? [];
        node.addControl(new AddIoControl(true,
            (title:string,type:Socket)=>
            {
                (node.data.custome_inputs as Input[]).push(new Input(title, title, type))
            },'val'))
    }
    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
    }

}