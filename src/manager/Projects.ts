import { Data } from "rete/types/core/data";
import StandardNodes from "../nodes";
import { ComponentPlugin } from "./componentPlugin";

export type ProjectData = {
    processes: Data[],
    packets?: ComponentPlugin[]
}

let DefaultProject: ProjectData = {
    processes: [
        {
            "id": "main",
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
                        20.550017966815403,
                        87.62448929322358
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
                        20.234525698241214,
                        241.65901568593904
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
                        665.5034758550414,
                        41.77663392032889
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
                        336,
                        49.68333435058594
                    ],
                    "name": "ProcessNode"
                }
            }
        },
        {
            "id": "max",
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
            "id": "min",
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
            "id": "ggt",
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
                                },
                                {
                                    "node": 161,
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
                                },
                                {
                                    "node": 161,
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
                                    "node": 119,
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
                "114": {
                    "id": 114,
                    "data": {
                        "id": "ggt"
                    },
                    "inputs": {
                        "a": {
                            "connections": [
                                {
                                    "node": 117,
                                    "output": "num",
                                    "data": {}
                                }
                            ]
                        },
                        "b": {
                            "connections": [
                                {
                                    "node": 161,
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
                                    "node": 119,
                                    "input": "else",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "position": [
                        884.7021365502437,
                        219.26161340507292
                    ],
                    "name": "ProcessNode"
                },
                "116": {
                    "id": 116,
                    "data": {
                        "id": "max"
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
                        "res": {
                            "connections": [
                                {
                                    "node": 117,
                                    "input": "num",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "position": [
                        275.7520925473664,
                        265.8619861884418
                    ],
                    "name": "ProcessNode"
                },
                "117": {
                    "id": 117,
                    "data": {},
                    "inputs": {
                        "num": {
                            "connections": [
                                {
                                    "node": 116,
                                    "output": "res",
                                    "data": {}
                                }
                            ]
                        },
                        "num2": {
                            "connections": [
                                {
                                    "node": 161,
                                    "output": "res",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "outputs": {
                        "num": {
                            "connections": [
                                {
                                    "node": 118,
                                    "input": "num",
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
                        592.6333312988281,
                        140.6999969482422
                    ],
                    "name": "Modulo"
                },
                "118": {
                    "id": 118,
                    "data": {},
                    "inputs": {
                        "num": {
                            "connections": [
                                {
                                    "node": 117,
                                    "output": "num",
                                    "data": {}
                                }
                            ]
                        },
                        "num2": {
                            "connections": []
                        }
                    },
                    "outputs": {
                        "bool": {
                            "connections": [
                                {
                                    "node": 119,
                                    "input": "bool",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "position": [
                        840.6333312988281,
                        -37.30000305175781
                    ],
                    "name": "EqualNode"
                },
                "119": {
                    "id": 119,
                    "data": {},
                    "inputs": {
                        "bool": {
                            "connections": [
                                {
                                    "node": 118,
                                    "output": "bool",
                                    "data": {}
                                }
                            ]
                        },
                        "if": {
                            "connections": [
                                {
                                    "node": 161,
                                    "output": "res",
                                    "data": {}
                                }
                            ]
                        },
                        "else": {
                            "connections": [
                                {
                                    "node": 114,
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
                                    "node": 24,
                                    "input": "val",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "position": [
                        1199.0240681258697,
                        342.7625502316739
                    ],
                    "name": "ConditionNode"
                },
                "161": {
                    "id": 161,
                    "data": {
                        "id": "min"
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
                        "res": {
                            "connections": [
                                {
                                    "node": 119,
                                    "input": "if",
                                    "data": {}
                                },
                                {
                                    "node": 114,
                                    "input": "b",
                                    "data": {}
                                },
                                {
                                    "node": 117,
                                    "input": "num2",
                                    "data": {}
                                }
                            ]
                        }
                    },
                    "position": [
                        275.7520925473664,
                        493.86198618844173
                    ],
                    "name": "ProcessNode"
                }
            }
        }
    ],
    packets: [StandardNodes]
}

export { DefaultProject };