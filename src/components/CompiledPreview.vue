<template>
    <div style=" width: fit-content; padding: 5px; margin-left: 0; justify-content: start; text-align: start; overflow-x: auto;">
        <b v-for="line of code">
            {{ line }}
        <br>
        </b>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';

export default defineComponent({
    name: "CompiledPreview",
    setup(){
        const code = computed(()=>{
            let curProc = SpreadBoardEditor.instance?.getCurProcessCode()
            console.log("Test")
            return curProc?.split("\n");
        })

        return {
            code
        }
    }
});

</script>