<template>

<div class="sidebar">
    <button v-for="item in map" @click="(_)=>select(item.key)">{{ item.key }}</button>
</div>

<div :class="isSelected('modules')">
    <ModuleSelector></ModuleSelector>
</div>

</template>

<script lang="ts">
import { ref } from 'vue';
import ModuleSelector from './ModuleSelector.vue';

export default{
    components:{
        ModuleSelector
    },
    setup(){

        const map = [
            {
                key: "modules",
                componentName: "ModuleSelector"
            }
        ]

        const getSelctedComp = () => {
            let key = selected.value;
            if(key == "") return undefined;
            return map.find((item)=>item.key==key)?.componentName;
        }

        const selected = ref("");

        const isSelected = (key: string) => {return key == selected.value ? "selected" : "notSelected"};

        const select = (key: string) => {
            console.log("Select:",key)
            if(selected.value != key)
                selected.value = key;
            else
                selected.value = "";
        }

        return {
            map,
            selected,
            select,
            isSelected,
            getSelctedComp
        }
    }
}

</script>

<style scoped>

div.notSelected{
    width: 0;
    overflow-y: hidden;
}

div.selected{
    width: 10%;
}

.sidebar{
    width: 25px;
    overflow-x: hidden;
    border-right: 1px solid #6f9aea;
}

button{
    writing-mode: sideways-lr;
    padding: 5px;
    width: fit-content;
    border-radius: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

</style>