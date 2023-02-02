import Rete, { Component, Input, Node, Node as RNode, Output, Socket } from "rete";

import { i18n, SpreadBoardEditor } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessControl } from "../controls/ProcessControl";
import { ReactiveInputs, ReactiveIO, ReactiveNode } from "../ReactiveNode";
import { CompilerOptions, Transformer } from "../../processor/processor";

export class ProcessNode extends ReactiveNode<any, any> {

    process(node: NodeData, silent?: boolean | undefined): Transformer<any, any> {
        return !silent ? (SpreadBoardEditor.instance!.processTransform(node.data.id as string) ?? {
            id: 'node' + node.id,
            inputs: [],
            outputs: [],
            operator: `${node.data.id as string}`
        }) : {
            id: 'node' + node.id,
            inputs: [],
            outputs: [],
            operator: `${node.data.id as string}`
        };
    }

    dependencys(node: NodeData): { [key: string]: string | string[]; } {
        let id = node.data.id as string;
        let key: string = `@/${id}`;
        return { key: id };
    }
    defaultOutputs: any;

    data = {
        i18nKeys: ["process"],
        category: [["processes"]],
    }

    constructor() {
        super("ProcessNode");
    }


    async builder(node: RNode) {
        node.addControl(new ProcessControl((process: string) => { this.updateIos(process, node) }, 'id', false));
        this.updateIos(node.data.id as string, node);
    }

    override worker(node: NodeData, inputs: ReactiveInputs<any>, outputs: ReactiveIO<any> | { [key: string]: any; }, compilerOptions: CompilerOptions): void {
        if (this.editor != undefined && !compilerOptions.silent)
            this.updateIos(node.data.id as string, this.editor.nodes.find(n => n.id = node.id)!);
        super.worker(node, inputs, outputs, compilerOptions);
    }

    updateIos(processId: string, node: Node) {
        let inputs: { key: string, name: string, socket: Socket }[] = [];
        let outputs: { key: string, name: string, socket: Socket }[] = [];

        let ios = SpreadBoardEditor.getIOS(processId);

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

}

