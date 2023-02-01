import Vue, { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'regenerator-runtime/runtime';
import { SpreadBoardEditor } from './editor/editor';
import { combineLatest, map, Observable, ObservedValueTupleFromArray, pipe } from 'rxjs';
import { ObservableVariable } from './processor/variable';

//testCompile()

//@ts-ignore
const x = (a, b) => {
    return a + b
}

console.log(x.toString())

type x = {
    a: ObservableVariable<number>,
    b: ObservableVariable<string>,
    c: ObservableVariable<number>
}

type X = ObservedValueTupleFromArray<x>;


let y: x = { a: new ObservableVariable(0), b: new ObservableVariable(""), c: new ObservableVariable(0) };

combineLatest(y).pipe(map(({ a, b, c }) => a % c)).subscribe((mod) => console.log(mod));



pipe(
    map(
        (a) => {
            return a;
        }
    )
)

y.a.set(40);
y.c.set(20);
y.c.set(10);

createApp(App).mount('#app')

SpreadBoardEditor.getOrCreate(document.getElementById("editor-blank")!, undefined, undefined, true);