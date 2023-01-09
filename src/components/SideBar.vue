<template>

<div class="sidebar">
    <button v-for="item in map" @click="(_)=>select(item.key)" >
        <img src="/process.svg" class="svg"/>
    </button>
</div>

<div id="bar">
</div>

</template>

<script lang="ts">
import { createApp, ref } from 'vue';
import ProcessSelector from './ProcessSelector.vue';

export default{
    components:{
        ProcessSelector: ProcessSelector
    },
    setup(){

        const map = [
            {
                key: "processes",
                componentName: ProcessSelector
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
            
            let barEl = document.getElementById("bar")!;
            barEl.innerHTML = "";
            if(getSelctedComp()!=undefined){
                let bar = createApp(getSelctedComp()!);
                bar.mount(barEl);
            }
            
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

.sidebar{
    width: 30px;
    overflow-x: hidden;
    border-right: 1px solid #6f9aea;
}

button{
    max-width: 100%;
    width: 100%;
    aspect-ratio: 1;
    padding: 1px;
    border-radius: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.svg {
    width: 100%;
    padding: 0;
    color: white;
}

</style>