<template>
    <div class="rete" id="rete">
    </div>
</template>
  
<script lang="ts">
import { SpreadBoardEditor } from '../editor';

async function start(element: HTMLElement){
    element.innerHTML = "";
    SpreadBoardEditor.getOrCreate(element);
}

export default {
    name: "ReteEditor",
    mounted(){
        const element = document.getElementById("rete")
        if(element)
          start(element);
    }
  };
</script>
  
<style>
  .rete {
    flex-grow: 1;
    display: block;
    width: 100% !important;
    height: 100% !important;
    border-left: 1px solid #6f9aea;
    border-top: 1px solid #6f9aea;
    overflow: hidden;
  }
  .socket[title~="act"]{
    background: coral;
  }
  .socket[title~="act"][title~="ref"]{
    background: chocolate;
  }
  .socket[title~="ref"]{
    background: darkmagenta;
  }
  .socket.type{
    background: cornflowerblue;
  }

  div[transform]>.node{
    width: 20px !important;
  }
  </style>
  