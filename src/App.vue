<script setup lang="ts">
import EditorTabsContainer from './components/EditorView/EditorTabsContainer.vue';
import ReteEditor from './components/ReteEditor.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
    <div class="editor">
        <SideBar></SideBar>
        <EditorTabsContainer></EditorTabsContainer>
    </div>

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
</style>
