import { Control } from "rete";

export abstract class ValueControl<T> extends Control {
    default: T;

    constructor(default_val: T, key: string,) {
        super(key);
        this.default = default_val;
    }


    setValue(val?: T) {
        //@ts-ignore
        this.vueContext.value = val ?? this.default;
    }

    getValue() {
        //@ts-ignore
        return this.vueContext.value ?? (this.vueContext.value = this.default);
    }
}