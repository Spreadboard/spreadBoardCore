import Rete, { Control } from "rete";
import { ValueControl } from "./ValueControl";
//@ts-ignore
import VueNumControl from "./VueNumControl.vue";


export class NumControl extends ValueControl<number> {
    private component: any;
    private props: Object;

    constructor(emitter: Function, key:string, readonly:boolean = false, title:string | null = null) {
        super(0,key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly, title: title };
    }

}