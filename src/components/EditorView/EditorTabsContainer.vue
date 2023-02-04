<template>
    <div style="max-height: 100%; max-width: 100%; height: 100%; width: 100%;">


        <div style="text-align: start; display: flex;" v-if="openTabs.length > 0">
            <button v-for="tab of openTabs" :class="'tab ' + ((openTab == tab) ? 'selected' : '')"
                style="display: inline-block;" @click="(_) => open(tab)"
                @mousedown="(e) => { if (e.button == 0) open(tab); if (e.button == 1) close(tab) }">
                {{ tab }}
            </button>
            <div class="spacer"></div>
        </div>
        <div v-if="openTabs.length > 0" style="height: 100%;">

            <div class="float" v-if="openTabs.length != 0">

                <button class="float" @click="codeOpen = !codeOpen">
                    <Icon icon="code"></Icon>
                </button>
                <button v-if="codeOpen" @click="onlyCode = !onlyCode">
                    <Icon :icon="onlyCode?'split-horizontal':'screen-full'"></Icon>
                </button>
            </div>


            <splitpanes style="height: 100%;width: 100%;" @pane-maximize="onlyCode = true">
                <pane min-size="20" v-if="!onlyCode || !codeOpen">
                    <ReteEditor></ReteEditor>
                </pane>
                <pane min-size="20" :size="40" v-if="codeOpen">
                    <CompiledPreview></CompiledPreview>
                </pane>
            </splitpanes>
        </div>
        <div v-if="openTabs.length == 0" class="blank">
            No Tab Open
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed} from 'vue';
import ReteEditor from '../ReteEditor.vue';
import {SpreadBoardEditor} from '../../editor/editor';
import { EditorTabHandler } from './EditorTabHandler'
//@ts-ignore
import { Splitpanes, Pane } from 'splitpanes';
import CompiledPreview from '../CompiledPreview.vue';
import Icon from "../VS-Icon.vue";

export default defineComponent({
    setup() {
        const openTabs = ref([] as string[]);
        const openTab = ref(undefined as undefined | string);
        EditorTabHandler.onChange((tab, tabs) => {
            openTabs.value = tabs;
            openTab.value = tab;
            console.log("Test", tabs)
        });
        const open = (tab: string) => EditorTabHandler.openTab(tab);
        const close = (tab: string) => {
            EditorTabHandler.closeTab(tab);
        }


        let codeOpen = ref(false)
        let onlyCode = ref(false)

        let loading = computed(()=>{
            return SpreadBoardEditor.importing;
        });

        return {
            openTabs,
            openTab,
            open,
            close,
            codeOpen,
            onlyCode,
            loading
        }
    },
    components: {
        ReteEditor,
        Splitpanes,
        Pane,
        CompiledPreview,
        Icon
    }
});

</script>

<style scoped>
div.float {
    position: absolute;
    margin-top: 5px;
    width: min-content;
    right: 5px;
}

.float>button {
    width: 30px;
    height: 30px;
    padding: 3px;
    margin-bottom: 5px;
    box-shadow: 1px 1px 3px #000000;
}

.float>button:deep() .icon {
    min-height: 20% !important;
    height: 100%;
}

button.tab {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-color: #646cff;
    border-bottom-width: 1px;
}

button.tab.selected {
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

.blank {
    height: 100%;
    width: 100%;
    margin: auto;
    border-color: #646cff;
    border-left-width: 1px;
    border-left-style: solid;
}
</style>