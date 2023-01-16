

import { Engine } from "rete";
import { Processor } from "./processor";
import StandardNodes from "../nodes";

import { Data } from "rete/types/core/data";


export default async function testCompile(){


    let processor = new Processor(new Engine("compiler@0.1.0"));


    for(let node of StandardNodes.components){
        processor.register(node);
    }
    
    
    let max: Data = {
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
      };

    let min: Data = {
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
    };

    let clean: Data = {
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
            "name": "ProcessNode"
          },
          "104": {
            "id": 104,
            "data": {
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
            "name": "ProcessNode"
          },
          "130": {
            "id": 130,
            "data": {
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
            "name": "ProcessNode"
          },
          "131": {
            "id": 131,
            "data": {
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
            "name": "ProcessNode"
          }
        }
    }
    

    let ggt: Data = {
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
                "connections": []
              },
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
    
    await processor.compileProcess("max", max);
    await processor.compileProcess("min", min);
    await processor.compileProcess("clean", clean);
    let ggt_command = await processor.compileProcess("ggt", ggt);

    console.log(ggt_command.processDependencys)
    console.log(processor.processProcess("ggt")?.toString())

}