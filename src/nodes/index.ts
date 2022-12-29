import { NodeEditor } from "rete";
import { ComponentPlugin } from "../editor/componentPlugin";
import { SpreadBoardEditor } from "../editor/editor";
import { ConditionNode } from "./controlFlow/ConditionNode";
import { BoolNode } from "./data/BoolNode";
import { NumNode } from "./data/NumNode";
import { InputNumNode } from "./modules/InputNumNode";
import { ModuleNode } from "./modules/ModuleNode";
import { OutputNumNode } from "./modules/OutputNumNode";
import { AddNode } from "./operators/AddNode";
import { EqualNode } from "./operators/EqualNode";
import { GreaterNode } from "./operators/GreaterNode";
import { MultNode } from "./operators/MultNode";
import { SubNode } from "./operators/SubNode";
import { ModuleSelectorNode } from "./modules/ModuleSelectorNode";


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
        new InputNumNode(),
        new OutputNumNode(),
        new ModuleNode(),
        new ConditionNode(),
        new ModuleSelectorNode()
    ]
);

export default StandardNodes;