import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { Command, CompilerOptions } from "../nodes/CompilerNode";
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

    private compiledProcesses: Map<string,Command>= new Map();

    private collectDependencys(id: string): string[]{
        let dependencys: string[] = [];

        this.compiledProcesses.get(id)!.processDependencys.forEach(
            (dependency)=>{
                dependencys.concat(this.collectDependencys(dependency));
            }
        )

        return dependencys;
    }

    private commandToFunction(id: string): Function {
        let command: Command = this.compiledProcesses.get(id)!;
        let dependencys = this.collectDependencys(id);

        let function_string = "";
        dependencys.forEach(
            (dependency)=>{
                function_string = function_string +
                `const ${dependency} = function${dependency}(input){\n${this.compiledProcesses.get(dependency)!.command_string}\n}\n`
            }
        )
        function_string  = function_string +
        `const ${id} = function${id}(input){\n${command.command_string}\n}\n`+
        `return ${id}(input)`;
        
        return new Function('input',function_string); 
    }

    processProcess(processId: string): CompilerIO{
        processId = processId.replace('@0.1.0','');
        let func =  this.commandToFunction(processId);
        
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

    async compileProcess(id: string, data: Data): Promise<Command>{
        let compilerOptions: CompilerOptions = {silent: true, compilerCommands:[]}
        const compiler = this.engine.clone();
        const compilerData = {...data};
        compilerData.id = compiler.id = "compiler@0.1.0";

        await compiler.process(
            compilerData,
            null,
            compilerOptions
        );

        let function_command: Command = {
            command_string: "",
            outputs: {},
            processDependencys:[]
        }

        compilerOptions.compilerCommands?.forEach(
            (command)=>{
                function_command.command_string = function_command.command_string + command.command_string;
                function_command.processDependencys.concat(command.processDependencys);
            }
        )
        
        function_command.command_string = function_command +
        `return output`;
        
        this.compiledProcesses.set(id, function_command)

        return function_command
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