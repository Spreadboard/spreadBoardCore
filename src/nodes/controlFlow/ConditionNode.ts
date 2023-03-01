import Rete, { Connection, Input, Node as RNode, Output, Socket, Component } from "rete";
import EditorManager from "../../manager/EditorManager";
import { SpreadNode } from "../SpreadNode";
import { SocketTypes } from '../../manager/sockets'
import { map, Observable } from "rxjs";

export class ConditionNode extends SpreadNode<{ 'bool': boolean, 'if': any, 'else': any }, {}, { res: any }> {

    data = {
        i18n: ["cond"],
        category: [["controlflow"]],
        io: '' as '',
        operator: {
            projection: map(([{ 'bool': b, 'if': i, 'else': e }, state]: [{ 'bool': boolean, 'if': any, 'else': any }, {}]) => {
                return b ? i : e;
            }),
            initialState: {}
        }
    }

    constructor() {
        super("ConditionNode");
    }

    async builder(node: RNode) {
        let manager = EditorManager.getInstance();
        let i18n = manager!.i18n;
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

