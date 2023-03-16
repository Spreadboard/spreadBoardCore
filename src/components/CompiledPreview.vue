<template>
    <div v-if="!timeOut" id="compiledPreview"
        style="padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of code" :class="selected?.find((n) => n.id == command.node_id) ? 'selectedCommand' : ''">
            <CommandVue :command="command" :top-level="true"
                :parentSelected="selected?.find((n) => n.id == command.node_id) != undefined"></CommandVue>
        </p>
    </div>
    <div v-if="timeOut" id="compiledPreview"
        style="padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of pCode" :class="selected?.find((n) => n.id == command.node_id) ? 'selectedCommand' : ''">
            <CommandVue :command="command" :top-level="true"
                :parentSelected="selected?.find((n) => n.id == command.node_id) != undefined"></CommandVue>
        </p>
    </div>
</template>

<script lang="ts">
import { NodeData } from 'rete/types/core/data';
import { ref, defineComponent } from 'vue';
import EditorManager from '../manager/EditorManager';
import Command from './Command.vue';

export default defineComponent({
    name: "CompiledPreview",
    components: {
        CommandVue: Command
    },
    setup() {
        let id = EditorManager.getInstance()?.getSelected()!;
        let prev = EditorManager.getInstance()?.getProcessor()?.getProcessPreview(id)!;
        let code = ref(prev);
        let pCode = ref(prev);

        let timeOut = ref(false);

        EditorManager.getInstance()?.onCompiled((processCommand) => {
            if (!timeOut.value) {
                timeOut.value = true;
                pCode.value = code.value;
                code.value = [];
                new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
                    let co = EditorManager.getInstance()?.getProcessor()?.getProcessPreview(id)!;
                    code.value = co;
                    timeOut.value = false;
                })

            }
        })

        let selected = ref([] as NodeData[])

        /* SpreadBoardEditor.instance?.on('nodeselected', (opt) => {
            selected.value = [];
            selected.value = SpreadBoardEditor.instance?.selected.list;
        }); */

        const select = (id: number) => {
            /* let node = SpreadBoardEditor.instance?.nodes.find((n) => n.id == id);
            if (node)
                SpreadBoardEditor.instance?.trigger("selectnode", { node: node })
            else SpreadBoardEditor.instance?.unselectNode() */
        }


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
p {
    z-index: 0;
    padding: 5px;
    transition: box-shadow 250ms ease-in-out;
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;
}

.selectedCommand {
    border-style: hidden;
    border-width: 2px;
    border-radius: 5px;
    box-shadow: 1px 1px 3px coral, -1px -1px 3px coral;
}

.selectedCommand .selectedCommand {
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;
}
</style>