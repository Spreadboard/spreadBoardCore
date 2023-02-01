import Rete, { Connection, Input, Node as RNode, Output, Socket, Component } from "rete";
import { i18n } from "../../editor/editor";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ReactiveIO, ReactiveNode } from "../ReactiveNode";
import { combineLatest, Observable, OperatorFunction } from "rxjs";
import { ObservableVariable } from "../../processor/variable";
import { Transformer } from "../../processor/processor";

export class ConditionNode extends ReactiveNode<{ bool: boolean, if: any, else: any }, { res: any }> {
    defaultOutputs = { res: null };

    process(node: NodeData) {
        let operator: OperatorFunction<{ bool: boolean, if: any, else: any }, { res: any }> = (obs: Observable<{ bool: boolean, if: any, else: any }>): Observable<{ res: any }> => {
            let res = new ObservableVariable<{ res: any }>({ res: undefined });
            obs.subscribe(
                (val) => {

                    res.set({
                        res:
                            val.bool ? val.if : val.else
                    })
                }
            )


            return res;
        };

        return {
            operator: operator,
            id: 'node' + node.id,
            inputs: Object.keys(node.inputs),
            outputs: Object.keys(node.outputs)
        } as Transformer<{ bool: boolean, if: any, else: any }, { res: any }>;
    }

    dependencys(node: NodeData) {
        return {};
    }

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

