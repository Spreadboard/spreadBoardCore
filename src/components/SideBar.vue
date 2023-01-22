<template>
    <div class="sidebar">
        <button v-for="item in map" @click="(_) => select(item.key)" :class="selected == item.key ? 'selected' : ''">
            <Icon :icon="item.icon"></Icon>
        </button>
    </div>

    <splitpanes style="height: 100%;width: 100%;">
        <pane min-size="10" :size="curSize" @resize="changeSize" v-if="selected!=''">
            <div id="bar">
            </div>
        </pane>
        <pane>
            <EditorTabsContainer></EditorTabsContainer>
        </pane>
    </splitpanes>

</template>

<script lang="ts">
import EditorTabsContainer from './EditorView/EditorTabsContainer.vue';
import { App, createApp, ref } from 'vue';
import ProcessSelector from './ProcessSelector.vue';
import Info from './Info.vue';
import CompiledPreview from './CompiledPreview.vue';
import Icon from './VS-Icon.vue'
import { SpreadBoardEditor } from '../editor/editor';
import Logs from './Logs.vue';
import { Splitpanes, Pane } from 'splitpanes';

export default {
    components: {
        ProcessSelector: ProcessSelector,
        Info: Info,
        Icon: Icon,
        CompiledPreview: CompiledPreview,
        EditorTabsContainer:EditorTabsContainer,
        Splitpanes: Splitpanes,
        Pane:Pane
    },
    setup() {
        
        let curSize = ref(10);

        const map = [
            {
                key: "processes",
                title: "Prozesse",
                icon: 'symbol-interface',
                componentName: ProcessSelector
            },
            {
                key: "logs",
                title: "Logs",
                icon: 'console',
                componentName: Logs
            },
            {
                key: "info",
                title: "Info",
                icon: 'lightbulb',
                componentName: Info
            }
        ]

        const getSelctedComp = () => {
            let key = selected.value;
            if (key == "") return undefined;
            return map.find((item) => item.key == key)?.componentName;
        }

        const selected = ref("");

        const isSelected = (key: string) => { return key == selected.value ? "selected" : "notSelected" };

        let curComp: App | undefined;

        const select = (key: string) => {
            if (selected.value != key)
                selected.value = key;
            else
                selected.value = "";
            SpreadBoardEditor.instance?.logger.log("Select:", selected.value);

            (async () => {

                if (curComp)
                    curComp.unmount();
                if (getSelctedComp() != undefined) {
                    let bar = createApp(getSelctedComp()!);
                    curComp = bar;
                    setTimeout(()=>{
                        bar.mount("#bar");
                    },50);
                }
            })();
        }
        
        const changeSize = (e:any)=>{
            console.log("resize",e)
        }

        return {
            map,
            selected,
            select,
            isSelected,
            getSelctedComp,
            curSize,
            changeSize
        }
    }
}

</script>

<style scoped>
.sidebar:deep() .icon {
    width: 100%;
}

.sidebar {
    padding: 5px;
    padding-right: 0;
    padding-top: 0;
    width: 30px;
    min-width: 30px;
    height: 100%;
    overflow-x: hidden;
    border-right: 1px solid #6f9aea;
}

button {
    display: flex;
    justify-content: center;
    max-width: 100%;
    width: 100%;
    padding: 2px;
    margin-bottom: 5px;
    border-radius: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-width: 2px;
    border-right-width: 0;
    border-color: #6f9aea;
}


button.selected {
    border-color: bisque;
}

#bar {
    overflow-x: hidden;
    max-height: 100%;
}

#bar.visible {
    width: fit-content;
    transition: ease-in-out all 500ms;
}
</style>