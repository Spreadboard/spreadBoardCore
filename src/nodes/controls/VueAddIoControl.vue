<template>

<div class="input">
    <input type="text"
         :value="title"
         @input="changeTitle($event)"
         @dblclick.stop=""
         @pointerdown.stop=""
         @pointermove.stop=""/>
    <select name="drop_select"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop="" 
        v-model="type.name">
        <option v-for="(option, index) in types()" 
            @change="changeType(index)"
            :value="index">
            {{ option }}
        </option>
</select>
        
</div>

</template>

<script lang="ts">
import { defineComponent , ref} from 'vue';
import { SocketType, SocketTypes } from '../../editor/sockets';

export default defineComponent({
    setup(_){
        const title = ref('');
        const type = ref(SocketTypes.anySocket);

        const changeTitle = (e: Event)=>{
            //@ts-ignore
            title.value = e.target?.value??'';
        };

        const changeType = (index: number)=>{
            let val = types()[index];
            type.value = SocketTypes.get(val!)?.valSocket??SocketTypes.anySocket;

        };

        const types = ()=>SocketTypes.typeList();

        return {
            title,
            type,
            changeTitle,
            changeType,
            types,
        }
    }
})

</script>

<style scoped>
.input{
    display: inline-block;

}

</style>