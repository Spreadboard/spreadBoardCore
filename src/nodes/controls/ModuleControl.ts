import Rete, { Control } from "rete";
import { SpreadBoardEditor } from "../../editor/editor";
import VueSelectControl from "./VueSelectControl.vue"


export class ModuleControl extends Control {
    private component: any;
    private props: Object;

    private options(){
        return SpreadBoardEditor.getModuleIDs().map(({index,id})=>id);
    }

    constructor(emitter: Function, key:string, readonly:boolean = false, title:string | null = null) {
        super(key);
        this.component = VueSelectControl;
        this.props = { emitter, ikey: key, readonly, title: title , options : this.options()};
    }

    getData(key: string): number {
        return this.options().indexOf(this.getNode().data[key] as string)?? -1 ;
    }

    putData(key: string, data: number): void {
        this.getNode().data[key] = this.options()[data];
    }
}