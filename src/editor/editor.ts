
import { Component, Engine, NodeEditor } from 'rete';
import {EventEmitter} from './eventEmitter';
import { SpreadBoardVariable } from './variable';

// @ts-ignore
import VueRenderPlugin from "rete-vue-render-plugin";

import ConnectionPlugin from "rete-connection-plugin";
import { Data, Data as ReteData, NodeData } from "rete/types/core/data";
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

interface i18nObj{
    [index:string]: i18nObj | string;
}

interface i18nMap{
    [index: string]: i18nObj
}

type Locale = "de";

const save: any = {
    "id": "demo@0.1.0", "nodes": {
        "14": {
            "id": 14,
            "data": {},
            "inputs": {"in": {"connections": [{"node": 15, "output": "val", "data": {}}]}},
            "outputs": {},
            "position": [475.704839080989, -67.21715615165667],
            "name": "Anzeige"
        },
        "15": {
            "id": 15,
            "data": {"init": 1},
            "inputs": {"init": {"connections": []}},
            "outputs": {
                "type": {"connections": []},
                "ref": {"connections": [{"node": 17, "input": "ref", "data": {}}]},
                "val": {
                    "connections": [{"node": 19, "input": "num", "data": {}}, {
                        "node": 20,
                        "input": "num",
                        "data": {}
                    }, {"node": 14, "input": "in", "data": {}}]
                }
            },
            "position": [-296.13244996723756, -192.81906941216266],
            "name": "Variable:\nZahl"
        },
        "16": {
            "id": 16,
            "data": {"bool": false},
            "inputs": {},
            "outputs": {"bool": {"connections": [{"node": 18, "input": "bool", "data": {}}]}},
            "position": [87.00270014444396, 49.81343543681821],
            "name": "Wahrheitswert"
        },
        "17": {
            "id": 17,
            "data": {},
            "inputs": {
                "ref": {"connections": [{"node": 15, "output": "ref", "data": {}}]},
                "val": {"connections": [{"node": 18, "output": "res", "data": {}}]},
                "act": {"connections": [{"node": 25, "output": "res", "data": {}}]}
            },
            "outputs": {"act": {"connections": []}},
            "position": [801.587425854445, -191.34663947969932],
            "name": "Setze Variable"
        },
        "18": {
            "id": 18,
            "data": {},
            "inputs": {
                "bool": {"connections": [{"node": 16, "output": "bool", "data": {}}]},
                "if": {"connections": [{"node": 19, "output": "num", "data": {}}]},
                "else": {"connections": [{"node": 20, "output": "num", "data": {}}]}
            },
            "outputs": {"res": {"connections": [{"node": 17, "input": "val", "data": {}}]}},
            "position": [463.3349592855515, 155.716431618088],
            "name": "Bedingung"
        },
        "19": {
            "id": 19,
            "data": {"num2": 1},
            "inputs": {
                "num": {"connections": [{"node": 15, "output": "val", "data": {}}]},
                "num2": {"connections": []}
            },
            "outputs": {"num": {"connections": [{"node": 18, "input": "if", "data": {}}]}},
            "position": [93.07408603372114, 222.43367702103302],
            "name": "Addiere"
        },
        "20": {
            "id": 20,
            "data": {"num2": -1},
            "inputs": {
                "num": {"connections": [{"node": 15, "output": "val", "data": {}}]},
                "num2": {"connections": []}
            },
            "outputs": {"num": {"connections": [{"node": 18, "input": "else", "data": {}}]}},
            "position": [86.66979646391361, 472.41367906726475],
            "name": "Addiere"
        },
        "21": {
            "id": 21,
            "data": {},
            "inputs": {},
            "outputs": {
                "actRef": {"connections": [{"node": 23, "input": "actRef", "data": {}}]},
                "act": {
                    "connections": [{"node": 25, "input": "if", "data": {}}, {
                        "node": 22,
                        "input": "act",
                        "data": {}
                    }]
                }
            },
            "position": [202.98477439531933, -837.9360977894372],
            "name": "Ereigniss"
        },
        "22": {
            "id": 22,
            "data": {"val": 3},
            "inputs": {"val": {"connections": []}, "act": {"connections": [{"node": 21, "output": "act", "data": {}}]}},
            "outputs": {"act": {"connections": [{"node": 23, "input": "act", "data": {}}]}},
            "position": [761.4111930880648, -727.0837792118829],
            "name": "Warten"
        },
        "23": {
            "id": 23,
            "data": {},
            "inputs": {
                "actRef": {"connections": [{"node": 21, "output": "actRef", "data": {}}]},
                "act": {
                    "connections": [{"node": 22, "output": "act", "data": {}}, {
                        "node": 24,
                        "output": "act",
                        "data": {}
                    }]
                }
            },
            "outputs": {},
            "position": [1341.105416979991, -841.0902379918624],
            "name": "Auslöser"
        },
        "24": {
            "id": 24,
            "data": {},
            "inputs": {},
            "outputs": {"act": {"connections": [{"node": 23, "input": "act", "data": {}}]}},
            "position": [1072.8360171208794, -654.9653428776915],
            "name": "Drücker"
        },
        "25": {
            "id": 25,
            "data": {},
            "inputs": {
                "bool": {"connections": [{"node": 26, "output": "bool", "data": {}}]},
                "if": {"connections": [{"node": 21, "output": "act", "data": {}}]},
                "else": {"connections": []}
            },
            "outputs": {"res": {"connections": [{"node": 17, "input": "act", "data": {}}]}},
            "position": [527.3702224344131, -502.231731391048],
            "name": "Bedingung"
        },
        "26": {
            "id": 26,
            "data": {"bool": false},
            "inputs": {},
            "outputs": {"bool": {"connections": [{"node": 25, "input": "bool", "data": {}}]}},
            "position": [151.64642561674276, -520.2168585287731],
            "name": "Wahrheitswert"
        }
    }
};

