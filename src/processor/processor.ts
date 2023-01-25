import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardEditor } from "../editor/editor";
import { NodeCommand, CompilerOptions, Command, ProcessCommand } from "../nodes/CompilerNode";
import { SpreadBoardStack, SpreadBoardVariable } from "./variable";



export interface ProcessInc {
    processInputs?: WorkerInputs,
    path: string[],
}



export class Processor {
    private engine: Engine;

    private collectedProcesses: Map<string, ProcessCommand> = new Map();
    private collectedCommandList: Map<string, NodeCommand[]> = new Map();

    private commandToFunction(id: string): Function | undefined {
        let process: ProcessCommand = this.collectedProcesses.get(id)!;
        let dependencys = process.dependencys.filter((d) => d != `./${id}`);
        if (!dependencys) return undefined;
        let function_commands: Command[] = [];

        dependencys.forEach((dependency) => {
            function_commands.push({
                node_id: -1,
                commands: `const ${dependency.replace('./', '')} = require("${dependency}")\n`
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
            return func((dependency: string) => { return (dependency.startsWith('./') ? this.commandToFunction(dependency.slice(2)) : require(dependency)) });
        } catch (e) {
            SpreadBoardEditor.instance?.logger.log("Error while converting");
            SpreadBoardEditor.instance?.logger.log(e)
            SpreadBoardEditor.instance?.logger.log(function_commands);
            SpreadBoardEditor.instance?.logger.log(function_string)
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
        return this.collectedCommandList.get(id);
    }

    processProcess(processId: string): Function | undefined {
        processId = processId.replace('@0.1.0', '');
        let func = this.commandToFunction(processId);
        return func;
    }

    constructor(engine: Engine, stack: SpreadBoardStack = { variables: new Map<string, SpreadBoardVariable<any>>(), subStacks: new Map<number, SpreadBoardStack>() }) {
        this.engine = engine;
    }

    register(component: Component) {
        this.engine.register(component);
    }

    clear() {
        this.engine.abort();
    }

    abort() {
        this.engine.abort();
    }

    async compileProcess(data: Data): Promise<NodeCommand> {
        let id = data.id.replace("@0.1.0", "");
        let compilerOptions: CompilerOptions = { silent: true, compilerCommands: [] }
        const compiler = this.engine.clone();
        const compilerData = { ...data };
        compilerData.id = compiler.id = "compiler@0.1.0";

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


        this.collectedProcesses.set(id, processCommand)
        this.collectedCommandList.set(id, this.collectProcessPreview(processCommand));
        SpreadBoardEditor.instance?.logger.log(`Compiled ${id}`)

        SpreadBoardEditor.instance?.trigger("export");
        return function_command
    }

    async process(data: Data, options?: { [key: string]: any }): Promise<"success" | "aborted"> {
        await await this.engine.abort();
        let compilerOptions: CompilerOptions = {
            silent: false,
            options: options,
        }
        const processData = { ...data };
        processData.id = this.engine.id;

        return await this.engine.process(processData, null, compilerOptions);
    }

}