import { Component, NodeEditor } from "rete";
import { SpreadBoardEditor } from "./editor";



interface RetePlugin {
    name: string;
    install: (context: any, options?: any) => void;
}

export abstract class ComponentPlugin implements RetePlugin{
    name: string;
    components: Component[];
    constructor(name: string, components: Component[]){
        this.name = name;
        this.components = components;
    }
    install(editor: NodeEditor | SpreadBoardEditor, options?: any){
        if(typeof editor === typeof SpreadBoardEditor)
            (editor as SpreadBoardEditor).registerAll(this.components);
        else
            this.components.forEach(
                component => {
                    editor.register(component);
                }
            );
    }

}