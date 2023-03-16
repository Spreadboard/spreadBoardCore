import EventEmitter from "events";
import { Component, Engine } from "rete";
import { Data, NodesData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import EditorManager from "../manager/EditorManager";
import { NodeCommand, CompilerOptions, Command, ProcessCommand } from "../nodes/CompilerNode";



export interface ProcessInc {
    processInputs?: WorkerInputs,
    path: string[],
}

export type ModuleData = {
    id: string,
    processes: Data[]
}

export type ModuleCommands = {
    id: string,
    processes: ProcessCommand[]
}


export class Processor {

    private eventEmitter: EventEmitter;

    private collectedProcesses: Map<string, ProcessCommand> = new Map();
    private collectedCommandList: Map<string, NodeCommand[]> = new Map();

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    private async collectModule(data: ModuleData, engine: Engine) {
        let moduleCommands: ModuleCommands = { id: data.id, processes: [] }
        for (let process of data.processes) {
            moduleCommands.processes.push(await this.collectProcess(process.id, process.nodes, engine));
        }
        return moduleCommands;
    }


    private async compileModule(data: ModuleData, engine: Engine) {
        let module = await this.collectModule(data, engine);

        let moduleString = '';

        const commandToString = (commands: Command): string => {
            if (typeof commands.commands == 'string')
                return commands.commands
            return commands.commands.map(commandToString).reduce((str1, str2) => str1 + str2);
        }

        for (let process of module.processes) {
            moduleString += '\n' + this.collectProcessPreview(process).map(commandToString).reduce((str1, str2) => str1 + str2);
        }

        return (new Function('require', moduleString))((s: string) => (s.startsWith('./') ? {} : require(s)))
    }

    private commandToFunction(id: string): Function | undefined {
        let process: ProcessCommand = this.collectedProcesses.get('@/' + id)!;
        let dependencys = process.dependencys.filter((d) => d != `@/${id}`);
        if (!dependencys) return undefined;
        let function_commands: Command[] = [];

        dependencys.forEach((dependency) => {
            function_commands.push({
                node_id: -1,
                commands: `const ${dependency.replace('@/', '')} = require("${dependency}")\n`
            });
        })


        function_commands = function_commands.concat(this.collectProcessPreview(process));

        function_commands.push(
            {
                node_id: -1,
                commands: `\nreturn ${process.id}`
            }
        )

        const commandToString = (command: Command) => {
            if (!command)
                return ""
            if (typeof (command.commands) == 'string')
                return command.commands

            let str = "";
            command.commands.map(commandToString).forEach((st) => str = str + st);
            return str;
        }

        let function_string = '';
        function_commands.map(commandToString).forEach(
            (st) => function_string = function_string + st
        )


        try {
            let func = new Function('require', function_string);
            return func((dependency: string) => { return (dependency.startsWith('@/') ? this.commandToFunction(dependency.slice(2)) : require(dependency)) });
        } catch (e) {
            console.log("Error while converting");
            console.log(e)
            console.log(function_commands);
            console.log(function_string)
        }
    }

    private collectProcessPreview(process: ProcessCommand) {

        let commands = process.commands?.filter((c) => c.commands.length > 0)!;

        return [
            {
                node_id: -1,
                commands: `const ${process.id} = (inputs) => {\n`
            },
            {
                node_id: -1,
                commands: `let output = {};\n`
            },
            ...commands,
            {
                node_id: -2,
                commands: "\nreturn output\n"
            },
            {
                node_id: -1,
                commands: "}\n"
            }
        ] as NodeCommand[];
    }

    public getProcessPreview(id: string) {
        return this.collectedCommandList.get('@/' + id);
    }

    processProcess(processId: string): Function | undefined {
        processId = processId.replace('@0.1.0', '');
        let func = this.commandToFunction(processId);
        return func;
    }

    async compileProcess(id: string, nodes: NodesData, engine: Engine): Promise<ProcessCommand> {
        let processCommand = await this.collectProcess(id, nodes, engine);

        this.collectedProcesses.set(`@/${id}`, processCommand)
        this.collectedCommandList.set(`@/${id}`, this.collectProcessPreview(processCommand));
        this.eventEmitter.emit('export', processCommand);
        return processCommand;
    }

    private async collectProcess(id: string, nodes: NodesData, engine: Engine) {
        let data = {
            id: "compiler@0.1.0",
            nodes
        }
        let compilerOptions: CompilerOptions = { silent: true, compilerCommands: [] }
        const compiler = engine.clone();
        const compilerData = { ...data };
        compiler.id = "compiler@0.1.0";

        await compiler.process(
            compilerData,
            null,
            compilerOptions
        );

        let function_command: NodeCommand = {
            node_id: -1,
            commands: [],
            outputs: {},
            processDependencys: []
        }

        compilerOptions.compilerCommands?.forEach(
            (command) => {
                function_command.commands = function_command.commands.concat(command.commands);
                command.processDependencys.forEach(
                    (dependency) => {
                        if (!function_command.processDependencys.find((d) => d == dependency))
                            function_command.processDependencys.push(dependency)
                    }
                )
            }
        )

        let processCommand = { id: id, commands: function_command.commands, dependencys: function_command.processDependencys };

        console.log(`Compiled ${id}`)

        return processCommand;
    }

    async process(nodes: NodesData, engine: Engine, options?: { [key: string]: any }): Promise<"success" | "aborted"> {
        await await engine.abort();
        let compilerOptions: CompilerOptions = {
            silent: false,
            options: options,
        }
        const processData = { nodes, id: engine.id };

        return await engine.process(processData, null, compilerOptions);
    }

}