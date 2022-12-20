
import { Component, Engine, NodeEditor, Socket } from 'rete';
import {EventEmitter} from './eventEmitter';
import { SpreadBoardStack, SpreadBoardVariable } from './variable';

// @ts-ignore
import VueRenderPlugin from "rete-vue-render-plugin";

import ConnectionPlugin from "rete-connection-plugin";
import { Data, Data as ReteData, NodeData, NodesData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardWorkspace } from './spreadBoardWorkspace';
import { ComponentPlugin } from './componentPlugin';

import StandardNodes from "../nodes";

// @ts-ignore
import AreaPlugin from "rete-area-plugin";
// @ts-ignore
import ContextMenuPlugin from "../context-menu";

import { BoolNode } from '../nodes/data/BoolNode';
import { NumNode } from '../nodes/data/NumNode';

//@ts-ignore
import NodeVue from '../render/Node.vue';
import { Processor } from './processor';

interface i18nObj{
    [index:string]: i18nObj | string;
}

interface i18nMap{
    [index: string]: i18nObj
}

type Locale = "de";


export class SpreadBoardEditor extends NodeEditor{
    readonly eventEmitter: EventEmitter = new EventEmitter;
    private globalProcessor: Processor;
    private editorProcessor: Processor;

    private curLocale: Locale = "de";
    public i18nMap: i18nMap= {
        "de":{
            "num":"Zahl",
            "bool":"Wahrheitswert",
            "values":"Werte",
            "value":"Wert",
            "operators":"Operatoren",
            "add": "Summe",
            "mult": "Produkt",
            "addIn": "Summand",
            "multIn": "Faktor",
            "res": "Ergebnis",
            "greater": "A>B",
            "equal": "A=B",
            "sub": "Differenz",
            "subIn": "Minuend",
            "subIn2": "Subtrahend",
            "modules": "Module",
            "numIn": "Eingabe - Zahl",
            "numOut": "Ausgabe - Zahl"
        }
    };
    private modules: ReteData[] = [];

    private curModule: number = 0;

    public static getCurModule(){ return this.instance?.curModule};

    public static getModuleIDs(){
        return this.instance?.modules.map((value: Data, index: number)=>{return {index: index, id: value.id.slice(0,value.id.length-6)}});
    }

    static instance: SpreadBoardEditor | null;

    static getOrCreate(container: HTMLElement, id = "main@0.1.0", saveObj: SpreadBoardWorkspace = {modules:[{id:"main@0.1.0", nodes: {}}]}){
        if(!this.instance)
            this.instance  = new SpreadBoardEditor(container, id, saveObj);
        return this.instance
    }


    public static getIOS(moduleIndex: number){
        let module = SpreadBoardEditor.instance?.modules[moduleIndex];
        console.log(SpreadBoardEditor.instance?.modules, "index:",moduleIndex);
        console.log(module);
        if(!module) return {inputs: [], outputs:[]};
        let inputs: {key:string, socket: Socket}[] = [];
        let outputs: {key:string, socket: Socket}[] = [];
        for(let key in module.nodes){
            let node = module.nodes[key];
            let data: any = SpreadBoardEditor.instance?.getComponent(node.name)?.data;
            if(data.module){
                let moduleData = data.module as any;
                if(moduleData.type == "input"){
                    let key: string = node.data.key as string;
                    inputs.push({key: key, socket: moduleData.socket})
                }
                if(moduleData.type == "output"){
                    let key: string = node.data.key as string;
                    outputs.push({key: key, socket: moduleData.socket})
                }
            }
        }
        return {
            inputs: inputs,
            outputs: outputs
        };
    }

    private static insertInput(module: ReteData, inputs: WorkerInputs){
        for(let nodeKey in module.nodes.keys){
            let node = module.nodes[nodeKey];
            if(node.data.module){
                let moduleData = node.data.module as any;
                if(moduleData.type == "input"){
                    let key: string = node.data.key as string;
                    console.log("Inserting",key, inputs[key][0]);
                    node.data.val = inputs[key][0];
                }
            }
        }
        return module;
    }

    private static extractOutputs(module: ReteData, outputs: WorkerOutputs){
        for(let key in module.nodes){
            let node = module.nodes[key];
            if(node.data.module){
                let moduleData = node.data.module as any;
                if(moduleData.type == "output"){
                    let key: string = node.data.key as string;
                    outputs[key] = node.data.val;
                }
            }
        }
        return outputs;
    }

