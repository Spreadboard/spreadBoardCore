
import { Component, Engine, Node, NodeEditor, Socket } from 'rete';
import {EventEmitter} from './eventEmitter';

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
import { Processor } from './processor';

interface i18nObj{
    [index:string]: i18nObj | string;
}

interface i18nMap{
    [index: string]: i18nObj
}

type Locale = "de";


export class SpreadBoardEditor extends NodeEditor{
    readonly eventEmitter: EventEmitter = new EventEmitter;
    private globalProcessor: Processor;
    private editorProcessor: Processor;

    private curLocale: Locale = "de";
    public i18nMap: i18nMap= {
        "de":{
            "num":"Zahl",
            "bool":"Wahrheitswert",
            "values":"Werte",
            "value":"Wert",
            "operators":"Operatoren",
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
            "modules": "Module",
            "numIn": "Eingabe - Zahl",
            "numOut": "Ausgabe - Zahl",
            "controlflow": "Kontroll-Fluss"
        }
    };
    private static modules: ReteData[] = [];

    private curModule: number = 0;

    public static getCurModule(){ return this.instance?.curModule};

    public static getModuleIDs(){
        return this.modules.map((value: Data, index: number)=>{return {index: index, id: value.id.slice(0,value.id.length-6)}});
    }


    static instance: SpreadBoardEditor | null;

