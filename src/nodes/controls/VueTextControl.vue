<template>
    <div class="title control">{{ title?(title+ ':'): ''}}</div>
    <input type="text" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""
        @pointerdown.stop="" @pointermove.stop="" />
</template>

<script lang="ts">
import { onMounted } from "vue";

export default {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'title'],
    name: "VueTextComponent",
    data() {
        return {
            value: "",
        }
    },
    methods: {
        change(e: any) {
            this.value = e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter(this.value);
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}
</script>

<style scoped>
.title {
    color: white;
}

input {
    max-width: 120px;
}
</style>