<template>
    <div class="selector-bar">
        <div><input type="text" :on-submit="addProcess" :value="newProcessName" @input="change($event)"/></div>
        <div style="display: inline-flex; width: 100%; padding-bottom: 5px;" v-for='process in processes()'>
            <button
            style="flex-grow: 1; margin-right: 5px; padding-right: 5px;"
            :class="curProcess==process.index?'selected':''"
            @click="(_)=>select(process.id)">
            {{ process.id }}
        </button>
            <button>
                <img class="icon light" 
                src="https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/light/chrome-close.svg">

                <img class="icon dark" 
                src="https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/dark/chrome-close.svg">
            </button>
        </div>
        <button v-if="newProcessName!=''" class="addProcess" @click="addProcess"><b>+</b><i>{{ newProcessName }}</i></button>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';  
import { SpreadBoardEditor } from '../editor/editor';

export default {
    setup(){
        let curProcess = ref(SpreadBoardEditor.getCurProcess());

        const select=(id: string)=>{
            curProcess.value = processes().find((proc)=>proc.id==id)?.index;
            SpreadBoardEditor.instance?.loadProcess(id).then(
                ()=>{
                    curProcess.value = SpreadBoardEditor.getCurProcess();
                }
            );
        };
        let processes=()=>{
            return SpreadBoardEditor.getProcessIDs()?.map((process)=>{return {id: process.id, index: process.index, className : selected(process.index)}});
        };

        const addProcess = (_:any) => {
            SpreadBoardEditor.instance?.addProcess(newProcessName.value.toString());
            newProcessName.value = "";
        }

        let selected = (index: number) => {curProcess.value == index? "selected":""};

        let newProcessName = ref("");
        const change = (event: any) => {newProcessName.value= event.target.value};

        return {
            select,
            processes,
            newProcessName,
            change,
            addProcess,
            selected,
            curProcess
        }
    }
}

</script>

<style scoped>

.selector-bar{
    width: 190px;
    display: flex;
    flex-flow: column;
    max-height: 100%;
    overflow-y: scroll;
    padding: 5px;
}

button{
    padding: 5px;
}

@media (prefers-color-scheme: light) {
    button{
        box-shadow: 1px 2px 1px gray;
    }
}

button.selected{
    border-color: bisque;
}

@media (prefers-color-scheme: light) {
    button.selected{
        border-width: 2px;
        border-color: coral;
    }
}

.addProcess{
    display: flex;
    flex-flow: row;
}
.addProcess > i{
    flex-grow: 1;
}

</style>