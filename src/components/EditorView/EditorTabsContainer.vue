<template>
    <div style="max-height: 100%; max-width: 100%; height: 100%; width: 100%;">
        <div style="text-align: start; display: flex;" v-if="openTabs.length>0">
            <button v-for="tab of openTabs" :class="(openTab == tab) ? 'selected' : ''" style="display: inline-block;"
                @click="(_) => open(tab)"
                @mousedown="(e) => { if (e.button == 0) open(tab); if (e.button == 1) close(tab) }">
                {{ tab }}
            </button>
            <div class="spacer"></div>
        </div>
        <div :style="`height: ${(openTabs.length == 0) ? '0' : '100%'};`">
            <ReteEditor></ReteEditor>
        </div>
        <div v-if="openTabs.length==0" class="blank">
            No Tab Open
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ReteEditor from '../ReteEditor.vue';
import { EditorTabHandler } from './EditorTabHandler'

export default defineComponent({
    setup() {
        const openTabs = ref([] as string[]);
        const openTab = ref(undefined as undefined | string);
        EditorTabHandler.onChange(() => {
            openTabs.value = EditorTabHandler.getOpenTabs();
            openTab.value = EditorTabHandler.getOpenTab();
            console.log("Test", EditorTabHandler.getOpenTabs())
        });
        const open = (tab: string) => EditorTabHandler.openTab(tab);
        const close = (tab: string) => {
            EditorTabHandler.closeTab(tab);
        }
        return {
            openTabs,
            openTab,
            open,
            close
        }
    },
    components: { ReteEditor }
});

</script>

<style scoped>
button {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-color: #646cff;
    border-bottom-width: 1px;
}

button.selected {
    border-bottom-width: 0;
}

.spacer {
    height: 40px;
    flex-grow: 1;
    border-color: #646cff;
    border-width: 0;
    border-bottom-width: 1px;
    border-style: solid;
}

.blank{
    height: 100%;
    width: 100%;
    margin: auto;
    border-color: #646cff;
    border-left-width: 1px;
    border-left-style: solid;
}
</style>