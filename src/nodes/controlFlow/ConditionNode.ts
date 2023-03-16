import Rete, { Connection, Input, Node as RNode, Output, Socket, Component } from "rete";
import { SocketTypes } from "../../processor/connections/sockets";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { CompilerIO, ProcessIO } from "../../processor/connections/packet";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { combineLatest, map, Observable, OperatorFunction, startWith } from "rxjs";

export class ConditionNode extends SpreadNode<{ bool: boolean, if: any, else: any }, { res: any }> {
    operator = (nodeData: NodeData) =>
        (nodeInputs: Observable<{ bool: boolean; if: any; else: any; }>) =>
            (obs: Observable<{ [key: string]: any }>) =>
                combineLatest([nodeInputs, obs.pipe(startWith({}))]).pipe(map(
                    ([nodein, _]) => nodein.bool ? nodein.if : nodein.else
                ));

    data = {
        i18nKeys: ["cond"],
        category: [["controlflow"]]
    }

    constructor() {
        super("ConditionNode");
    }

    async builder(node: RNode) {
        const inCondition = new Rete.Input('bool', EditorManager.getInstance()?.i18n(["cond"]) ?? "Condition", SocketTypes.boolSocket().valSocket);
        const inIf = new Rete.Input('if', EditorManager.getInstance()?.i18n(["if"]) ?? "If", SocketTypes.anySocket);
        const inElse = new Rete.Input('else', EditorManager.getInstance()?.i18n(["else"]) ?? "Else", SocketTypes.anySocket);


        const outRes = new Rete.Output('res', EditorManager.getInstance()?.i18n(["res"]) ?? "Result", SocketTypes.anySocket);

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

