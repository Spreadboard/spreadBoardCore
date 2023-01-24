import { SpreadBoardEditor } from "../../editor/editor";

export abstract class EditorTabHandler {
    private static currCallerId: number = 0;
    private static callers: Map<string, ((tab: string | undefined, tabs: string[]) => void)> = new Map();

    public static removeListener(id: number) {
        this.callers.delete(id.toString());
    }

    public static onChange(caller: (tab: string | undefined, tabs: string[]) => void) {
        let id = ++this.currCallerId;
        this.callers.set(id.toString(), caller);
        return id;
    }

    private static currTab: string | undefined = undefined;

    public static getOpenTab() { return this.currTab };
    private static openTabs: string[] = [];
    public static getOpenTabs() { return [...this.openTabs] }
    private static update() {
        this.callers.forEach((caller) => caller(this.currTab, [...this.openTabs]))
    }
    public static openTab(id: string) {
        console.log(SpreadBoardEditor.getProcesses());
        this.currTab = id;
        if (!this.openTabs.find((t) => t == id)) this.openTabs.push(id);
        this.update();
    }
    public static closeTab(id: string) {
        let oldIndex = this.openTabs.findIndex((t) => t == id);
        this.openTabs = this.openTabs.filter((t) => t != id)
        if (this.currTab == id) this.currTab = this.openTabs[
            Math.min(oldIndex, this.openTabs.length - 1)
        ];
        this.update();

    }
}