import Rete, { Control } from "rete";
import EditorManager from "../../manager/EditorManager";
import VueSelectControl from "./VueSelectControl.vue"


export class ProcessControl extends Control {
    private component: any;
    private props: Object;

    private options = EditorManager.getInstance()?.getProcesses();

    constructor(emitter: Function, key: string, readonly: boolean = false, title: string | null = null) {
        super(key);
        this.component = VueSelectControl;
        const emit: Function = (index: any) => { emitter(index) };
        this.props = { emitter: emit, ikey: key, readonly, title: title, options: this.options };
    }

}