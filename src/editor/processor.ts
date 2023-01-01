import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardStack, SpreadBoardVariable } from "./variable";

export interface ProcessData{
    processInputs?:WorkerInputs,
    processOutputs?:WorkerOutputs,
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

    processProc<T extends unknown[]>(process: Data, startId: number | string | null = null, processInputs?:WorkerInputs, processOutputs?:WorkerOutputs, path: string[]=[], subStackId?: number, ...args: T): Promise<"success" | "aborted">{
        if(path.length > Processor.max_stack_height){
            console.error("Stack overflow");
            return new Promise<'aborted'>((any)=>{});
        }

        let data = {...process};
        data.id = this.engine.id;
        //console.log(...path,"->",process.id,"(",processInputs,")");
        let processData: ProcessData = {
            stack: subStackId ? this.stack.subStacks.get(subStackId): undefined,
            processInputs : processInputs,
            processOutputs: processOutputs,
            path : [...path, process.id]
        }
        let res;
        if(subStackId)
        res = this.engine.clone().process(data, startId,processData,  ...args);
        else
        res = this.engine.clone().process(data, startId,processData,  ...args);
        
        //console.log(...path,"<-",process.id,"(",processInputs,")");
        return res;
    }
    
    process<T extends unknown[]>(data: Data, startId: number | string | null = null, ...args: T): Promise<"success" | "aborted">{
        this.engine.abort();
        return this.engine.process(data, startId,this.stack, ...args);
    }

}