import { Control, Node } from "rete";
import VueAddIoControl from './VueAddIoControl.vue';

export class AddIoControl extends Control{
    private component: any;
    private props: Object;

    constructor(input: boolean, emitter: Function, key:string,title:string | null = null) {
        super(key);
        this.component = VueAddIoControl;
        this.props = {
            input,
            emitter,
            description: title 
        };
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