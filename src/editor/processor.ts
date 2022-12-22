import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardStack, SpreadBoardVariable } from "./variable";

export class Processor{
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

    processModule<T extends unknown[]>(module: Data, startId: number | string | null = null, moduleInputs?:WorkerInputs, moduleOuputs?:WorkerOutputs, subStackId?: number, ...args: T): Promise<"success" | "aborted">{
        let data = {...module};
        data.id = this.engine.id;
        //console.log("Process",data);
        if(subStackId)
        return this.engine.clone().process(data, startId,this.stack.subStacks.get(subStackId),moduleInputs, moduleOuputs,  ...args);
        else
        return this.engine.clone().process(data, startId,null,moduleInputs, moduleOuputs,  ...args);
    }
    
    process<T extends unknown[]>(data: Data, startId: number | string | null = null, ...args: T): Promise<"success" | "aborted">{
        this.engine.abort();
        return this.engine.process(data, startId,this.stack, ...args);
    }

}