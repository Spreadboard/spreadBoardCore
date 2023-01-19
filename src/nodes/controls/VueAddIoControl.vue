<template>
    {{ description }}
    <div>
        <input type="text" class="titleInput" :value="title" @input="changeTitle($event)" @dblclick.stop=""
            @pointerdown.stop="" @pointermove.stop="" />

    </div>
    <div class="input">
        <select name="drop_select" class="typeInput" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""
            @change="changeType(typeIndex)" v-model="typeIndex">
            <option v-for="(option, index) in types()" :value="index">
                {{ option.name }}
            </option>
        </select>
        <select name="input_output_select" class="ioInput" @dblclick.stop="" @pointerdown.stop="" v-model="dir"
            @pointermove.stop="">
            <option v-for="option in [false, true]" :value="option">
                {{ option?'Output': 'Input' }}
            </option>
        </select>
        <input type="button" value="+" @pointerdown="emit()" />
    </div>

</template>

<script lang="ts">
import { Socket } from 'rete';
import { defineComponent, ref, toRaw } from 'vue';
import { SocketType, SocketTypes } from '../../processor/connections/sockets';

export default defineComponent({
    props: {
        emitter: Function,
        description: String
    },
    data() {
        return {
            typeIndex: 0
        }
    },
    setup({ emitter, description }) {
        const title = ref('');
        const type = ref(SocketTypes.anySocket);
        const dir = ref(false);

        const changeTitle = (e: Event) => {
            //@ts-ignore
            title.value = e.target?.value ?? '';
        };

        const changeType = (index: number) => {
            let val = types()[index];
            type.value = val ?? SocketTypes.anySocket;
        };

        const changeDir = (newDir: boolean) => {
            console.log(newDir);
            dir.value = newDir;
        };

        const curIndex = () => types().indexOf(type.value);

        const types = () => SocketTypes.typeList();

        const emit = () => {
            console.log(title.value, toRaw(type.value), dir.value)
            emitter!(title.value, toRaw(type.value), dir.value);
        };

        return {
            title,
            type,
            changeTitle,
            changeDir,
            changeType,
            types,
            curIndex,
            emit,
            dir
        }
    }
})

</script>

<style scoped>
.input {
    display: inline-block;
    max-width: 120px;
}

.titleInput {
    max-width: 110px;
}
</style>