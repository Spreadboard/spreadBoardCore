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

    private collectDependencys(id: string, dependencys:string[]=[]): string[]|undefined{
        
        let proc = this.compiledProcesses.get(id);
        if(proc){
            proc.processDependencys.forEach(
                (dependency)=>{
                    if(!dependencys.find((d)=>d==dependency)){
                        dependencys.push(dependency)
                        this.collectDependencys(dependency, dependencys);
                    }
                }
            )
        }
        else{
            return undefined;
        }
        
        let clean_dependencys: string[] = []

        dependencys.forEach(
            (dependency)=>{
                if(!clean_dependencys.find((d)=>d==dependency))
                    clean_dependencys.push(dependency)
            }
        )

        return dependencys;
    }

    private commandToFunction(id: string): Function | undefined {
        let command: Command = this.compiledProcesses.get(id)!;
        let dependencys = this.collectDependencys(id);
        if(!dependencys) return undefined;
        let function_string = "";

        dependencys.forEach(
            (dependency)=>{
                if(dependency != id){
                    function_string = function_string +
                    `const ${dependency} = function ${dependency}(inputs){\nlet output = {}\n${this.compiledProcesses.get(dependency)!.command_string}\n}\n`
                }
            }
        )
        function_string  = function_string +
        `const ${id} = function ${id}(inputs){\nlet output = {}\n${command.command_string}\n}\n`+
        `return ${id}(inputs)`;

        try{
            let func = new Function('inputs',function_string);
            return func;
        }catch(e){
            console.log("Error while converting");
            console.log(function_string);
        }
    }

    processProcess(processId: string): Function|undefined{
        processId = processId.replace('@0.1.0','');
        let func =  this.commandToFunction(processId);
        return func;
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
        id = id.replace("@0.1.0","");
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
            inputsNeeded:false,
            command_string: "",
            outputs: {},
            processDependencys:[]
        }

        compilerOptions.compilerCommands?.forEach(
            (command)=>{
                function_command.command_string = function_command.command_string + command.command_string;
                command.processDependencys.forEach(
                    (dependency)=>{
                        if(!function_command.processDependencys.find((d)=>d == dependency))
                            function_command.processDependencys.push(dependency)
                    }
                )
            }
        )
        
        function_command.command_string = function_command.command_string +
        `\nreturn output`;
        
        this.compiledProcesses.set(id, function_command)
        console.log(`Compiled ${id}`)
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