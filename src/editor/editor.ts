
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
                      "node": 93,
                      "input": "16",
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
                      "node": 93,
                      "input": "17",
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
                      "node": 93,
                      "output": "24",
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
                1557.5034758550414,
                344.7766339203289
              ],
              "name": "Addition"
            },
            "93": {
              "id": 93,
              "data": {
                "id": "ggt"
              },
              "inputs": {
                "16": {
                  "connections": [
                    {
                      "node": 90,
                      "output": "num",
                      "data": {}
                    }
                  ]
                },
                "17": {
                  "connections": [
                    {
                      "node": 91,
                      "output": "num",
                      "data": {}
                    }
                  ]
                },
                "eval": {
                  "connections": [
                    {
                      "node": 94,
                      "output": "bool",
                      "data": {}
                    }
                  ]
                }
              },
              "outputs": {
                "24": {
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
                1202.07721910915,
                354.7941420232055
              ],
              "name": "Module"
            },
            "94": {
              "id": 94,
              "data": {
                "bool": true
              },
              "inputs": {},
              "outputs": {
                "bool": {
                  "connections": [
                    {
                      "node": 93,
                      "input": "eval",
                      "data": {}
                    }
                  ]
                }
              },
              "position": [
                810.6903952012094,
                235.4900489075044
              ],
              "name": "BoolNode"
            }
          }
        },
        {
        "id": "inc@0.1.0",
        "nodes": {
          "1": {
            "id": 1,
            "data": {
              "key": "a"
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 3,
                    "input": "num",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -78.79275764774988,
              17.238356996708795
            ],
            "name": "InputNumNode"
          },
          "2": {
            "id": 2,
            "data": {
              "val": 1,
              "key": "b"
            },
            "inputs": {
              "val": {
                "connections": [
                  {
                    "node": 3,
                    "output": "num",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {},
            "position": [
              559.8066876006092,
              58.2953985302745
            ],
            "name": "OutputNumNode"
          },
          "3": {
            "id": 3,
            "data": {
              "num2": 1
            },
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 1,
                    "output": "val",
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
                "connections": [
                  {
                    "node": 2,
                    "input": "val",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              201.78632063999544,
              -35.20510549466775
            ],
            "name": "Addition"
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
              "key": "max-a",
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
              "key": "max",
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
              "key": "max-b",
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
              "key": "min-a",
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
              "key": "min",
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
              "key": "min-b",
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
        "id": "ggt@0.1.0",
        "nodes": {
          "16": {
            "id": 16,
            "data": {
              "key": "ggt-a",
              "val": 8
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 86,
                    "input": "2",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -645.1398674865914,
              111.17396956787036
            ],
            "name": "InputNumNode"
          },
          "17": {
            "id": 17,
            "data": {
              "key": "ggt-b",
              "val": 2
            },
            "inputs": {},
            "outputs": {
              "val": {
                "connections": [
                  {
                    "node": 88,
                    "input": "5",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -645.1398674865915,
              408.1415212714326
            ],
            "name": "InputNumNode"
          },
          "18": {
            "id": 18,
            "data": {
              "id": "max"
            },
            "inputs": {
              "2": {
                "connections": [
                  {
                    "node": 86,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "5": {
                "connections": [
                  {
                    "node": 88,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "eval": {
                "connections": [
                  {
                    "node": 20,
                    "output": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "3": {
                "connections": [
                  {
                    "node": 22,
                    "input": "num",
                    "data": {}
                  },
                  {
                    "node": 26,
                    "input": "num",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              344.46665954589844,
              69.36666870117188
            ],
            "name": "Module"
          },
          "19": {
            "id": 19,
            "data": {
              "id": "min"
            },
            "inputs": {
              "2": {
                "connections": [
                  {
                    "node": 86,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "5": {
                "connections": [
                  {
                    "node": 88,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "eval": {
                "connections": [
                  {
                    "node": 20,
                    "output": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "3": {
                "connections": [
                  {
                    "node": 22,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 26,
                    "input": "num2",
                    "data": {}
                  },
                  {
                    "node": 27,
                    "input": "17",
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
              342.46665954589844,
              333.3666687011719
            ],
            "name": "Module"
          },
          "20": {
            "id": 20,
            "data": {
              "bool": true
            },
            "inputs": {},
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 18,
                    "input": "eval",
                    "data": {}
                  },
                  {
                    "node": 19,
                    "input": "eval",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              96.46225686899598,
              -86.31571874534211
            ],
            "name": "BoolNode"
          },
          "22": {
            "id": 22,
            "data": {},
            "inputs": {
              "num": {
                "connections": [
                  {
                    "node": 18,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 19,
                    "output": "3",
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
                  },
                  {
                    "node": 27,
                    "input": "eval",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              664.714713711388,
              -209.907414234908
            ],
            "name": "GreaterNode"
          },
          "24": {
            "id": 24,
            "data": {
              "key": "ggt",
              "val": 2
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
              1575.0093388096154,
              189.7725676711401
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
                    "node": 27,
                    "output": "24",
                    "data": {}
                  }
                ]
              },
              "else": {
                "connections": [
                  {
                    "node": 19,
                    "output": "3",
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
              1329.372317306085,
              234.20880782027916
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
                    "node": 18,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "num2": {
                "connections": [
                  {
                    "node": 19,
                    "output": "3",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 27,
                    "input": "16",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              656.4394722158615,
              57.30456297928059
            ],
            "name": "Difference"
          },
          "27": {
            "id": 27,
            "data": {
              "id": "ggt"
            },
            "inputs": {
              "16": {
                "connections": [
                  {
                    "node": 26,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "17": {
                "connections": [
                  {
                    "node": 19,
                    "output": "3",
                    "data": {}
                  }
                ]
              },
              "eval": {
                "connections": [
                  {
                    "node": 22,
                    "output": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "24": {
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
              887.1959209445669,
              97.65127461998998
            ],
            "name": "Module"
          },
          "86": {
            "id": 86,
            "data": {
              "id": "max"
            },
            "inputs": {
              "2": {
                "connections": [
                  {
                    "node": 16,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "5": {
                "connections": [
                  {
                    "node": 87,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "eval": {
                "connections": [
                  {
                    "node": 89,
                    "output": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "3": {
                "connections": [
                  {
                    "node": 18,
                    "input": "2",
                    "data": {}
                  },
                  {
                    "node": 19,
                    "input": "2",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -379.94100729873577,
              37.57762438723701
            ],
            "name": "Module"
          },
          "87": {
            "id": 87,
            "data": {
              "num": 1
            },
            "inputs": {},
            "outputs": {
              "num": {
                "connections": [
                  {
                    "node": 86,
                    "input": "5",
                    "data": {}
                  },
                  {
                    "node": 88,
                    "input": "2",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -644.0932479749742,
              276.6216314456968
            ],
            "name": "NumNode"
          },
          "88": {
            "id": 88,
            "data": {
              "id": "max"
            },
            "inputs": {
              "2": {
                "connections": [
                  {
                    "node": 87,
                    "output": "num",
                    "data": {}
                  }
                ]
              },
              "5": {
                "connections": [
                  {
                    "node": 17,
                    "output": "val",
                    "data": {}
                  }
                ]
              },
              "eval": {
                "connections": [
                  {
                    "node": 89,
                    "output": "bool",
                    "data": {}
                  }
                ]
              }
            },
            "outputs": {
              "3": {
                "connections": [
                  {
                    "node": 19,
                    "input": "5",
                    "data": {}
                  },
                  {
                    "node": 18,
                    "input": "5",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -374.94100729873577,
              335.577624387237
            ],
            "name": "Module"
          },
          "89": {
            "id": 89,
            "data": {
              "bool": true
            },
            "inputs": {},
            "outputs": {
              "bool": {
                "connections": [
                  {
                    "node": 86,
                    "input": "eval",
                    "data": {}
                  },
                  {
                    "node": 88,
                    "input": "eval",
                    "data": {}
                  }
                ]
              }
            },
            "position": [
              -582.6053628256069,
              -60.45555421068538
            ],
            "name": "BoolNode"
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
                    let key = node.id;
                    inputs.push({key: key.toString(), name: name, socket: moduleData.socket})
                }
                if(moduleData.type == "output"){
                    let name: string = node.data.key as string;
                    let key = node.id;
                    outputs.push({key: key.toString(), name: name, socket: moduleData.socket})
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
        console.log(SpreadBoardEditor.modules[this.curModule]);
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