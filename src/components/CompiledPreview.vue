<template>
    <div style=" width: fit-content; padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <p v-for="command of code">
            <b v-for="line of command.command_string.split('\n')">{{ line }}<br></b>
        </p>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';

export default defineComponent({
    name: "CompiledPreview",
    setup(){
        const code = computed(()=>{
            let curProc = SpreadBoardEditor.instance?.getCurProcessCode();
            return curProc;
        })

        return {
            code
        }
    }
});

</script>