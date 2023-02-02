import { Component, Engine } from "rete";
import { Data, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { combineLatest, Observable, OperatorFunction, UnaryFunction } from "rxjs";
import { SpreadBoardEditor } from "../editor/editor";
import { ObservableVariable } from "./variable";


export type OperatorVarFunction<T, R> = UnaryFunction<ObservableVariable<T>, ObservableVariable<R>>
export type OperatorToVarFunction<T, R> = UnaryFunction<Observable<T>, ObservableVariable<R>>

export interface Transformer<T extends { [key: string]: any }, R extends { [key: string]: any }> {
    id: string,
    operator: OperatorFunction<T, R> | string
    outputs: string[]
    inputs: string[]
}

export interface CompiledTransformer<T extends { [key: string]: any }, R extends { [key: string]: any }> extends Transformer<T, R> {
    compilerInputs: { [key: string]: [string, string] }
}

export interface CompilerResult {
    dependencys: { [key: string]: string[] | string },
    tranformers: CompiledTransformer<any, any>[]
    outputs: { [key: string]: [string, string] }
    inputs: string[]
}

export interface CompilerOptions {
    silent?: boolean,
    options?: { [key: string]: any }
    result?: CompilerResult
}

export class Processor {
    private engine: Engine;

    private compiledProcesses: Map<string, Transformer<any, any>> = new Map();

    private compilerResultToTransformer(id: string, compileResult: CompilerResult): Transformer<any, any> {
        const transformerToCommand = (t: CompiledTransformer<any, any>) => {

            if (!t.operator)
                console.log(t);
            let inputs_mapping = Object.keys(t.compilerInputs).map(
                (key) => `${key} : ${t.compilerInputs[key][0]}.${t.compilerInputs[key][1]}`
            ).join(', ');


            return `
const ${t.id} = ${t.operator.toString()}( combineLatest( { ${inputs_mapping}} ) );
`;
        }

        let outputs_mapping = Object.keys(compileResult.outputs).map(
            (key) => `${key} : ${compileResult.outputs[key][0]}.${compileResult.outputs[key][1]}`
        ).join(', ');

        let commands = compileResult.tranformers.map(transformerToCommand)
            .join('\n');

        let depList = Object.keys(compileResult.dependencys).map(
            (key) => { return { key: key, value: compileResult.dependencys[key] } }
        );
        let dependencys = depList.concat(
            depList.find(({ key, value }) => key == 'rxjs') ? [{ key: 'rxjs', value: [] }] : []
        ).map(
            ({ key, value }) => {
                if (key == 'rxjs' && !('combineLatest' in (value as string[])))
                    return {
                        key: key,
                        value: value.concat('combineLatest')
                    }
                else return { key, value };
            }
        ).map(
            ({ key, value }) => `const ${(typeof value == 'string') ? value : `{ ${value.concat(', ')} }`} = require('${key}')`
        )

        let functionString = `${dependencys}\n${commands}\n return { ${outputs_mapping}}`
        let newOperator = ((inputs: Observable<any>) => Function("require", "inputs", functionString)((source: string) => source.startsWith('@/') ? this.compiledProcesses.get(source.replace('@/', ''))?.operator : require(source), inputs) as ObservableVariable<any>);
        let newTransform: Transformer<any, any> = {
            inputs: compileResult.inputs,
            outputs: Object.keys(compileResult.outputs),
            operator: newOperator,
            id: id
        }
        return newTransform;
    }

    constructor(engine: Engine) {
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

    processTransform(id: string) {
        return this.compiledProcesses.get(id);
    }

    async compileProcess(data: Data, options?: { [key: string]: any }) {
        let compileEngine = this.engine.clone();
        data = { ...data };
        data.id = data.id.replace('@0.1.0', '')

        let compilerOptions: CompilerOptions = {
            silent: true,
            options: options,
            result: {
                dependencys: {},
                inputs: [],
                tranformers: [],
                outputs: {}
            }
        }
        const processData = { id: this.engine.id, nodes: data.nodes };

        await compileEngine.process(processData, null, compilerOptions);

        let result = compilerOptions.result as CompilerResult;

        console.log(result);

        let newTransform = this.compilerResultToTransformer(data.id, result);

        this.compiledProcesses.set(
            data.id,
            newTransform
        );

        console.log(`Compiled ${data.id} -> `, newTransform);
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