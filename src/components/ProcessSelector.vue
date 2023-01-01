<template>
    <div class="selector-bar">
        <div><input type="text" :on-submit="addProcess" :value="newProcessName" @input="change($event)"/></div>
        <button v-for='process in processes()'
            :class="curProcess==process.index?'selected':''"
            @click="(_)=>select(process.id)">
            {{ process.id }}
        </button>
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
            SpreadBoardEditor.instance?.loadProcess(id);
            curProcess.value = SpreadBoardEditor.getCurProcess();
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
    display: flex;
    flex-flow: column;
    margin: 5px;
}

button{
    padding: 5px;
}

button.selected{
    border-color: bisque;
}

.addProcess{
    display: flex;
    flex-flow: row;
}
.addProcess > i{
    flex-grow: 1;
}

</style>