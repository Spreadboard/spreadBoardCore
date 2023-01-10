<script setup lang="ts">
import ReteEditor from './components/ReteEditor.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="editor">
    <SideBar></SideBar>
    <ReteEditor></ReteEditor>
  </div>
  
</template>
<style>
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}
body, html, #app{
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 98%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.editor{
  padding: 5px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row;
}
</style>