    static async processModule(index: number, inputs: WorkerInputs, outputs: WorkerOutputs){
        let module = SpreadBoardEditor.instance?.modules[index];
        if(!module) return;

        await SpreadBoardEditor.instance?.globalProcessor.processModule(module, null, inputs, outputs);

        return outputs;
    }

    private constructor(container: HTMLElement, id = "main@0.1.0",saveObj: SpreadBoardWorkspace = {modules:[{id:"main@0.1.0", nodes: {}}]}){
        super(id, container);

        this.editorProcessor = new Processor(
            new Engine(id)
        );

        this.globalProcessor = new Processor(
            new Engine("global@0.1.0")
        );

        if(saveObj.modules.find((module)=>module.id!="main@0.1.0"))
            this.modules = [{id:"main@0.1.0", nodes: {}}];
        this.modules.push(...saveObj.modules);

        this.use(VueRenderPlugin,
            {
                component: NodeVue
            });
        this.use(ConnectionPlugin);
        this.use(AreaPlugin,{
            background: false,
            snap: false,
            scaleExtent: {min: 0.25, max: 1},
            translateExtent: {width: 5000, height: 4000},
        });
        this.use(ContextMenuPlugin, {
            allocate(component: Component){
                //return [];
                let data = component.data as any;
                if(data.category){
                    return data.category.map((sub:string[]) => {
                        return i18n(sub);
                    });
                }
                else return [];
            },
            rename(component: Component){
                let data = component.data as any;
                if(data.i18nKeys)
                    return i18n(data.i18nKeys) || component.name;
                return component.name;
            }
        });
        this.use(StandardNodes);

        // add starting node
        this.fromJSON(
            this.modules[0]
        ).then((_)=>{
            this.on(
                ["connectioncreated", 'connectionremoved', "nodecreate", 'noderemove'],
                (data: any) => {
                    this.trigger("process");
                }
            );
    
            this.on('process', async () => {
                //console.log('json', editor.toJSON());
                await this.processEditor();
            });
    
    
            this.view.resize();
            this.trigger('process');
            console.log("Started editor");
        })
    }

    i18n(keys: string[]): string | undefined{
        return this.i18nRec(keys, this.i18nMap[this.curLocale]);
    }

    private i18nRec(keys: string[], map: i18nObj): string | undefined{
        let key = keys[0];
        if(!map[key])
            return undefined;
        let res = map[key];
        if( !res || typeof res === "string" )
            return res;
        else
            return this.i18nRec(keys.slice(1), res);
    }

    register(component: Component): void {
        console.log("Register: ",component.name);
        super.register(component);
        this.editorProcessor.register(component);
        this.globalProcessor.register(component);
    }

    registerAll(components: Component[]): void {
        components.forEach(component => {
            this.register(component); 
        });
    }

    saveCurModule(){
        this.modules[this.curModule].nodes = this.toJSON().nodes;
        console.log(this.modules[this.curModule]);
    }
    
    clear(): void {
        this.editorProcessor.abort();
        const nodes = this.nodes;
        for (const node of nodes) {
            this.removeNode(node);
        }
        super.clear();
        this.eventEmitter.clear();
        this.editorProcessor.clear();
    }

    installComponents(plugin: ComponentPlugin){
        super.use(plugin);
    }

    async load(json: SpreadBoardWorkspace){
        this.modules = json.modules;
        return await super.fromJSON(this.modules[0]);
    }

    addModule(name: string){
        let id = name+"@0.1.0";
        if(this.modules.find((value:Data)=>value.id == id))
            return;
        console.log("Adding new Module:",id);
        this.modules.push({
            id: id,
            nodes: {}
        })
    }

    async processEditor(){
        await this.editorProcessor.process(this.toJSON());
    }

    loadModule(index: number){
        this.saveCurModule();
        this.clear();
        let module = this.toJSON();
        module.nodes = this.modules[index].nodes;
        this.fromJSON(module);
        this.processEditor();
        this.curModule = index;
    }
}

export function i18n(keys: string[]){
    return SpreadBoardEditor.instance?.i18n(keys);
}