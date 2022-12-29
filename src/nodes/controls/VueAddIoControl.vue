<template>
{{ description }}
<div>
    <input type="text"
        class="titleInput"
         :value="title"
         @input="changeTitle($event)"
         @dblclick.stop=""
         @pointerdown.stop=""
         @pointermove.stop=""/>

</div>
<div class="input">
    <select name="drop_select"
        class="typeInput"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop="">
        <option v-for="(option, index) in types()" 
            @change="changeType(index)"
            :value="index">
            {{ option.name }}
        </option>
    </select>
    <select name="input_output_select"
        class="ioInput"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop="">
        <option>
            Input
        </option>
        <option>
            Output
        </option>
    </select>
    <input type="button" value="+" @pointerdown="emit()"/>
</div>

</template>

<script lang="ts">
import { Socket } from 'rete';
import { defineComponent , ref} from 'vue';
import { SocketType, SocketTypes } from '../../editor/sockets';

export default defineComponent({
    props:{
        input: Boolean,
        emitter: Function,
        description: String
    },
    setup({input, emitter, description}){
        const title = ref('');
        const type = ref(SocketTypes.anySocket);

        const changeTitle = (e: Event)=>{
            //@ts-ignore
            title.value = e.target?.value??'';
        };

        const changeType = (index: number)=>{
            let val = types()[index];
            type.value = val??SocketTypes.anySocket;
        };

        const curIndex=()=>types().indexOf(type.value);

        const types = ()=>SocketTypes.typeList();

        const emit=()=>{
            console.log(title.value,type.value)
            emitter!(title.value,type.value);
        };

        return {
            title,
            type,
            changeTitle,
            changeType,
            types,
            curIndex,
            emit
        }
    }
})

</script>

<style scoped>
.input{
    display: inline-block;
    max-width: 120px;
}
.titleInput{
    max-width: 110px;
}
</style>