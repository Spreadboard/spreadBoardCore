<template>
    <div v-if="!hasChildren()" @click="select(command.node_id)"
        :class="(selected?.find((n) => n.id == command.node_id) && !parentSelected) ? 'selectedCommand' : ''"
        v-for="line of (command.commands as string).split('\n')">
        {{ line }}
        <br v-if="line.length > 0 && !(command.commands as string).startsWith(line)">
    </div>
    <div v-if="hasChildren()" v-for="single_command of command.commands"
        :class="(selected?.find((n) => n.id == (single_command as Command).node_id) && !parentSelected) ? 'selectedCommand' : ''">
        <CommandVue :command="single_command"
            :parentSelected="selected?.find((n) => n.id == (single_command as Command).node_id) != undefined || parentSelected">
        </CommandVue>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';
import { Command } from '../nodes/CompilerNode';

export default defineComponent({
    name: 'CommandVue',
    props: {
        command: {
            type: Object,
            required: true
        },
        topLevel: {
            type: Boolean,
            required: false
        },
        parentSelected: {
            type: Boolean,
            required: false
        },
    },
    setup(props) {

        let command: Command = props.command as Command

        let selected = ref(SpreadBoardEditor.instance?.selected.list)

        SpreadBoardEditor.instance?.on('nodeselected', (opt) => {
            selected.value = [];
            selected.value = SpreadBoardEditor.instance?.selected.list;
        });

        const isSelected = () => {

        }

        const select = (id: number) => {
            let node = SpreadBoardEditor.instance?.nodes.find((n) => n.id == id);
            if (node)
                SpreadBoardEditor.instance?.trigger("selectnode", { node: node })
            else SpreadBoardEditor.instance?.unselectNode()
        }

        const hasChildren = () => {
            return typeof (command.commands) != 'string'
        }

        return {
            command,
            selected,
            select,
            hasChildren
        }
    }
})


</script>


<style scoped>
div {
    display: inline;
    z-index: 1;
    padding: 0px;
    transition: box-shadow 250ms ease-in-out;
    box-shadow: 0px 0px 0px coral, 0px 0px 0px, coral;
}
</style>