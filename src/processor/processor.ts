import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardEditor } from "../editor/editor";
import { ProcessCommand, CompilerOptions, Command } from "../nodes/CompilerNode";
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

    private compiledProcesses: Map<string,ProcessCommand>= new Map();
    private compiledCommandList: Map<string,ProcessCommand[]>= new Map();

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
        let command: ProcessCommand = this.compiledProcesses.get(id)!;
        let dependencys = this.collectDependencys(id);
        if(!dependencys) return undefined;
        let function_commands:  Command[] = [];

        dependencys.forEach(
            (dependency)=>{
                if(dependency != id){
                    let commands = this.compiledProcesses.get(dependency);
                    if(commands)
                        function_commands = function_commands .concat(
                            [
                                {
                                    node_id: commands.node_id,
                                    commands:`\nconst ${dependency} = function ${dependency}(inputs){\nlet output = {}\n`
                                },
                                ...commands.commands,
                                {
                                    node_id: commands.node_id,
                                    commands:`\n}`
                                },

                            ]
                        );
                }
            }
        )


        function_commands = function_commands.concat(
            [
                {
                    node_id: command.node_id,
                    commands:`\nconst ${id} = function ${id}(inputs){\nlet output = {}\n`
                },
                ...command.commands,
                {
                    node_id: command.node_id,
                    commands:`\n}\nreturn ${id}(inputs)`
                },

            ]
        );

        const commandToString = (command: Command)=>{
            if(!command)
                return ""
            if(typeof (command.commands) == 'string')
                return command.commands
            
            let str = "";
            command.commands.map(commandToString).forEach((st)=>str = str+st);
            return str;
        }

        let function_string = "";
        function_commands.map(commandToString).forEach(
            (st)=>function_string = function_string+st
        )


        try{
            let func = new Function('inputs',function_string);
            return func;
        }catch(e){
            console.log("Error while converting");
            console.log(function_commands);
            console.log(function_string)
        }
    }

    public commandList(id:string){
        let command: ProcessCommand = this.compiledProcesses.get(id)!;
        let dependencys = this.collectDependencys(id);
        if(!dependencys) return undefined;
        let function_string:string[] = [];

        dependencys.forEach(
            (dependency)=>{
                if(dependency != id){
                    function_string.push(`import { ${dependency} } from "./${dependency}.js"\n`)
                }
            }
        )

        let commands = this.compiledCommandList.get(id)?.filter((c)=>c.commands.length>0)!;

        let list = [
            ...(function_string.map(
                (str)=>{
                    return {
                        node_id:-1,
                        commands:str
                    }
                }
            )),
            {
                node_id:-1,
                commands:`function ${id}(inputs){`
            },
            {
                node_id:-1,
                commands:`let output = {};`
            },
            ...commands,
            {
                node_id:-1,
                commands:"return output"
            },
            {
                node_id:-1,
                commands:"}"
            }
        ] as ProcessCommand[]
        return list;
    }

    public commandToCode(id: string){
        let command: ProcessCommand = this.compiledProcesses.get(id)!;
        let dependencys = command.processDependencys;
        if(!dependencys) return undefined;
        let function_string = "";

        dependencys.forEach(
            (dependency)=>{
                if(dependency != id){
                    function_string = function_string +
                    `import { ${dependency} } from './${dependency}.js'\n`
                }
            }
        )


        function_string  = function_string +
        `\n\n export function ${id}(inputs){\nlet output = {}\n${command.commands}\n}\n`;

        return function_string;

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

    async compileProcess(id: string, data: Data): Promise<ProcessCommand>{
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

        let function_command: ProcessCommand = {
            node_id:-1,
            commands: [],
            outputs: {},
            processDependencys:[]
        }

        compilerOptions.compilerCommands?.forEach(
            (command)=>{
                function_command.commands = function_command.commands.concat(command.commands);
                command.processDependencys.forEach(
                    (dependency)=>{
                        if(!function_command.processDependencys.find((d)=>d == dependency))
                            function_command.processDependencys.push(dependency)
                    }
                )
            }
        )
        if(compilerOptions.compilerCommands)
            this.compiledCommandList.set(id, compilerOptions.compilerCommands)
        
        function_command.commands = function_command.commands.concat(
            {
                node_id:-1,
                commands:`\nreturn output`
            }
        )
        
        this.compiledProcesses.set(id, function_command)
        console.log(`Compiled ${id}`)

        SpreadBoardEditor.instance?.trigger("export");
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