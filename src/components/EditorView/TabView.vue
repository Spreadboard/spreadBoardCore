<template>
    <div class="tab-handles">
        <button v-for="tab in tabs" :class="((tab == cur) ? ['selected'] : []).concat(['tabHandle'])" @click="select(tab)"
            @auxclick="close(tab)">
            {{ tab }} <button class="closeButton" @click="close(tab); $event.stopImmediatePropagation()">x</button>
        </button>
        <div class="filler"></div>
    </div>
    <div id="tabs">
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import EditorManager from '../../manager/EditorManager';


export default {
    name: "TabView",
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

        setTimeout(() => {
            manager.create("test");
            manager.create("test2");
            manager.select("test2");
            manager.select("test");
        }, 200);
    },
    setup(props) {

        let tabs = ref(undefined as string[] | undefined);

        let cur = ref(undefined as string | undefined);


        let close = (s: string) => { };
        let select = (s: string) => { };

        return {
            close,
            select,
            tabs,
            cur
        }
    }
}

</script>

<style>
.tabHandle {
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


#tabs {
    height: 90%;
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
</style>