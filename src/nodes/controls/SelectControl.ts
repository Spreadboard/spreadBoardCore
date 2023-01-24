import Rete, { Control } from "rete";
import VueSelectControl from "./VueSelectControl.vue"


export class SelectControl extends Control {
    private component: any;
    private props: Object;

    constructor(emitter: Function, key: string, readonly: boolean = false, options: string[] = ["test"], title: string | null = null) {
        super(key);
        this.component = VueSelectControl;
        this.props = { emitter, ikey: key, readonly, title: title, options: options };
    }

    setValue(val: number) {
        //@ts-ignore
        this.vueContext.value = val ?? 0;
    }
    getValue() {
        //@ts-ignore
        return this.vueContext.value ?? 0;
    }
}