    static getOrCreate(container: HTMLElement, id = "main@0.1.0", saveObj: SpreadBoardWorkspace = {
      modules:[
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
                      "node": 96,
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
                      "node": 96,
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
                      "node": 96,
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
            "95": {
              "id": 95,
              "data": {
                "selected": "ggt"
              },
              "inputs": {},
              "outputs": {
                "module": {
                  "connections": [
                    {
                      "node": 96,
                      "input": "id",
                      "data": {}
                    }
                  ]
                }
              },
              "position": [
                817,
                234.68333435058594
              ],
              "name": "ModuleSelector"
            },
            "96": {
              "id": 96,
              "data": {
                "externalSelector": true,
                "custome_inputs": [
                  {
                    "key": "a",
                    "name": "a",
                    "socket": "number val"
                  },
                  {
                    "key": "b",
                    "name": "b",
                    "socket": "number val"
                  }
                ],
                "custome_outputs": [
                  {
                    "key": "res",
                    "name": "res",
                    "socket": "number val"
                  }
                ]
              },
              "inputs": {
                "id": {
                  "connections": [
                    {
                      "node": 95,
                      "output": "module",
                      "data": {}
                    }
                  ]
                },
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
                1164,
                287.68333435058594
              ],
              "name": "Module"
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
                    "node": 103,
                    "input": "a",
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
                    "node": 131,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              1001.4666595458984,
              129.68333435058594
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
                    "node": 130,
                    "input": "b",
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
                    "node": 104,
                    "output": "res",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              1006.4666595458984,
              398.68333435058594
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
                    "node": 130,
                    "input": "a",
                    "data": {}
                  },
                  {
                    "node": 103,
                    "input": "b",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              94.5333251953125,
              318.68333435058594
            ],
            "name": "NumNode"
          },
          "103": {
            "id": 103,
            "data": {
              "externalSelector": false,
              "id": "max"
            },
            "inputs": {
              "id": {
                "connections": []
              },
              "a": {
                "connections": [
                  {
                    "node": 97,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "b": {
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
                    "node": 104,
                    "input": "a",
                    "data": {}
                  },
                  {
                    "node": 131,
                    "input": "a",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              367.51666259765625,
              150.68333435058594
            ],
            "name": "Module"
          },
          "104": {
            "id": 104,
            "data": {
              "externalSelector": false,
              "id": "min"
            },
            "inputs": {
              "id": {
                "connections": []
              },
              "a": {
                "connections": [
                  {
                    "node": 103,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 130,
                    "output": "res",
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
              677.5166625976562,
              434.68333435058594
            ],
            "name": "Module"
          },
          "130": {
            "id": 130,
            "data": {
              "externalSelector": false,
              "id": "max"
            },
            "inputs": {
              "id": {
                "connections": []
              },
              "a": {
                "connections": [
                  {
                    "node": 101,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "b": {
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
                    "node": 104,
                    "input": "b",
                    "data": {}
                  },
                  {
                    "node": 131,
                    "input": "b",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              357.51666259765625,
              440.68333435058594
            ],
            "name": "Module"
          },
          "131": {
            "id": 131,
            "data": {
              "externalSelector": false,
              "id": "max"
            },
            "inputs": {
              "id": {
                "connections": []
              },
              "a": {
                "connections": [
                  {
                    "node": 103,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 130,
                    "output": "res",
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
              681.5166625976562,
              149.68333435058594
            ],
            "name": "Module"
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
                    "node": 114,
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
                    "node": 111,
                    "output": "module",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 110,
                    "output": "module",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "res": {
                "connections": [
                  {
                    "node": 114,
                    "input": "id",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              960.0240681258696,
              -107.23744976832614
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
                    "input": "b",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              699.8466635051366,
              503.7730701294534
            ],
            "name": "Difference"
          },
          "110": {
            "id": 110,
            "data": {
              "selected": "max"
            },
            "inputs": {},
            "outputs": {
              "module": {
                "connections": [
                  {
                    "node": 25,
                    "input": "else",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              696.244139080432,
              253.05613563022766
            ],
            "name": "ModuleSelector"
          },
          "111": {
            "id": 111,
            "data": {
              "selected": "ggt"
            },
            "inputs": {},
            "outputs": {
              "module": {
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
              697.2848166476076,
              107.34138078670202
            ],
            "name": "ModuleSelector"
          },
          "114": {
            "id": 114,
            "data": {
              "id": "max",
              "add_control": {
                "key": "addIo",
                "data": {},
                "parent": null,
                "component": {
                  "props": {},
                  "__hmrId": "92f05ae7",
                  "__scopeId": "data-v-92f05ae7",
                  "__file": "/home/lorenz/Dokumente/VsCode/spreadBoardCore/src/nodes/controls/VueAddIoControl.vue"
                },
                "props": {
                  "input": true,
                  "description": "Add In-/Output"
                }
              },
              "externalSelector": true,
              "custome_inputs": [
                {
                  "key": "a",
                  "name": "a",
                  "socket": "number val"
                },
                {
                  "key": "b",
                  "name": "b",
                  "socket": "number val"
                }
              ],
              "custome_outputs": [
                {
                  "key": "res",
                  "name": "res",
                  "socket": "number val"
                }
              ]
            },
            "inputs": {
              "id": {
                "connections": [
                  {
                    "node": 25,
                    "output": "res",
                    "data": {}
                  }
                ]
              },
              "a": {
                "connections": [
                  {
                    "node": 116,
                    "output": "min",
                    "data": {}
                  }
                ]
              },
              "b": {
                "connections": [
                  {
                    "node": 26,
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
                    "node": 24,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              1223.7021365502437,
              256.26161340507286
            ],
            "name": "Module"
          },
          "116": {
            "id": 116,
            "data": {
              "externalSelector": false,
              "id": "clean"
            },
            "inputs": {
              "id": {
                "connections": []
              },
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
                    "input": "a",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              274.7520925473664,
              285.8619861884418
            ],
            "name": "Module"
          }
        }
      }
    ]}){
        if(!this.instance)
            this.instance  = new SpreadBoardEditor(container, id, saveObj);
        SpreadBoardEditor.importing = true;
        this.instance.loadModule("main");
        return this.instance;
    }


    public static getIOS(moduleId: string){
      let moduleIndex = this.getModuleIndex(moduleId);
        let module = SpreadBoardEditor.modules[moduleIndex];
        //console.log(SpreadBoardEditor.instance?.modules, "index:",moduleIndex);
        //console.log(module);
        if(!module) return {inputs: [], outputs:[]};
        let inputs: {key:string, name: string, socket: Socket}[] = [];
        let outputs: {key:string, name: string, socket: Socket}[] = [];
        for(let nodeKey in module.nodes){
            let node = module.nodes[nodeKey];
            let data: any = SpreadBoardEditor.instance?.getComponent(node.name)?.data;
            if(data.module){
                let moduleData = data.module as any;
                if(moduleData.type == "input"){
                    let name: string = node.data.key as string;
                    inputs.push({key: name, name: name, socket: moduleData.socket})
                }
                if(moduleData.type == "output"){
                    let name: string = node.data.key as string;
                    outputs.push({key: name, name: name, socket: moduleData.socket})
                }
            }
        }
        return {
            inputs: inputs,
            outputs: outputs
        };
    }


    static async processModule(id: string, inputs: WorkerInputs, outputs: WorkerOutputs){
      let index = this.getModuleIndex(id);
        let module = SpreadBoardEditor.modules[index];
        if(!module) return;
        
        await SpreadBoardEditor.instance?.globalProcessor.processModule(module, null, inputs, outputs);

        return outputs;
    }

    private constructor(container: HTMLElement, id = "main@0.1.0",saveObj: SpreadBoardWorkspace = {modules:[{id:"main@0.1.0", nodes: {}}]}){
        super(id, container);

        this.editorProcessor = new Processor(
            new Engine(id)
        );

        this.globalProcessor = new Processor(
            new Engine("global@0.1.0")
        );

        if(!saveObj.modules.find((module)=>module.id==id))
          SpreadBoardEditor.modules = [{id:"main@0.1.0", nodes: {}}];
        SpreadBoardEditor.modules.push(...saveObj.modules);

        this.use(VueRenderPlugin,
            {
                component: NodeVue
            });
        this.use(ConnectionPlugin);
        this.use(AreaPlugin,{
            background: false,
            snap: false,
            scaleExtent: {min: 0.25, max: 1},
            translateExtent: {width: 5000, height: 4000},
        });
        this.use(ContextMenuPlugin, {
            allocate: (component: Component)=>{
                //return [];
                let data = component.data as any;
                if(data.category){
                    return data.category.map((sub:string[]) => {
                        return i18n(sub);
                    });
                }
                else return [];
            },
            rename(component: Component){
                let data = component.data as any;
                if(data.i18nKeys)
                    return i18n(data.i18nKeys) || component.name;
                return component.name;
            }
        });
        this.use(StandardNodes);


        this.on(
          ["connectioncreated", 'connectionremoved', "nodecreated", 'noderemoved'],
          (data: any) => {
            if(!SpreadBoardEditor.importing){
              //console.log(SpreadBoardEditor.importing,data);
              this.saveCurModule();
            }
            this.trigger("process");
          }
      );

      this.on('process', async () => {
          //console.log('json', editor.toJSON());
          await this.processEditor();
      });


      this.view.resize();
      this.trigger('process');
      console.log("Started editor");
    }

    i18n(keys: string[]): string | undefined{
        return this.i18nRec(keys, this.i18nMap[this.curLocale]);
    }

    private i18nRec(keys: string[], map: i18nObj): string | undefined{
        let key = keys[0];
        if(!map[key])
            return undefined;
        let res = map[key];
        if( !res || typeof res === "string" )
            return res;
        else
            return this.i18nRec(keys.slice(1), res);
    }

    register(component: Component): void {
        console.log("Register: ",component.name);
        super.register(component);
        this.editorProcessor.register(component);
        this.globalProcessor.register(component);
    }

    registerAll(components: Component[]): void {
        components.forEach(component => {
            this.register(component); 
        });
    }

    saveCurModule(){
      if(!SpreadBoardEditor.importing){
        SpreadBoardEditor.modules[this.curModule].nodes = this.toJSON().nodes;
        console.log((SpreadBoardEditor.modules[this.curModule] as Object));
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

    installComponents(plugin: ComponentPlugin){
        super.use(plugin);
    }

    public static importing: boolean = false; 

    async fromJSON(json: Data){
      //console.log("Importing json", SpreadBoardEditor.importing);
      let res = await super.fromJSON(json);
      //console.log("Imported json",SpreadBoardEditor.importing);
      return res;
    }

    async load(json: SpreadBoardWorkspace){
        SpreadBoardEditor.modules = json.modules;
        return await this.fromJSON(SpreadBoardEditor.modules[0]);
    }

    addModule(name: string){
        let id = name+"@0.1.0";
        if(SpreadBoardEditor.modules.find((value:Data)=>value.id == id))
            return;
        //console.log("Adding new Module:",id);
        SpreadBoardEditor.modules.push({
            id: id,
            nodes: {}
        })
    }

    async processEditor(){
        await this.editorProcessor.process(this.toJSON());
    }

    static getModuleIndex(name: string){
      return SpreadBoardEditor.modules.findIndex((module: Data)=>{
        return (module.id == name || name+"@0.1.0" == module.id)
      })
    }

    async loadModule(name: string){
        let index = SpreadBoardEditor.getModuleIndex(name);
        //console.log("Saving module")
        this.saveCurModule();
        SpreadBoardEditor.importing = true;
        this.curModule = index;
        //console.log("Clear editor");
        this.clear();
        //console.log("Loading Module");
        let module = this.toJSON();
        module.nodes = SpreadBoardEditor.modules[index].nodes;
        await this.fromJSON(module);
        //console.log("Start initial process");
        await this.processEditor();
        SpreadBoardEditor.importing = false;
    }
}

export function i18n(keys: string[]){
    return SpreadBoardEditor.instance?.i18n(keys);
}