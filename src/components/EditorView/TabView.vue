<template>
    <div class="manager">
        <div class="tab-handles">
            <button v-for="tab in tabs" :class="((tab == cur) ? ['selected'] : []).concat(['tabHandle'])"
                @click="select(tab)" @auxclick="close(tab)">
                {{ tab }} <button class="closeButton" @click="close(tab); $event.stopImmediatePropagation()">x</button>
            </button>
            <div class="filler"></div>
        </div>

        <div class="tab-container">

            <div class="float" v-if="tabs?.length != 0">

                <button class="float" @click="codeOpen = !codeOpen">
                    <Icon icon="code"></Icon>
                </button>
            </div>

            <splitpanes style="height: 100%;width: 100%;" @pane-maximize="codeOpen = false">
                <pane min-size="20">
                    <div id="tabs"></div>
                </pane>
                <pane min-size="20" :size="40" v-if="codeOpen">
                    <CompiledPreview></CompiledPreview>
                </pane>
            </splitpanes>


        </div>

    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import EditorManager from '../../manager/EditorManager';
import Icon from '../VS-Icon.vue';
//@ts-ignore
import { Splitpanes, Pane } from 'splitpanes';
import CompiledPreview from '../CompiledPreview.vue';


export default {
    name: "TabView",
    components: {
        Icon,
        Splitpanes,
        Pane,
        CompiledPreview
    },
    mounted() {
        let manager = new EditorManager(document.getElementById("tabs")!);

        this.tabs = manager.getOpenTabs();
        manager.onTabsChange(() => {
            this.tabs = manager.getOpenTabs()
        })

        this.cur = manager.getSelected();
        manager.onTabsChange(() => {
            this.cur = manager.getSelected()
        })

        this.close = (tab) => {
            console.log("Attempting to Close tab");
            manager.close(tab);
        };
        this.select = (tab) => {
            manager.select(tab);
        };
    },
    setup(props) {

        let tabs = ref(undefined as string[] | undefined);

        let cur = ref(undefined as string | undefined);

        let codeOpen = ref(false);

        let onlyCode = ref(false);

        let close = (s: string) => { };
        let select = (s: string) => { };

        return {
            close,
            select,
            tabs,
            cur,
            codeOpen,
            onlyCode
        }
    }
}

</script>

<style>
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

.manager {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
}

.tab-handles {
    max-height: 8%;
    overflow-y: hidden;
    text-align: start;
}

.tabHandle {
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-width: 0;
    margin-bottom: 0;
    background-color: unset;
    box-shadow: unset;
}

.tabHandle:hover {
    background-color: #0f0f0f40;
}

.tabHandle.selected {
    background-color: #0f0f0f70;
}

.tabHandle>.closeButton {
    opacity: 0;
}

.tabHandle.selected>.closeButton,
.tabHandle:hover>.closeButton {
    opacity: 1;
}

.closeButton {
    border-width: 0;
    width: 1.5em;
    height: 1.5em;
    padding: 2px;
    background-color: #0f0f0f00;
    border-radius: 50%;
    box-shadow: none;
}

.closeButton:hover {
    background-color: #ffffff40;
    border-color: #0f0f0f00;
}


.tab-container {
    min-height: 92%;
    width: 100%;
    flex-grow: 1;
}

#tabs {
    height: 100%;
    width: 100%;
    background-color: unset;
}

.visible {
    background-color: #0f0f0f70;
}


.hidden {
    height: 0;
    width: 0 !important;
    display: none;
}

@media (prefers-color-scheme: light) {


    .tabHandle {
        background-color: #0f0f0f20;
    }

    .tabHandle:hover {
        background-color: #0f0f0f10;
    }

    .tabHandle.selected {
        background-color: #ffffff70;
        z-index: 5;
    }

    .visible {
        z-index: 0;
        background-color: #ffffff00;
        box-shadow: 1px 1px 5px #00000040;
    }
}
</style>