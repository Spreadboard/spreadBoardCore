<template>
    <div>
        <button onclick="selectMain">{{ mainModule() }}</button>
        <button v-for='module in modules()' :on-click="(_)=>select(module.index)">{{ module.id }}</button>
    </div>
</template>
<script lang="ts">
import { SpreadBoardEditor } from '../editor/editor';


export default {
    methods:{
        selectMain(){
            SpreadBoardEditor.instance?.loadMainModule;
        },
        select(index: number){
            SpreadBoardEditor.instance?.loadModule(index);
        },
        mainModule(){
            return SpreadBoardEditor.getMainModuleID();
        },
        modules(){
            return SpreadBoardEditor.getModuleIDs();
        }
    }
}

</script>

<style scoped>
div{
    padding: 5px;
}
</style>