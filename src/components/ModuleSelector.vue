<template>
    <div>
        <button @click="selectMain" class="main-selector">{{ mainModule() }}</button>
        <button v-for='module in modules()' 
            :on-click="(_)=>select(module.index)">
            {{ module.id }}
        </button>
    </div>
</template>

<script lang="ts">
import { SpreadBoardEditor } from '../editor/editor';


export default {
    setup(){

        const selectMain = (event: MouseEvent)=>{
            SpreadBoardEditor.instance?.loadMainModule;
        };
        const select=(index: number)=>{
            SpreadBoardEditor.instance?.loadModule(index);
        };
        const mainModule=()=>{
            let name= SpreadBoardEditor.getMainModuleID();
            return name?.slice(0,name.length-6);
        };
        const modules=()=>{
            return SpreadBoardEditor.getModuleIDs();
        };

        return {
            selectMain,
            select,
            mainModule,
            modules
        }
    }
}

</script>

<style scoped>

div{
    padding: 5px;
}
</style>