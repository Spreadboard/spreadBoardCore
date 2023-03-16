import Rete, { Component, Input, Node, Node as RNode, Output, Socket } from "rete";

import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessControl } from "../controls/ProcessControl";
import { CompilerIO, Evaluation, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, OperatorFunction, startWith } from "rxjs";

export class ProcessNode extends SpreadNode<{ [key: string]: any }, { [key: string]: any }> {

    operator = (nodeData: NodeData) => (nodeInputs: Observable<{ [key: string]: any; }>) => (processInputs: Observable<{ [key: string]: any }>) =>
        combineLatest([nodeInputs, processInputs]).pipe(
            startWith([{}, {}]),
            map(([nodeInput, processInput]) => nodeInput),
            (obs: Observable<{ [key: string]: any }>) => (EditorManager.getInstance()?.getOperator(nodeData.data.id as string) ?? map(a => { return {} }))(obs)
        );

    data = {
        i18nKeys: ["process"],
        category: [["processes"]],
    }

    constructor() {
        super("ProcessNode");
    }


    async builder(node: RNode) {
        //let inpId = new Input('id', i18n(['id'])??'ID', SocketTypes.processSocket())
        node.addControl(new ProcessControl((process: string) => { this.updateIos(process, node) }, 'id', false));
        //node.addInput(inpId);
        //node.addInput(new Input("eval", i18n(["eval"])??"Evaluate", SocketTypes.anySocket));
        this.updateIos(node.data.id as string, node);
    }

    updateIos(processId: string, node: Node) {
        let inputs: { key: string, name: string, socket: Socket }[] = [];
        let outputs: { key: string, name: string, socket: Socket }[] = [];

        let ios = EditorManager.getInstance()?.getIOS(processId) ?? { inputs: [], outputs: [] };

        inputs = ios.inputs;
        outputs = ios.outputs;


        node.inputs.forEach((input) => {
            if (!inputs.find((i) => input.key == i.key)) {
                input.connections.forEach((con) => {
                    this.editor?.removeConnection(con);
                    con.remove();
                });
                node.removeInput(input);
            }
        })


        node.outputs.forEach((output) => {
            if (!outputs.find((o) => output.key == o.key)) {
                output.connections.forEach((con) => {
                    this.editor?.removeConnection(con);
                    con.remove();
                });
                node.removeOutput(output);
            }
        })

        inputs.forEach((input) => {
            if (!node.inputs.has(input.key))
                node.addInput(new Input(input.key, input.name, input.socket));
        });

        outputs.forEach((output) => {
            if (!node.outputs.has(output.key))
                node.addOutput(new Output(output.key, output.name, output.socket));
        });

        node.update();
    }

    worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, outputOperators: OperatorFunction<{ [key: string]: any }, { [key: string]: any }>[]) {
        let nodeComp = this.editor?.nodes.find((n) => n.id == node.id);
        if (nodeComp)
            this.updateIos(node.data.id as string, nodeComp);

        super.worker(node, inputs, outputs, outputOperators);
    }

}

