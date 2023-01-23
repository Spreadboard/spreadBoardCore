<script setup lang="ts">
import ReteEditor from './components/ReteEditor.vue';
import SideBar from './components/SideBar.vue';
import 'splitpanes/dist/splitpanes.css';
</script>

<template>
    <div class="editor">

        <SideBar></SideBar>
    </div>
    <div id="editor-blank" style="display: none;"></div>
</template>

<style>
body,
html,
#app {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    padding: 0;
    margin-bottom: 5px;
    overflow: hidden;
}

.editor {
    padding: 5px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: row;
}


@media (prefers-color-scheme: dark) {
    .light {
        display: none;
    }
}

@media (prefers-color-scheme: light) {
    .dark {
        display: none;
    }

    button.selected {
        border-color: coral;
    }
}

.splitpanes__splitter {
    background-color: #ccc;
    position: relative;
}

.splitpanes__splitter:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    transition: opacity 0.1s;
    background-color: #646cff;
    opacity: 0;
    z-index: 1;
}

.splitpanes__splitter:hover:before {
    opacity: 1;
}

.splitpanes--vertical>.splitpanes__splitter:before {
    left: -1px;
    right: -1px;
    height: 100%;
}

.splitpanes--horizontal>.splitpanes__splitter:before {
    top: -30px;
    bottom: -30px;
    width: 100%;
}
</style>
