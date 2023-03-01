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

export default defineComponent({
    name: "Logs",
    setup(props) {
        let logs = ref('');
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