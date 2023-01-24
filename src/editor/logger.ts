
import { toHandlers } from "vue";
import InfoVue from "../components/Info.vue";
import { Item } from "../context-menu";

type Stringify<T> = (content: T) => string;
type LogLevel = 'log' | 'error' | 'warn' | 'info';

type LogItem<T> = {
    loggerName: string,
    content: T[],
    level: LogLevel
    stringify?: Stringify<T>
}

export class Logger {
    private name: string;
    private logs: LogItem<any>[] = [];
    private static lastId = 0;
    private subscriptions: {
        [key: string]: ((item: LogItem<any>) => void) | undefined
    } = {}

    constructor(name: string) {
        this.name = name;
        this.log("Init");
    }

    private static stringify(item: LogItem<any>, json?: boolean): any[] {
        return ((item.stringify) ? item.content.map(item.stringify) : (json ? item.content.map((c) => JSON.stringify(c)) : item.content));
    }

    private static introString(item: LogItem<any>) {
        return `(${item.loggerName})${(item.level == 'error') ? ' Error' : ((item.level == 'warn') ? ' Warn' : '')}:`
    }

    private static writeToConsole(item: LogItem<any>) {
        console.log(this.introString(item), ...this.stringify(item));
    }

    export(): string {
        return Logger.export(this.logs);
    }

    static export(logs: LogItem<any>[]): string {
        return logs.map<string>(
            (item) => this.introString(item) + " " + Logger.stringify(item, true)
        ).reduce((prev: string, curr: string) => `${prev}\n${curr}`);
    }

    write<T>(log: T[], level: LogLevel = 'log', stringify?: Stringify<T>): void {
        let item: LogItem<T> = {
            content: log,
            loggerName: this.name,
            level: 'log',
            stringify: stringify
        }

        Object.keys(this.subscriptions).forEach(
            (key: string) => this.subscriptions[key] ? this.subscriptions[key]!(item) : undefined
        );
        this.logs.push(item);
        Logger.writeToConsole(item);
    }

    log<T>(...log: T[]) { this.write(log) }

    info<T>(...log: T[]) { this.write(log, 'info') }

    error<T>(...log: T[]) { this.write(log, 'error') }

    warn<T>(...log: T[]) { this.write(log, 'warn') }

    onWrite(exec: ((item: LogItem<any>) => void)) {
        const id = (Logger.lastId++).toString();
        this.subscriptions[id] = exec;
        return id;
    }

    cancelSubscription(id: number) {
        this.subscriptions[id] = undefined;
    }

}