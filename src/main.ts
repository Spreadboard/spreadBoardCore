import Vue, { createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {SpreadBoardEditor} from './editor/editor';
import 'regenerator-runtime/runtime';

import testCompile from './processor/test-compile'

testCompile()

createApp(App).mount('#app')
