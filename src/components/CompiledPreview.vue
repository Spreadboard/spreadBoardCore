<template>
    <div v-if="!timeOut" id="compiledPreview" style="padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of code" :class="selected?.find((n)=>n.id==command.node_id)?'selectedCommand':''">
            <CommandVue :command="command" :top-level="true" :parentSelected="selected?.find((n)=>n.id==command.node_id)!=undefined"></CommandVue>
        </p>
    </div>
    <div v-if="timeOut" id="compiledPreview" style="padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of pCode" :class="selected?.find((n)=>n.id==command.node_id)?'selectedCommand':''">
            <CommandVue :command="command" :top-level="true" :parentSelected="selected?.find((n)=>n.id==command.node_id)!=undefined"></CommandVue>
        </p>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';
import Command from './Command.vue';

export default defineComponent({
    name: "CompiledPreview",
    components: {
        CommandVue: Command
    },
    setup(){
        let code = ref(SpreadBoardEditor.instance?.getCurProcessCode())
        let pCode = ref(SpreadBoardEditor.instance?.getCurProcessCode())

        let timeOut = ref(false);

        SpreadBoardEditor.instance?.on('export', ()=>{
            if(!timeOut.value){
                timeOut.value = true;
                pCode.value = code.value;
                code.value = [];
                new Promise((resolve)=>setTimeout(resolve,100)).then(()=>{
                    let co = SpreadBoardEditor.instance?.getCurProcessCode()
                    code.value = co;
                    timeOut.value = false;
                })

            }
        });

        let selected = ref(SpreadBoardEditor.instance?.selected.list)

        SpreadBoardEditor.instance?.on('nodeselected', (opt)=>{
            selected.value = [];
            selected.value = SpreadBoardEditor.instance?.selected.list;
        });

        const select = (id: number)=>{
            let node = SpreadBoardEditor.instance?.nodes.find((n)=>n.id==id);
            if(node)
                SpreadBoardEditor.instance?.trigger("selectnode", {node:node})
            else SpreadBoardEditor.instance?.unselectNode()
        }

        console.log(code)

        return {
            code,
            selected,
            select,
            timeOut,
            pCode
        }
    }
});

</script>

<style>
p{
    z-index: 0;
    padding: 5px;
    transition: box-shadow 250ms ease-in-out;
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;
}
.selectedCommand{
    border-style: hidden;
    border-width: 2px;
    border-radius: 5px;
    box-shadow: 1px 1px 3px coral, -1px -1px 3px coral;
}

.selectedCommand .selectedCommand{
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;
}
</style>