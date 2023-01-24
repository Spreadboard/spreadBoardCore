<template>
    <div class="selector-bar" @mousedown="(e) => { if (e.button != 2) showMenu(-1); }">
        <div class="searchBar">
            <input type="search" placeholder="Search..." :on-submit="addProcess" :value="searchProcessName"
                @input="change($event)" />
        </div>

        <div style="display: inline-flex; margin-right: 10px; margin-left: 10px; padding-bottom: 5px;"
            v-for='process of processes().filter((p) => p.id.includes(searchProcessName))'
            @mousedown="(e) => { if (e.button == 2) { e.stopPropagation(); showMenu(process.index); } }">
            <button style="flex-grow: 1; margin-right: 5px; padding-right: 5px;"
                :class="curProcess == process.index ? 'selected' : ''" @click="(_) => select(process.id)">
                {{ process.id }}
            </button>
            <div :class="'menu ' + ((true || (menuId != process.index)) ? 'hidden' : '')">
                Hallo Welt
            </div>
        </div>
        <div style="margin-right: 10px; margin-left: 10px;">
            <button v-if="searchProcessName != ''" class="addProcess" @click="addProcess">
                <b>+</b>
                <i>{{
                    searchProcessName
                }}</i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';
import { EditorTabHandler } from './EditorView/EditorTabHandler';
import Icon from './VS-Icon.vue';
export default {
    components: {
        Icon
    },
    setup() {
        let curProcess = ref(SpreadBoardEditor.getCurProcess());

        EditorTabHandler.onChange((tab, tabs) => {
            setTimeout(
                () => {
                    curProcess.value = SpreadBoardEditor.getCurProcess();
                },
                20
            );
        })

        const select = (id: string) => {
            curProcess.value = processes().find((proc) => proc.id == id)?.index;
            EditorTabHandler.openTab(id);
        };
        let processes = () => {
            return SpreadBoardEditor.getProcessIDs()?.map((process) => { return { id: process.id, index: process.index, className: selected(process.index) } });
        };

        const addProcess = (_: any) => {
            SpreadBoardEditor.instance?.addProcess(searchProcessName.value.toString());
            searchProcessName.value = "";
        }

        let selected = (index: number) => { curProcess.value == index ? "selected" : "" };

        let searchProcessName = ref("");
        const change = (event: any) => {
            searchProcessName.value = event.target.value
        };

        let menuId = ref(-1);

        const showMenu = (id: number) => {
            console.log(id);
            menuId.value = id;
        }

        return {
            select,
            processes,
            searchProcessName,
            change,
            addProcess,
            selected,
            curProcess,
            showMenu,
            menuId
        }
    }
}

</script>

<style scoped>
.hidden {
    display: none;
}

.menu {
    position: absolute;
    z-index: 20;
}

.selector-bar:deep().node {
    max-width: 100%;
}

.selector-bar:deep()ul {
    padding: 0;
}

.selector-bar {
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    max-height: 100%;
    height: 100%;
    overflow-y: scroll;
}

button {
    max-width: 90%;
    padding: 5px;
}

@media (prefers-color-scheme: light) {
    button {
        box-shadow: 1px 2px 1px gray;
    }
}

button.selected {
    border-color: bisque;
}

@media (prefers-color-scheme: light) {
    button.selected {
        border-width: 2px;
        border-color: coral;
    }
}

.addProcess {
    width: 100%;
    margin-left: 2px;
    display: flex;
    flex-flow: row;
}

.addProcess>i {
    flex-grow: 1;
}


.searchBar {
    width: 100%;
}

.searchBar>input {
    max-width: 75%;
}

.searchCancel {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    margin-right: 5px
}

.searchBar>input {
    max-width: 80% !important
}
</style>