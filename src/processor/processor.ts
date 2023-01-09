import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { CompilerOptions } from "../nodes/CompilerNode";
import { CompilerIO, Evaluation, ProcessIO } from "./connections/packet";
import { SpreadBoardStack, SpreadBoardVariable } from "./variable";



export interface ProcessInc{
    processInputs?:WorkerInputs,
    path: string[],
}

export class Processor{
    private static max_stack_height: number = 2000;
    private engine: Engine;
    private stack: SpreadBoardStack;

    private compiledProcesses: Map<string,CompilerIO>= new Map();

    processProcess(processId: string): CompilerIO{
        processId = processId.replace('@0.1.0','');
        return this.compiledProcesses.get(processId)!;
    }

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

    async compileProcess(id: string, data: Data): Promise<CompilerIO>{
        let compilerOptions: CompilerOptions = {silent: true, compilerOutputs:{}}
        const compiler = this.engine.clone();
        const compilerData = {...data};
        compilerData.id = compiler.id = "compiler@0.1.0";


        await compiler.process(
            compilerData, 
            null,
            compilerOptions
        );
        
        id = id.replace('@0.1.0','');
        const result = compilerOptions.compilerOutputs ?? {};
        this.compiledProcesses.set(id, result);
        console.log('Compiled:',id,' ->', Object.keys(compilerOptions.compilerOutputs!));
        return result;
    }
    
    async process(data: Data, options?: {[key:string]:any}): Promise<"success" | "aborted">{
        await await this.engine.abort();
        let compilerOptions: CompilerOptions = {
            silent: false,
            options: options,
        }
        const processData = {...data};
        processData.id = this.engine.id;
        //console.log("Processor", data);
        
        return await this.engine.process(processData,null,compilerOptions);
    }

}