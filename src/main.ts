import Vue, { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'regenerator-runtime/runtime';
import { SpreadBoardEditor } from './editor/editor';


//testCompile()

createApp(App).mount('#app')

SpreadBoardEditor.getOrCreate(document.getElementById("editor-blank")!, undefined, undefined, true);