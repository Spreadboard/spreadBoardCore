<template>
<div class="sidebar">
    <button v-for="item in map" @click="(_)=>select(item.key)" :class="selected==item.key?'selected':''" >
        <Icon :icon="item.icon"></Icon>
    </button>
</div>

<div id="bar" :class="selected!=''?'visible':'hidden'">
</div>

</template>

<script lang="ts">
import { App, createApp, ref } from 'vue';
import ProcessSelector from './ProcessSelector.vue';
import Info from './Info.vue';
import CompiledPreview from './CompiledPreview.vue';
import Icon from './VS-Icon.vue'

export default{
    components:{
        ProcessSelector: ProcessSelector,
        Info: Info,
        Icon: Icon,
        CompiledPreview: CompiledPreview
    },
    setup(){

        const map = [
            {
                key: "processes",
                title: "Prozesse",
                icon:'symbol-interface',
                componentName: ProcessSelector
            },
            {
                key: "code",
                title: "Code",
                icon:'code',
                componentName: CompiledPreview
            },
            {
                key: "info",
                title: "Info",
                icon:'lightbulb',
                componentName: Info
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
            if(selected.value != key)
                selected.value = key;
            else
                selected.value = "";
            console.log("Select:",selected.value);

            (async ()=>{
                let barEl = document.getElementById("bar")!;

                if(curComp)
                        curComp.unmount();
                if(getSelctedComp()!=undefined){
                    let bar = createApp(getSelctedComp()!);
                    curComp = bar;
                    bar.mount("#bar");
            }
            })();        
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

.sidebar:deep() .icon{
    width: 100%;
}

.sidebar{
    padding: 5px;
    padding-right: 0;
    padding-top: 0;
    width: 30px;
    min-width: 30px;
    overflow-x: hidden;
    border-right: 1px solid #6f9aea;
}

button{
    display: flex;
    justify-content: center;
    max-width: 100%;
    width: 100%;
    padding: 2px;
    margin-bottom: 5px;
    border-radius: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-width: 2px;
    border-right-width: 0;
    border-color: #6f9aea;
}


button.selected{
    border-color: bisque;
}

#bar {
    overflow-x: hidden;
}

#bar.visible{
    width: fit-content;
    transition: ease-in-out all 500ms;
}

</style>