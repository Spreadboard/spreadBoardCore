import Rete, { Control } from "rete";
import VueBoolControl from "./VueBoolControl.vue";


export class BoolControl extends Control {
    private component: any;
    private props: Object;
    vueContext:any;

    constructor(emitter: Function, key:string, readonly:boolean = false, title:string|null = null) {
        super(key);
        this.component = VueBoolControl;
        this.props = {readonly:readonly,  emitter:emitter, ikey: key, title: title};
    }

    setValue(val: boolean) {
        this.vueContext.value = val;
    }

    getValue() {
        return this.vueContext.value;
    }
}