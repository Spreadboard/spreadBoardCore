<template>
    <div style=" width: fit-content; padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of code" @click="select(command.node_id)" :class="selected?.find((n)=>command.node_id==n.id)?'selected':''">
            <b v-for="line of command.command_string.split('\n')">{{ line }}<br></b>
        </p>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';

export default defineComponent({
    name: "CompiledPreview",
    setup(){
        let code = ref(SpreadBoardEditor.instance?.getCurProcessCode())

        SpreadBoardEditor.instance?.on('process', ()=>{
            code.value = SpreadBoardEditor.instance?.getCurProcessCode();
        });

        let selected = ref(SpreadBoardEditor.instance?.selected.list)

        SpreadBoardEditor.instance?.on('nodeselected', (opt)=>{
            selected.value = [];
            selected.value = SpreadBoardEditor.instance?.selected.list;
            console.log(selected.value)
        });

        const select = (id: number)=>{
            let node = SpreadBoardEditor.instance?.nodes.find((n)=>n.id==id);
            if(node)
                SpreadBoardEditor.instance?.trigger("selectnode", {node:node})
            else SpreadBoardEditor.instance?.unselectNode()
        }

        return {
            code,
            selected,
            select
        }
    }
});

</script>

<style scoped>
p{
    padding: 5px;
    transition: box-shadow 250ms ease-in-out;
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;

}
.selected{
    border-style: hidden;
    border-width: 2px;
    border-radius: 5px;
    box-shadow: 2px 2px 5px coral, -2px -2px 5px coral;
}
</style>