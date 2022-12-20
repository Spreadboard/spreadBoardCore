<script setup lang="ts">
import ReteEditor from './components/ReteEditor.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div class="editor">
    <SideBar></SideBar>
    <ReteEditor></ReteEditor>
  </div>
  
</template>

<style>
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
  display: flex;
  flex-flow: row;
}
</style>
