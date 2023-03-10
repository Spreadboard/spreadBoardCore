import Rete, { Socket as RSocket } from "rete";


class SocketType {
    readonly name: string;
    readonly refSocket: RSocket;
    readonly valSocket: RSocket;

    constructor(name: string) {
        this.name = name;
        this.refSocket = new RSocket(name + " ref");
        this.valSocket = new RSocket(name + " val");
    }
}


class SocketTypeMap {

    public anyTypeSocket = new SocketType("any");
    public anySocket = new RSocket("*");
    public typeSocket = new RSocket("type");

    private types: Map<string, SocketType>;

    typeList() {
        let types = Array.from(this.types.entries()).map(([name, socketType]) => socketType);
        let valtypes = types.map((socketType) => socketType.valSocket);
        let reftypes = types.map((socketType) => socketType.refSocket);
        return [this.anySocket, this.typeSocket, ...valtypes, ...reftypes].sort();
    }

    constructor() {
        this.types = new Map();
        this.anySocket.combineWith(this.anyTypeSocket.refSocket);
        this.anySocket.combineWith(this.anyTypeSocket.valSocket);

        this.anyTypeSocket.valSocket.combineWith(this.anySocket);
        this.anyTypeSocket.refSocket.combineWith(this.anySocket);
        this.types.set('any', this.anyTypeSocket);
    }

    add(typeName: string) {
        if (!(typeName in this.types.keys())) {
            const socket = new SocketType(typeName)
            this.types.set(typeName, socket);
            socket.refSocket.combineWith(this.anyTypeSocket.refSocket);
            socket.valSocket.combineWith(this.anyTypeSocket.valSocket);

            socket.valSocket.combineWith(this.anySocket);
            socket.refSocket.combineWith(this.anySocket);

            this.anyTypeSocket.refSocket.combineWith(socket.refSocket);
            this.anyTypeSocket.valSocket.combineWith(socket.valSocket);

            this.anySocket.combineWith(socket.refSocket);
            this.anySocket.combineWith(socket.valSocket);
        }
    }

    getRefByVal(socket: RSocket): RSocket {
        if (socket.name == "type" || socket.name == "*")
            return socket;
        return this.get(socket.name.replace(" val", ""))!.refSocket;
    }
    getValByRef(socket: RSocket): RSocket {
        if (socket.name == "type" || socket.name == "*")
            return socket;
        return this.get(socket.name.replace(" ref", ""))!.valSocket;
    }

    getSocket(socketName: string): RSocket | undefined {
        return this.typeList().find((s) => s.name == socketName);
    }

    get(typeName: string) {
        return this.types.get(typeName);
    }

    actSocket = () => this.get("act")!.valSocket;
    eventSocket = () => this.get("act")!.refSocket;
    numSocket = () => this.get("number")!;
    textSocket = () => this.get("text")!;
    boolSocket = () => this.get("boolean")!;
    processSocket = () => this.get('process')!.refSocket;
}
const types = new SocketTypeMap();

types.add("text");
types.add("number");
types.add("boolean");
types.add("act");
types.add("process");

types.numSocket().valSocket.combineWith(types.textSocket().valSocket);

export { SocketType, types as SocketTypes };
