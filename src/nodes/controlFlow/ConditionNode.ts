import Rete, { Connection, Input, Node as RNode, Output, Socket, Component } from "rete";
import { i18n } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessCommand, CompilerNode, CompilerOptions, Command } from "../CompilerNode";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";

export class ConditionNode extends CompilerNode {
    compile(node: NodeData, worker_input_name: { [key: string]: Command }, worker_id: string): ProcessCommand {
        return {
            node_id: node.id,
            commands: [],
            outputs: {
                res: {
                    node_id: node.id,
                    commands: [
                        {
                            node_id: node.id,
                            commands: ` ( ( `
                        },
                        worker_input_name.bool,
                        {
                            node_id: node.id,
                            commands: ` )?`
                        },
                        worker_input_name.if,
                        {
                            node_id: node.id,
                            commands: `:`
                        },
                        worker_input_name.else,
                        {
                            node_id: node.id,
                            commands: ` ) `
                        },

                    ]
                }
            },
            processDependencys: [],
        }
    }
    process =
        (node: NodeData, outKey: string, inputConnection: CompilerIO, compilerOptions: CompilerOptions) => {
            switch (outKey) {
                case 'res':
                    return (inputs: ProcessIO) => {

                        if (!compilerOptions.silent) {
                            const nodeComp: RNode | undefined = this.editor!.nodes!.find(n => n.id == node.id);
                            if (nodeComp) {
                                const ifConn = nodeComp.getConnections().find((value, index) => (value.input.key == 'if'));

                                const elseConn = nodeComp.getConnections().find((value, index) => (value.input.key == 'else'));

                                const resConn = nodeComp.getConnections().find((value, index) => (value.input.key == 'res'));


                                let socketType = SocketTypes.anySocket;


                                if (ifConn && ifConn.output.socket) {
                                    socketType = ifConn.output.socket;
                                } else if (elseConn && elseConn.output.socket) {
                                    socketType = elseConn.output.socket;
                                } else if (resConn && resConn.output.socket) {
                                    socketType = resConn.output.socket;
                                }


                                this.reconnectInput(nodeComp.inputs.get('if'), ifConn, socketType);
                                this.reconnectInput(nodeComp.inputs.get('else'), elseConn, socketType);
                                this.reconnectOutput(nodeComp.outputs.get('res'), resConn, socketType);
                            }
                        }

                        let res = (inputConnection['bool'](inputs)
                            ? (inputConnection['if'])
                            : (inputConnection['else']))
                        return res(inputs);
                    };
                default:
                    return (_: ProcessIO) => undefined;
            }
        }
        ;

    data = {
        i18nKeys: ["cond"],
        category: [["controlflow"]]
    }

    constructor() {
        super("ConditionNode");
    }

    async builder(node: RNode) {
        const inCondition = new Rete.Input('bool', i18n(["cond"]) ?? "Condition", SocketTypes.boolSocket().valSocket);
        const inIf = new Rete.Input('if', i18n(["if"]) ?? "If", SocketTypes.anySocket);
        const inElse = new Rete.Input('else', i18n(["else"]) ?? "Else", SocketTypes.anySocket);


        const outRes = new Rete.Output('res', i18n(["res"]) ?? "Result", SocketTypes.anySocket);


        node
            .addInput(inCondition)
            .addInput(inIf)
            .addInput(inElse)
            .addOutput(outRes);
    }

    reconnectOutput(output: Output | undefined, connection: Connection | undefined, newSocketType: Socket) {
        if (output) {
            if (!newSocketType.compatibleWith(output.socket))
                connection?.remove();
            output.socket = newSocketType;
        }
    }


    reconnectInput(input: Input | undefined, connection: Connection | undefined, newSocketType: Socket) {
        if (input) {
            if (!newSocketType.compatibleWith(input.socket))
                connection?.remove();
            input.socket = newSocketType;
        }
    }

}

