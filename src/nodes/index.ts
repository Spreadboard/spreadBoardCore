import { NodeEditor } from "rete";
import { ComponentPlugin } from "../editor/componentPlugin";
import { SpreadBoardEditor } from "../editor/editor";
import { BoolNode } from "./data/BoolNode";
import { NumNode } from "./data/NumNode";
import { AddNode } from "./operators/AddNode";
import { EqualNode } from "./operators/EqualNode";
import { GreaterNode } from "./operators/GreaterNode";
import { MultNode } from "./operators/MultNode";
import { SubNode } from "./operators/SubNode";


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
    ]
);

export default StandardNodes;