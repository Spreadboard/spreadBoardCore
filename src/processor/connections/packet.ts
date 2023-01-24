export type CompilerIO = {
    [key: string]: Evaluation<any>,
}

export type ProcessIO = {
    [key: string]: any
}

export type Evaluation<T> = (processInputs: ProcessIO) => T | undefined;