export class SpreadBoardEditor extends NodeEditor{
    readonly eventEmitter: EventEmitter = new EventEmitter;
    private variables = new Map<number,Map<string,SpreadBoardVariable<any>>>();
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
        }
    };
    private modules: ReteData[];
    private mainModule: ReteData;

    private engine: Engine;

    static instance: SpreadBoardEditor | null;

    static getOrCreate(container: HTMLElement, id = "spreadboard@0.1.0", saveObj: Data = {id:"spreadboard@0.1.0", nodes: {}}){
        if(!this.instance)
            this.instance  = new SpreadBoardEditor(container, id, saveObj);
        return this.instance
    }

    private constructor(container: HTMLElement, id = "spreadboard@0.1.0", saveObj: Data = {id:"spreadboard@0.1.0", nodes: {}}){
        super(id, container);
        this.engine = new Engine(id);

        this.mainModule = saveObj;
        this.modules = [];

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
            saveObj
        ).then((_)=>{
            this.on(
                ["connectioncreate", 'connectionremove', "nodecreate", 'noderemove'],
                (data: any) => {
                    this.trigger("process");
                }
            );
    
            this.on('process', async () => {
                //console.log('json', editor.toJSON());
                await this.engine.abort();
                await this.engine.process(this.toJSON());
            });
    
    
            this.view.resize();
            this.trigger('process');
            console.log("Started editor");
        })
    }

    async processModule(index: number, node: NodeData){
        let moduleEngine = new Engine("spreadboard@module:"+index+"_node:"+node.id);
        await moduleEngine.process(this.modules[index]);
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
        this.engine.register(component);
    }

    registerAll(components: Component[]): void {
        components.forEach(component => {
            this.register(component); 
        });
    }

    clear(): void {
        this.engine.abort();
        const nodes = this.nodes;
        for (const node of nodes) {
            this.removeNode(node);
        }
        super.clear();
        this.eventEmitter.clear();
        for (const variableKey of this.variables.keys()) {
            this.variables.get(variableKey)!.clear();
        }
    }

    installComponents(plugin: ComponentPlugin){
        super.use(plugin);
    }

    async load(json: SpreadBoardWorkspace){
        this.modules = json.modules;
        this.mainModule = json.mainModule;
        return await super.fromJSON(this.mainModule);
    }

    loadMainModule(){
        super.fromJSON(this.mainModule);
        this.engine.abort();
        this.engine.process(this.mainModule);
    }

    loadModule(index: number){
        super.fromJSON(this.modules[index])
        this.engine.abort();
        this.engine.process(this.modules[index]);
    }
}

export function i18n(keys: string[]){
    return SpreadBoardEditor.instance?.i18n(keys);
}