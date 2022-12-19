<template>

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