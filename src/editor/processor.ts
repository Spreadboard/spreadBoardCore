import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardStack, SpreadBoardVariable } from "./variable";

export interface ProcessData{
    moduleInputs?:WorkerInputs,
    moduleOuputs?:WorkerOutputs,
    stack?: SpreadBoardStack,
    path: string[]
}

export class Processor{
    private static max_stack_height: number = 2000;
    private engine: Engine;
    private stack: SpreadBoardStack;
    constructor(engine:Engine,stack: SpreadBoardStack =  {variables: new Map<string,SpreadBoardVariable<any>>(), subStacks: new Map<number,SpreadBoardStack>()}){
        this.engine = engine;
        this.stack = stack;
    }

    register(component: Component){
        this.engine.register(component);
    }

    clear(){
        this.stack = {variables: new Map<string,SpreadBoardVariable<any>>(), subStacks: new Map<number,SpreadBoardStack>()};
    }

    abort(){
        this.engine.abort();
    }

    processModule<T extends unknown[]>(module: Data, startId: number | string | null = null, moduleInputs?:WorkerInputs, moduleOuputs?:WorkerOutputs, path: string[]=[], subStackId?: number, ...args: T): Promise<"success" | "aborted">{
        if(path.length > Processor.max_stack_height){
            console.error("Stack overflow");
            return new Promise<'aborted'>((any)=>{});
        }

        let data = {...module};
        data.id = this.engine.id;
        //console.log(...path,"->",module.id,"(",moduleInputs,")");
        let processData: ProcessData = {
            stack: subStackId ? this.stack.subStacks.get(subStackId): undefined,
            moduleInputs : moduleInputs,
            moduleOuputs: moduleOuputs,
            path : [...path, module.id]
        }
        let res;
        if(subStackId)
        res = this.engine.clone().process(data, startId,processData,  ...args);
        else
        res = this.engine.clone().process(data, startId,processData,  ...args);
        
        //console.log(...path,"<-",module.id,"(",moduleInputs,")");
        return res;
    }
    
    process<T extends unknown[]>(data: Data, startId: number | string | null = null, ...args: T): Promise<"success" | "aborted">{
        this.engine.abort();
        return this.engine.process(data, startId,this.stack, ...args);
    }

}