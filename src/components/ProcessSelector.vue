<template>
    <div class="selector-bar" @mousedown="(e) => { if (e.button != 2) showMenu(''); }">
        <div class="searchBar">
            <input type="search" placeholder="Search..." :on-submit="addProcess" :value="searchProcessName"
                @input="change($event)" />
        </div>

        <div style="display: inline-flex; margin-right: 10px; margin-left: 10px; padding-bottom: 5px;"
            v-for='process of processes()?.filter((p) => p.id.includes(searchProcessName))'
            @mousedown="(e) => { if (e.button == 2) { e.stopPropagation(); showMenu(process.id); } }">
            <button style="flex-grow: 1; margin-right: 5px; padding-right: 5px;"
                :class="curProcess == process.id ? 'selected' : ''" @click="(_) => select(process.id)">
                {{ process.id }}
            </button>
            <div :class="'menu ' + ((true || (menuId != process.id)) ? 'hidden' : '')">
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
import EditorManager from '../manager/EditorManager';
import Icon from './VS-Icon.vue';
export default {
    components: {
        Icon
    },
    setup() {
        let manager = EditorManager.getInstance();
        let curProcess = ref(manager?.getSelected());

        manager?.onSelected(
            (selected) => {
                curProcess.value = selected;
            }
        );

        const select = (id: string) => {
            manager?.select(id);
        };


        let processes = () => {
            return manager?.getProcesses().map((process, index) => { return { id: process, index: index, className: selected(process) } });
        };

        const addProcess = (_: any) => {
            manager?.create(searchProcessName.value.toString());
            searchProcessName.value = "";
        }

        let selected = (id: string) => { curProcess.value == id ? "selected" : "" };

        let searchProcessName = ref("");
        const change = (event: any) => {
            searchProcessName.value = event.target.value
        };

        let menuId = ref('');

        const showMenu = (id: string) => {
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