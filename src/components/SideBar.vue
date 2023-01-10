<template>
<div class="sidebar">
    <button v-for="item in map" @click="(_)=>select(item.key)" :class="selected==item.key?'selected':''" >
        <span class="material-symbols-outlined" :title="item.title">
            {{item.code_point}}
        </span>
    </button>
</div>

<div id="bar">
</div>

</template>

<script lang="ts">
import { App, createApp, ref } from 'vue';
import ProcessSelector from './ProcessSelector.vue';

export default{
    components:{
        ProcessSelector: ProcessSelector
    },
    setup(){

        const map = [
            {
                key: "processes",
                title: "Prozesse",
                code_point:'function',
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

        let curComp: App|undefined;

        const select = (key: string) => {
            console.log("Select:",key)
            if(selected.value != key)
                selected.value = key;
            else
                selected.value = "";
            
            let barEl = document.getElementById("bar")!;
            if(curComp)
                curComp.unmount();
            barEl.innerHTML = "";
            if(getSelctedComp()!=undefined){
                let bar = createApp(getSelctedComp()!);
                curComp = bar;
                bar.mount("#bar");
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
    padding: 5px;
    padding-right: 0;
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
    border-right-width: 0;
    border-color: #6f9aea;
}


button.selected{
    border-color: bisque;
}

@media (prefers-color-scheme: light) {
    button.selected{
        border-width: 2px;
        border-right-width: 0;
        border-color: coral;
    }
}

</style>