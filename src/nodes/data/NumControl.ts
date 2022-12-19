import Rete, { Control } from "rete";
//@ts-ignore
import VueNumControl from "./VueNumControl.vue";


export class NumControl extends Control {
    private component: any;
    private props: Object;

    constructor(emitter: Function, key:string, readonly:boolean = false, title:string|null = null) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly, title: title };
    }

    setValue(val: number) {
        //@ts-ignore
        this.vueContext.value = val;
    }
    getValue() {
        //@ts-ignore
        return this.vueContext.value;
    }
}