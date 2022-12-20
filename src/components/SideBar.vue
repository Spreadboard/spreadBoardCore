<template>

<div>
    <button v-for="item in map" :on-click="(_)=>select(item.key)">{{ item.key }}</button>
</div>

{{selected}}
    
<div v-if="getSelctedComp() != undefined">
    <component v-bind:is="getSelctedComp()"></component>
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
                component: ModuleSelector
            }
        ]

        const getSelctedComp = () => {
            let key = selected.value;
            if(key == "") return undefined;
            return map.find((item)=>item.key==key)?.component?.name;
        }

        const selected = ref("");

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
            getSelctedComp
        }
    }
}

</script>