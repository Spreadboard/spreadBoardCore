<template>
    <div class="selector-bar">
        <div><input type="text" :on-submit="addModule" :value="newModuleName" @input="change($event)"/></div>
        <button v-for='module in modules()'
            :class="curModule==module.index?'selected':''"
            @click="(_)=>select(module.id)">
            {{ module.id }}
        </button>
        <button v-if="newModuleName!=''" class="addModule" @click="addModule"><b>+</b><i>{{ newModuleName }}</i></button>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';  
import { SpreadBoardEditor } from '../editor/editor';
import { computed} from '@vue/reactivity';

export default {
    setup(){
        let curModule = ref(SpreadBoardEditor.getCurModule());

        const select=(id: string)=>{
            SpreadBoardEditor.instance?.loadModule(id);
            curModule.value = SpreadBoardEditor.getCurModule();
        };
        let modules=()=>{
            return SpreadBoardEditor.getModuleIDs()?.map((module)=>{return {id: module.id, index: module.index, className : selected(module.index)}});
        };  

        const addModule = (_:any) => {
            SpreadBoardEditor.instance?.addModule(newModuleName.value.toString());
            newModuleName.value = "";
        }

        let selected = (index: number) => {curModule.value == index? "selected":""};

        let newModuleName = ref("");
        const change = (event: any) => {newModuleName.value= event.target.value};

        return {
            select,
            modules,
            newModuleName,
            change,
            addModule,
            selected,
            curModule
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

.addModule{
    display: flex;
    flex-flow: row;
}
.addModule > i{
    flex-grow: 1;
}

</style>