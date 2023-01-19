import Rete, { Control } from "rete";
import { ValueControl } from "./ValueControl";
import VueBoolControl from "./VueBoolControl.vue";


export class BoolControl extends ValueControl<boolean> {
    private component: any;
    private props: Object;
    vueContext: any;

    constructor(emitter: Function, key: string, readonly: boolean = false, title: string | null = null) {
        super(false, key);
        this.component = VueBoolControl;
        this.props = { readonly: readonly, emitter: emitter, ikey: key, title: title };
    }
}