
import { DefaultConfig, EditorConfig } from "./EditorConfig";


//Rete
import { Component, Emitter, NodeEditor } from "rete";
import { NodesData } from "rete/types/core/data";
//@ts-ignore
import VueRenderPlugin from "rete-vue-render-plugin";
import NodeVue from '../render/Node.vue';
import ConnectionPlugin from "rete-connection-plugin";
//@ts-ignore
import AreaPlugin from "rete-area-plugin";

import ContextMenuPlugin from "../context-menu";
import EventEmitter from "events";

import { compile as spreadCompile, StatefulOperatorData, SpreadNodesData } from '../nodes/SpreadOperators';
import { Plugin } from "rete/types/core/plugin";
import StandardNodes from "../nodes";

type Store<T> = {
    [key: string]: T
}


class EditorManager {

    private static curInstance: EditorManager | undefined;
    public static getInstance(): EditorManager | undefined {
        return Object.seal(this.curInstance);
    }

    private config: EditorConfig = DefaultConfig;

    constructor(anchor: HTMLElement) {
        this.anchor = anchor;
        EditorManager.curInstance = this;
    }

    private anchor: HTMLElement;

    private curProcess: string | undefined;
    private openTabs: string[] = [];

    private processData: Map<string, SpreadNodesData> = new Map();

    private operators: Map<string, StatefulOperatorData<any, any, any>> = new Map();

    private editors: Map<string, NodeEditor> = new Map();

    private compile(id: string) {
        if (this.processData.has(id))
            this.operators.set(id,
                spreadCompile(this.processData.get(id)!))
    };

    private plugins: [Plugin] = [StandardNodes];

    private setVisible(id: string, visible: boolean) {
        if (!this.processData.has(id))
            throw new Error("No such Process");

        let el = document.getElementById(id);
        if (el) {
            el.className = visible ? "visible" : "hidden";
        }

    }

    //Todo
    public i18n(keys: string[]): string | undefined { return undefined }

    private spawn(id: string, visible: boolean = false) {

        if (!this.processData.has(id))
            throw new Error("No such Process");
        if (this.editors.has(id))
            this.editors.get(id)!.destroy();


        if (!this.openTabs.find((s) => (s == id))) {
            this.openTabs = this.openTabs.concat([id]);
            this.eventEmitter.emit('tabs');
        }

        let element = document.createElement("div");

        element.id = id;

        this.anchor.appendChild(
            element
        );

        let editor = new NodeEditor(id + '@0.1.0', element);
        let data = {
            id: id + '@0.1.0',
            nodes: this.processData.get(id)!
        };

        editor.use(
            VueRenderPlugin,
            {
                component: NodeVue
            }
        )

        editor.use(AreaPlugin, {
            background: false,
            snap: false,
            scaleExtent: { min: 0.25, max: 1 },
            translateExtent: { width: 5000, height: 4000 },
        });

        let i18n = this.i18n;


        editor.use(ContextMenuPlugin, {
            allocate: (component: Component) => {
                //return [];
                let data = component.data as any;
                if (data.category) {
                    return data.category.map((sub: string[]) => {
                        return i18n(sub);
                    });
                }
                else return [];
            },
            rename(component: Component) {
                let data = component.data as any;
                if (data.i18nKeys)
                    return i18n(data.i18nKeys) || component.name;
                return component.name;
            }
        });

        this.plugins.forEach(
            plugin => editor.use(plugin)
        );


        editor.on(
            ["connectioncreated", 'connectionremoved', "nodecreated", 'noderemoved'],
            (data: any) => {
                editor.trigger('process');
            }
        );

        editor.on('process', async () => {
            //Save 
            this.processData.set(id, editor.toJSON().nodes as SpreadNodesData);

            //compile
            this.compile(id);

            //TODO
            //execute
        }
        );

        editor.use(ConnectionPlugin);

        editor.fromJSON(data);


        editor.view.resize();
        editor.trigger('process');

        element.className = visible ? "visible" : "hidden";

        this.editors.set(id, editor);

        return editor;
    }

    public create(id: string) {
        if (this.processData.has(id))
            return;
        this.processData.set(id, {});
    }

    public delete(id: string) {
        if (id in this.openTabs)
            this.close(id);
        this.processData.delete(id);
        this.operators.delete(id);
        this.editors.delete(id);
    }

    public select(id: string) {
        if (!this.processData.has(id))
            throw new Error("No such Process");

        if (this.curProcess) this.setVisible(this.curProcess, false);
        console.log("Test")
        if (this.editors.has(id)) {
            this.setVisible(id, true);
        } else {
            this.spawn(id, true);
        }
        this.curProcess = id;
        this.eventEmitter.emit('select', id);
        this.eventEmitter.emit('tabs');
    }

    public getProcesses() {
        return Object.seal(
            Array.from(this.processData.keys())
        )
    }

    public close(id: string) {

        let index = this.openTabs.findIndex(tab => tab == id);
        this.openTabs = this.openTabs.filter((s) => s != id);
        this.eventEmitter.emit('tabs');

        //Select closest tab if selected tab gets closed
        if (this.curProcess == id) {
            if (this.openTabs.length > 0) {
                index =
                    Math.max(
                        Math.min(
                            index,
                            this.openTabs.length - 2
                        ),
                        0
                    );
                this.select(this.openTabs[index]);
            } else {
                this.curProcess = undefined;
                this.eventEmitter.emit('select', undefined);
            }
        }

        if (this.editors.has(id)) {
            let editor = this.editors.get(id)!;

            //Destroy the Editor
            editor.destroy();

            //Remove Editor from Editor-Map
            this.editors.delete(id);

            //Remove the Element
            document.getElementById(id)?.remove();
        }
    }

    public getOpenTabs() {
        return Object.seal(this.openTabs);
    }

    public getSelected() {
        return Object.seal(this.curProcess);
    }

    private eventEmitter = new EventEmitter();

    public onSelected(callback: (selected: string) => void) {
        this.eventEmitter.on('select', callback);
    }

    public onTabsChange(callback: () => void) {
        this.eventEmitter.on('tabs', callback);
    }

}


export default EditorManager;