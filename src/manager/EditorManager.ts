
import { DefaultConfig, EditorConfig } from "./EditorConfig";


//Rete
import { Component, Emitter, Engine, NodeEditor, Socket } from "rete";
import { NodesData } from "rete/types/core/data";
//@ts-ignore
import VueRenderPlugin from "rete-vue-render-plugin";
import NodeVue from '../render/Node.vue';
import ConnectionPlugin from "rete-connection-plugin";
//@ts-ignore
import AreaPlugin from "rete-area-plugin";

import ContextMenuPlugin from "../context-menu";
import EventEmitter from "events";
import { ProcessCommand } from "../nodes/CompilerNode";
import { Processor } from "../processor/processor";
import StandardNodes from "../nodes";
import { DefaultProject, ProjectData } from "./Projects";

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
        this.openProject(DefaultProject);
    }

    public openProject(project: ProjectData) {
        this.blankEngine = new Engine('blank@0.1.0');

        project.packets?.forEach(
            pack => pack.installOnEngine(this.blankEngine)
        );

        Array.from(this.processData.keys()).forEach(
            key => this.delete(key)
        );
        project.processes.forEach(
            p => {
                this.processData.set(p.id, p.nodes);
            }
        )

        Array.from(this.processData.keys()).forEach(
            key => {
                this.processor.compileProcess(key, this.processData.get(key)!, this.blankEngine);
            }
        );

        project.openTabs?.forEach(tab => this.select(tab))
        if (project.selected) {
            this.select(project.selected);
        }
    }

    private anchor: HTMLElement;

    private curProcess: string | undefined;
    private openTabs: string[] = [];

    private processData: Map<string, NodesData> = new Map();

    //TODO: Change Operator-Type
    private processCommands: Map<string, ProcessCommand> = new Map;

    private editors: Map<string, NodeEditor> = new Map();
    private engines: Map<string, Engine> = new Map();
    private blankEngine = new Engine('blank@0.1.0');


    private eventEmitter = new EventEmitter();
    private processor = new Processor(this.eventEmitter);


    public getIOS(processId: string) {
        let nodes = this.processData.get(processId);
        if (!nodes) return { inputs: [], outputs: [] };
        let inputs: { key: string, name: string, socket: Socket }[] = [];
        let outputs: { key: string, name: string, socket: Socket }[] = [];
        for (let nodeKey in nodes) {
            let node = nodes[nodeKey];

            let data: any = this.blankEngine.components.get(node.name)?.data;
            if (data.process) {
                let processData = data.process as any;
                if (processData.type == "input") {
                    let name: string = node.data.key as string;
                    inputs.push({ key: name, name: name, socket: processData.socket })
                }
                if (processData.type == "output") {
                    let name: string = node.data.key as string;
                    outputs.push({ key: name, name: name, socket: processData.socket })
                }
            }
        }
        return {
            inputs: inputs,
            outputs: outputs
        };
    }

    public getProcessor() {
        return Object.seal(this.processor);
    }

    private setVisible(id: string, visible: boolean) {
        if (!this.processData.has(id))
            throw new Error("No such Process");

        let el = document.getElementById(id);
        if (el) {
            el.className = visible ? "visible" : "hidden";
        }

    }

    //Todo
    public i18n(keys: string[]): string | undefined {
        let curLocale = this.config.i18n.curLocale;
        let values = this.config.i18n.values[curLocale];
        let map = values;
        keys.forEach(
            key => {
                if (typeof map == 'string' || map == undefined)
                    return map;
                else {
                    map = map[key];
                }
            }
        )
        return map as string | undefined;
    }

    private spawn(id: string, visible: boolean = false) {

        if (!this.processData.has(id))
            throw new Error("No such Process");
        if (this.editors.has(id))
            this.editors.get(id)!.destroy();
        if (this.engines.has(id))
            this.engines.get(id)!.destroy();


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
        let engine = new Engine(`${id}@0.1.0`);
        this.engines.set(id, engine);


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

        let i18n = (keys: string[]) => this.i18n(keys);

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

        editor.use(StandardNodes);
        StandardNodes.installOnEngine(engine);

        //this.use(StandardNodes);



        editor.on(
            ["connectioncreated", 'connectionremoved', "nodecreated", 'noderemoved'],
            (data: any) => {
                editor.trigger('process');
            }
        );

        editor.on('process', async (params: any) => {
            //TODO

            let nodes = editor.toJSON().nodes;

            //Save 
            this.processData.set(id, nodes);

            //compile
            this.processor.compileProcess(id, nodes, engine);

            //execute
            if (params.process || true)
                this.processor.process(nodes, engine);
        }
        );

        editor.use(ConnectionPlugin);

        editor.fromJSON(data);

        editor.view.resize();
        editor.trigger('process');

        element.className = visible ? "visible" : "hidden";

        this.editors.set(id, editor);

        setTimeout(() => {
            editor.trigger('process')
        }, 200)

        return editor;
    }

    public create(id: string) {
        if (this.processData.has(id))
            return;
        this.processData.set(id, {})
    }

    public delete(id: string) {
        if (id in this.openTabs)
            this.close(id);
        this.processData.delete(id);
        this.processCommands.delete(id);
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

    public getProcesses(): string[] {
        return Array.from(this.processData.keys());
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

    public onSelected(callback: (selected: string) => void) {
        this.eventEmitter.on('select', callback);
    }

    public onTabsChange(callback: () => void) {
        this.eventEmitter.on('tabs', callback);
    }

    public onCompiled(callback: (processCommand: ProcessCommand) => void) {
        this.eventEmitter.on('tabs', callback);
    }

}


export default EditorManager;