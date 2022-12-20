import { Component } from "rete";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardStack } from "./variable";

abstract class VariableComponent extends Component{
    abstract worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, variables: SpreadBoardStack, ...args: unknown[]): void;
}