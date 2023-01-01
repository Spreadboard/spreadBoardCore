import Rete, { Control } from "rete";
import { SpreadBoardEditor } from "../../editor/editor";
import VueSelectControl from "./VueSelectControl.vue"


export class ModuleControl extends Control {
    private component: any;
    private props: Object;

    private options = SpreadBoardEditor.getModuleIDs().map(({index,id})=>id.replace('@0.1.0',''));

    constructor(emitter: Function, key:string, readonly:boolean = false, title:string | null = null) {
        super(key);
        this.component = VueSelectControl;
        const emit:Function = (index:any)=>{emitter(index)};
        this.props = { emitter:emit, ikey: key, readonly, title: title , options : this.options};
    }

}