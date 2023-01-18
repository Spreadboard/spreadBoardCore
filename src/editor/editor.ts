
import { Component, Engine, Node, NodeEditor, Socket } from 'rete';
import { EventEmitter } from '../processor/eventEmitter';

// @ts-ignore
import VueRenderPlugin from "rete-vue-render-plugin";

import ConnectionPlugin from "rete-connection-plugin";
import { Data, Data as ReteData, NodeData, NodesData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { SpreadBoardWorkspace } from './spreadBoardWorkspace';
import { ComponentPlugin } from './componentPlugin';

import StandardNodes from "../nodes";

// @ts-ignore
import AreaPlugin from "rete-area-plugin";

import ContextMenuPlugin from "../context-menu";


//@ts-ignore
import NodeVue from '../render/Node.vue';
import { Processor } from '../processor/processor';

interface i18nObj {
  [index: string]: i18nObj | string;
}

interface i18nMap {
  [index: string]: i18nObj
}

type Locale = "de";


export class SpreadBoardEditor extends NodeEditor {
  readonly eventEmitter: EventEmitter = new EventEmitter;
  private editorProcessor: Processor;

  private curLocale: Locale = "de";
  public i18nMap: i18nMap = {
    "de": {
      "num": "Zahl",
      "bool": "Wahrheitswert",
      "values": "Werte",
      "value": "Wert",
      "operators": "Operatoren",
      "add": "Summe",
      "mult": "Produkt",
      "addIn": "Summand",
      "multIn": "Faktor",
      "res": "Ergebnis",
      "greater": "A>B",
      "equal": "A=B",
      "sub": "Differenz",
      "subIn": "Minuend",
      "subIn2": "Subtrahend",
      "processes": "Prozesse",
      "process": "Prozess",
      "processSelector": "Prozess-Auswahl",
      "cond": "Bedingung",
      "if": "Falls",
      "else": "Sonst",
      "numIn": "Eingabe - Zahl",
      "numOut": "Ausgabe - Zahl",
      "controlflow": "Kontroll-Fluss"
    }
  };
  private static processes: ReteData[] = [];

  private curProcess: number = 0;


  public static getCurProcess() { return this.instance?.curProcess };

  public static getProcessIDs() {
    return this.processes.map((value: Data, index: number) => { return { index: index, id: value.id.slice(0, value.id.length - 6) } });
  }

  static instance: SpreadBoardEditor | null;

  unselectNode() {
    this.selected.clear();
    this.trigger("nodeselected");
  }

  static getOrCreate(container: HTMLElement, id = "main@0.1.0", saveObj: SpreadBoardWorkspace = {
    processes: [
      {
        "id": "main@0.1.0",
        "nodes": {
          "90": {
            "id": 90,
            "data": {
              "num": 16
            },
            "inputs": {},
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 97,
                    "input": "a",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              815.5500179668154,
              384.6244892932236
            ],
            "name": "NumNode"
          },
          "91": {
            "id": 91,
            "data": {
              "num": 60
            },
            "inputs": {},
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 97,
                    "input": "b",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              815.2345256982412,
              538.659015685939
            ],
            "name": "NumNode"
          },
          "92": {
            "id": 92,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 97,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": []
              }
            },
            "outputs": {
              "num": {
                "connections": []
              }
            },
            "position": [
              1460.5034758550414,
              338.7766339203289
            ],
            "name": "Addition"
          },
          "97": {
            "id": 97,
            "data": {
              "id": "ggt"
            },
            "inputs": {
              "a": {
                "connections": [
                  {
                    "node": 90,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 91,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 92,
                    "input": "num",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              1131,
              346.68333435058594
            ],
            "name": "ProcessNode"
          }
        }
      },
      {
        "id": "max@0.1.0",
        "nodes": {
          "1": {
            "id": 1,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 4,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 2,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 5,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 3,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              602.4666595458984,
              315.3666687011719
            ],
            "name": "ConditionNode"
          },
          "2": {
            "id": 2,
            "data": {
              "key": "a",
              "val": 4
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 4,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 1,
                    "input": "if",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              18.466659545898438,
              265.3666687011719
            ],
            "name": "InputNumNode"
          },
          "3": {
            "id": 3,
            "data": {
              "key": "res",
              "val": 4
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 1,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              870.4666595458984,
              330.3666687011719
            ],
            "name": "OutputNumNode"
          },
          "4": {
            "id": 4,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 2,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 5,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 1,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              307.46665954589844,
              98.36666870117188
            ],
            "name": "GreaterNode"
          },
          "5": {
            "id": 5,
            "data": {
              "key": "b",
              "val": 3
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 4,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 1,
                    "input": "else",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              19.466659545898438,
              478.3666687011719
            ],
            "name": "InputNumNode"
          }
        }
      },
      {
        "id": "min@0.1.0",
        "nodes": {
          "1": {
            "id": 1,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 4,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 2,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 5,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 3,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              602.4666595458984,
              315.3666687011719
            ],
            "name": "ConditionNode"
          },
          "2": {
            "id": 2,
            "data": {
              "key": "a",
              "val": 4
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 1,
                    "input": "if",
                    "data": {}
                  },
                  {
                    "node": 4,
                    "input": "num2",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              18.466659545898438,
              265.3666687011719
            ],
            "name": "InputNumNode"
          },
          "3": {
            "id": 3,
            "data": {
              "key": "res",
              "val": 3
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 1,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              870.4666595458984,
              330.3666687011719
            ],
            "name": "OutputNumNode"
          },
          "4": {
            "id": 4,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 5,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 2,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 1,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              316.46665954589844,
              100.36666870117188
            ],
            "name": "GreaterNode"
          },
          "5": {
            "id": 5,
            "data": {
              "key": "b",
              "val": 3
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 1,
                    "input": "else",
                    "data": {}
                  },
                  {
                    "node": 4,
                    "input": "num",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              19.466659545898438,
              478.3666687011719
            ],
            "name": "InputNumNode"
          }
        }
      },
      {
        "id": "clean@0.1.0",
        "nodes": {
          "97": {
            "id": 97,
            "data": {
              "key": "a"
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 146,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 147,
                    "input": "if",
                    "data": {}
                  },
                  {
                    "node": 148,
                    "input": "else",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -142.53334045410156,
              156.68333435058594
            ],
            "name": "InputNumNode"
          },
          "98": {
            "id": 98,
            "data": {
              "val": 1,
              "key": "max"
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 150,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              1592.5778033368656,
              81.90555393139121
            ],
            "name": "OutputNumNode"
          },
          "99": {
            "id": 99,
            "data": {
              "key": "b"
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 146,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 147,
                    "input": "else",
                    "data": {}
                  },
                  {
                    "node": 148,
                    "input": "if",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -138.53334045410156,
              508.68333435058594
            ],
            "name": "InputNumNode"
          },
          "100": {
            "id": 100,
            "data": {
              "val": 1,
              "key": "min"
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 152,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              1587.5778027840108,
              329.7944416531424
            ],
            "name": "OutputNumNode"
          },
          "101": {
            "id": 101,
            "data": {
              "num": 1
            },
            "inputs": {},
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 149,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 150,
                    "input": "else",
                    "data": {}
                  },
                  {
                    "node": 151,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 152,
                    "input": "else",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              465.64445682347605,
              668.6833537005007
            ],
            "name": "NumNode"
          },
          "146": {
            "id": 146,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 97,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 99,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 147,
                    "input": "bool",
                    "data": {}
                  },
                  {
                    "node": 148,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              144.6851997969293,
              -103.53705815199035
            ],
            "name": "GreaterNode"
          },
          "147": {
            "id": 147,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 146,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 97,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 99,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 149,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 150,
                    "input": "if",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              383.5740874163001,
              158.68519683198986
            ],
            "name": "ConditionNode"
          },
          "148": {
            "id": 148,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 146,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 99,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 97,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 151,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 152,
                    "input": "if",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              348.0185335397846,
              432.01852045965256
            ],
            "name": "ConditionNode"
          },
          "149": {
            "id": 149,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 147,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 101,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 150,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              868.0185068389524,
              -105.7592799237384
            ],
            "name": "GreaterNode"
          },
          "150": {
            "id": 150,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 149,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 147,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 101,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 98,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              1244.6851671580287,
              102.01853262245498
            ],
            "name": "ConditionNode"
          },
          "151": {
            "id": 151,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 148,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 101,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 152,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              801.3518429979872,
              265.3518178779088
            ],
            "name": "GreaterNode"
          },
          "152": {
            "id": 152,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 151,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 148,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 101,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 100,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              1233.5740568250094,
              387.5740780218658
            ],
            "name": "ConditionNode"
          }
        }
      },
      {
        "id": "ggt@0.1.0",
        "nodes": {
          "16": {
            "id": 16,
            "data": {
              "key": "a",
              "val": 8
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 116,
                    "input": "a",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -31.745339862725608,
              312.11162002044506
            ],
            "name": "InputNumNode"
          },
          "17": {
            "id": 17,
            "data": {
              "key": "b",
              "val": 4
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 116,
                    "input": "b",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -30.504479413394208,
              497.977324582685
            ],
            "name": "InputNumNode"
          },
          "22": {
            "id": 22,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 116,
                    "output": "max",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 116,
                    "output": "min",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 25,
                    "input": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              700.9958561333885,
              -145.01406978909012
            ],
            "name": "GreaterNode"
          },
          "24": {
            "id": 24,
            "data": {
              "key": "res",
              "val": 4
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 25,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              1483.1156333105785,
              320.3775464378044
            ],
            "name": "OutputNumNode"
          },
          "25": {
            "id": 25,
            "data": {},
            "inputs": {
              "bool": {
                "connections": [
                  {
                    "node": 22,
                    "output": "bool",
                    "data": {}
                  }
                ]
              },
              "if": {
                "connections": [
                  {
                    "node": 114,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 116,
                    "output": "min",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 24,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              1223.0240681258697,
              380.76255023167386
            ],
            "name": "ConditionNode"
          },
          "26": {
            "id": 26,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 116,
                    "output": "max",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 116,
                    "output": "min",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 114,
                    "input": "a",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              610.8466635051366,
              163.7730701294534
            ],
            "name": "Difference"
          },
          "114": {
            "id": 114,
            "data": {
              "id": "ggt",
            },
            "inputs": {
              "a": {
                "connections": [
                  {
                    "node": 26,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 116,
                    "output": "min",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 25,
                    "input": "if",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              852.7021365502437,
              257.26161340507286
            ],
            "name": "ProcessNode"
          },
          "116": {
            "id": 116,
            "data": {
              "id": "clean",
            },
            "inputs": {
              "a": {
                "connections": [
                  {
                    "node": 16,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 17,
                    "output": "val",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "max": {
                "connections": [
                  {
                    "node": 26,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 22,
                    "input": "num",
                    "data": {}
                  }
                ]
              },
              "min": {
                "connections": [
                  {
                    "node": 26,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 22,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 114,
                    "input": "b",
                    "data": {}
                  },
                  {
                    "node": 25,
                    "input": "else",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              274.7520925473664,
              285.8619861884418
            ],
            "name": "ProcessNode"
          }
        }
      }
    ]
  }) {
    if (!this.instance)
      this.instance = new SpreadBoardEditor(container, id, saveObj);
    SpreadBoardEditor.importing = true;
    return this.instance;
  }


  public static getIOS(processId: string) {
    let processIndex = this.getProcessIndex(processId);
    let process = SpreadBoardEditor.processes[processIndex];
    if (!process) return { inputs: [], outputs: [] };
    let inputs: { key: string, name: string, socket: Socket }[] = [];
    let outputs: { key: string, name: string, socket: Socket }[] = [];
    for (let nodeKey in process.nodes) {
      let node = process.nodes[nodeKey];
      let data: any = SpreadBoardEditor.instance?.getComponent(node.name)?.data;
      if (data.process) {
        let processData = data.process as any;
        if (processData.type == "input") {
          let name: string = node.data.key as string;
          inputs.push({ key: name, name: name, socket: processData.socket })
        }
        if (processData.type == "output") {
          let name: string = node.data.key as string;
          outputs.push({ key: name, name: name, socket: processData.socket })
        }
      }
    }
    return {
      inputs: inputs,
      outputs: outputs
    };
  }

  private constructor(container: HTMLElement, id = "main@0.1.0", saveObj: SpreadBoardWorkspace = { processes: [{ id: "main@0.1.0", nodes: {} }] }) {
    super(id, container);

    this.editorProcessor = new Processor(
      new Engine(id)
    );

    if (!saveObj.processes.find((process) => process.id == id))
      SpreadBoardEditor.processes = [{ id: "main@0.1.0", nodes: {} }];
    SpreadBoardEditor.processes.push(...saveObj.processes);

    this.init();

  }

  async init() {
    this.use(VueRenderPlugin,
      {
        component: NodeVue
      });

    this.use(ConnectionPlugin);

    this.use(AreaPlugin, {
      background: false,
      snap: false,
      scaleExtent: { min: 0.25, max: 1 },
      translateExtent: { width: 5000, height: 4000 },
    });

    this.use(ContextMenuPlugin, {
      allocate: (component: Component) => {
        //return [];
        let data = component.data as any;
        if (data.category) {
          return data.category.map((sub: string[]) => {
            return i18n(sub);
          });
        }
        else return [];
      },
      rename(component: Component) {
        let data = component.data as any;
        if (data.i18nKeys)
          return i18n(data.i18nKeys) || component.name;
        return component.name;
      }
    });
    this.use(StandardNodes);

    for (let process of SpreadBoardEditor.processes) {
      await this.editorProcessor.compileProcess(process.id, process);
    }

    this.on(
      ["connectioncreated", 'connectionremoved', "nodecreated", 'noderemoved'],
      (data: any) => {
        if (!SpreadBoardEditor.importing) {
          //console.log(SpreadBoardEditor.importing,data);
          this.trigger("process");
        }
      }
    );

    this.on('process', async () => {
      //console.log('Start Processing');
      this.saveCurProcess();
      await this.processEditor();
    }
    );


    this.view.resize();
    this.trigger('process');
    console.log("Started editor");

    await this.loadProcess("main");

  }

  i18n(keys: string[]): string | undefined {
    return this.i18nRec(keys, this.i18nMap[this.curLocale]);
  }

  private i18nRec(keys: string[], map: i18nObj): string | undefined {
    let key = keys[0];
    if (!map[key])
      return undefined;
    let res = map[key];
    if (!res || typeof res === "string")
      return res;
    else
      return this.i18nRec(keys.slice(1), res);
  }

  register(component: Component): void {
    console.log("Register: ", component.name);
    super.register(component);
    this.editorProcessor.register(component);
  }

  registerAll(components: Component[]): void {
    components.forEach(component => {
      this.register(component);
    });
  }

  getCurProcessCode() {
    return this.editorProcessor.commandList(SpreadBoardEditor.processes[this.curProcess].id.replace("@0.1.0", ""));
  }

  async saveCurProcess() {
    if (!SpreadBoardEditor.importing) {
      try {
        let json = this.toJSON();
        SpreadBoardEditor.processes[this.curProcess].nodes = json.nodes;
        await this.editorProcessor.compileProcess(SpreadBoardEditor.processes[this.curProcess].id, this.toJSON());
        console.log((SpreadBoardEditor.processes[this.curProcess] as Object));
      } catch (error) {
        this.nodes.forEach(node => {
          node.inputs.forEach(input => {
            input.connections.forEach(
              (con) => {
                if (!con.output.node)
                  this.removeConnection(con);
              }
            )
          });
          node.outputs.forEach(output => {
            output.connections.forEach(
              (con) => {
                if (!con.input.node)
                  this.removeConnection(con);
              }
            )
          });
        });
      }
    }
  }

  clear(): void {
    let latestId = Node.latestId;
    this.editorProcessor.abort();
    const nodes = this.nodes;
    for (const node of nodes) {
      this.removeNode(node);
    }
    super.clear();
    this.eventEmitter.clear();
    this.editorProcessor.clear();
    Node.latestId = latestId;
  }

  installComponents(plugin: ComponentPlugin) {
    super.use(plugin);
  }

  public static importing: boolean = false;

  async fromJSON(json: Data) {
    //console.log("Importing json", SpreadBoardEditor.importing);
    let res = await super.fromJSON(json);
    //console.log("Imported json",SpreadBoardEditor.importing);
    return res;
  }

  async load(json: SpreadBoardWorkspace) {
    SpreadBoardEditor.processes = json.processes;
    return await this.fromJSON(SpreadBoardEditor.processes[0]);
  }

  addProcess(name: string) {
    let id = name + "@0.1.0";
    if (SpreadBoardEditor.processes.find((value: Data) => value.id == id))
      return;
    //console.log("Adding new Process:",id);
    SpreadBoardEditor.processes.push({
      id: id,
      nodes: {}
    })
  }

  processProcess(id: string) {
    return this.editorProcessor.processProcess(id);
  }

  async processEditor() {
    //console.log("Process Editor")
    await this.editorProcessor.process(this.toJSON());
  }

  static getProcessIndex(name: string) {
    return SpreadBoardEditor.processes.findIndex((process: Data) => {
      return (process.id == name || name + "@0.1.0" == process.id)
    })
  }

  async loadProcess(name: string) {
    let index = SpreadBoardEditor.getProcessIndex(name);
    //console.log("Saving Process")
    await this.saveCurProcess();
    SpreadBoardEditor.importing = true;
    this.curProcess = index;
    //console.log("Clear editor");
    this.clear();
    //console.log("Loading Process");
    let process = this.toJSON();
    process.nodes = SpreadBoardEditor.processes[index].nodes;
    await this.fromJSON(process);
    console.log("Start initial process");
    this.trigger('process');
    SpreadBoardEditor.importing = false;
  }
}

export function i18n(keys: string[]) {
  return SpreadBoardEditor.instance?.i18n(keys);
}