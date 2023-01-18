<template>
    <img style="min-height:25px ;" v-for="theme in ['light', 'dark']" :class="['icon', theme]"
        :src='"https://raw.githubusercontent.com/microsoft/vscode-icons/master/icons/"+
        theme+"/"+
        ((icon && icon!="")?icon:"error")
        +".svg"'>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name:"Icon",
    props: {icon:String},
});

</script>