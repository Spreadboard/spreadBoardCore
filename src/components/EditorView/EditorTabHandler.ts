export abstract class EditorTabHandler {
    private static currCallerId: number = 0;
    private static callers: Map<string, (() => void)> = new Map();

    public static removeListener(id: number) {
        this.callers.delete(id.toString());
    }

    public static onChange(caller: () => void) {
        let id = ++this.currCallerId;
        this.callers.set(id.toString(), caller);
        return id;
    }

    private static currTab: string | undefined = undefined;
    public static getOpenTab() { return this.currTab };
    private static openTabs: string[] = [];
    public static getOpenTabs() { return [...this.openTabs] }
    private static update() {
        this.callers.forEach((caller) => caller())
    }
    public static openTab(id: string) {
        this.currTab = id;
        if (!this.openTabs.find((t) => t == id)) this.openTabs.push(id);
        this.update();
    }
    public static closeTab(id: string) {
        this.openTabs = this.openTabs.filter((t) => t != id)
        if (this.currTab == id) this.currTab = this.openTabs[this.openTabs.length - 1];
        this.update();

    }
}