import Rete, {Control } from "rete";
//@ts-ignore
import VueTextControl from "./VueTextControl.vue";


export class TextControl extends Control {
    private component: any;
    private props: any;

    constructor(emitter: Function, key:string, readonly:boolean = false, title: string|null = null) {
        super(key);
        this.component = VueTextControl;
        this.props = { emitter, ikey: key, readonly , title: title};
    }

    setValue(val:string) {
        //@ts-ignore
        this.vueContext.value = val;
    }
}