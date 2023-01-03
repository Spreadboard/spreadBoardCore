import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ProcessData } from "./processor";

abstract class VariableComponent extends Component{
    abstract worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, {stack, path}:ProcessData, ...args: unknown[]): void;
}