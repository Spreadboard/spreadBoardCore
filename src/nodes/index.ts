import { NodeEditor } from "rete";
import { ConditionNode } from "./controlFlow/ConditionNode";
import { BoolNode } from "./data/BoolNode";
import { NumNode } from "./data/NumNode";
import { InputNumNode } from "./processes/InputNumNode";
import { ProcessNode } from "./processes/ProcessNode";
import { OutputNumNode } from "./processes/OutputNumNode";
import { AddNode } from "./operators/AddNode";
import { EqualNode } from "./operators/EqualNode";
import { GreaterNode } from "./operators/GreaterNode";
import { MultNode } from "./operators/MultNode";
import { SubNode } from "./operators/SubNode";
import { ModuloNode } from "./operators/ModuloNode";
import { DivNode } from "./operators/DivNode";
import { ComponentPlugin } from "../manager/componentPlugin";


const StandardNodes = new ComponentPlugin(
    "StandardNodes",
    [
        new NumNode(),
        new BoolNode(),
        new AddNode(),
        new MultNode(),
        new GreaterNode(),
        new EqualNode(),
        new SubNode(),
        //new InputNumNode(),
        //new OutputNumNode(),
        //new ProcessNode(),
        new ConditionNode(),
        new ModuloNode(),
        new DivNode()
    ]
);

export default StandardNodes;