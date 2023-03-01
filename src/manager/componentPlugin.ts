import { Component, NodeEditor } from "rete";



interface RetePlugin {
    name: string;
    install: (context: any, options?: any) => void;
}

export class ComponentPlugin implements RetePlugin {
    name: string;
    components: Component[];
    constructor(name: string, components: Component[]) {
        this.name = name;
        this.components = components;
    }
    install(editor: NodeEditor, options?: any) {
        this.components.forEach(
            component => {
                editor.register(component);
            }
        );
    }

}