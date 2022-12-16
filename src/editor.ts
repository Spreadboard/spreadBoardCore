
import { Component, Engine, NodeEditor } from 'rete';
import {EventEmitter} from './eventEmitter';
import { SpreadBoardVariable } from './variable';
//@ts-ignore
import SpreadBoardNode from './vue/spreadBoardNode.vue';

import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import { Data as ReteData, NodeData } from "rete/types/core/data";
import { SpreadBoardWorkspace } from './spreadBoardWorkspace';
import { ComponentPlugin } from './componentPlugin';
import AreaPlugin from "rete-area-plugin";

interface i18nObj{
    [index:string]: i18nObj | string;
}

export class SpreadBoardEditor extends NodeEditor{
    readonly eventEmitter: EventEmitter = new EventEmitter;
    private variables = new Map<number,Map<string,SpreadBoardVariable<any>>>();
    public i18nMap: i18nObj = {};
    private modules: ReteData[];
    private mainModule: ReteData;

    private engine: Engine;

    constructor(container: HTMLElement, id = "spreadboard"){
        super(id, container);
        this.engine = new Engine(id);
        this.use(
            VueRenderPlugin,
            {
                component: SpreadBoardNode
            }
        );
        this.use(ConnectionPlugin);
        this.use(AreaPlugin,{
            background: false,
            snap: false,
            scaleExtent: {min: 0.25, max: 1},
            translateExtent: {width: 5000, height: 4000}
        })

        this.use(ConnectionPlugin);
    }

    async processModule(index: number, node: NodeData){
        let moduleEngine = new Engine("spreadboard@module:"+index+"_node:"+node.id);
        await moduleEngine.process(this.modules[index]);
    }

    i18n(keys: string[]): string | undefined{
        return this.i18nRec(keys, this.i18nMap as i18nObj);
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

    register(component: Component, engine: boolean = true): void {
        super.register(component);
        if(engine)
            this.engine.register(component);
    }

    registerAll(components: Component[]): void {
        components.forEach(component => {
            this.register(component);
            this.engine.register(component)
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