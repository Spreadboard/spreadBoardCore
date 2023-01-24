<template>

    <div class="logs" id="logs">
        <div class="log-item" v-for="line of logs?.split('\n')">
            {{ line }}
            <br>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { SpreadBoardEditor } from '../editor/editor';

export default defineComponent({
    name: "Logs",
    setup(props) {
        const logger = SpreadBoardEditor.instance?.logger;
        let logs = ref(logger?.export());
        logger?.onWrite(
            (item) => {
                logs.value = logger?.export();

                new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
                    let logEl = document.getElementById('logs')
                    logEl?.scrollBy({ top: logEl?.scrollTop * 10 })
                })
            }
        )
        return { logs };
    }
})

</script>

<style scoped>
.logs {
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
    text-align: start;
    max-width: 400px;
    max-height: 98%;
}

.log-item {
    border-color: rgba(141, 141, 141, 0.514);
    border-style: solid;
    border-width: 0px;
    border-bottom-width: 1px;
    line-break: anywhere;
    padding-right: 5px;
}
</style>