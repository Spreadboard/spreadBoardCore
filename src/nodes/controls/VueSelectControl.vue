<template>
  <div class="control title">{{title?(title+':'):''}}</div>
  <select name="drop_select"
  
    @dblclick.stop=""
    @pointerdown.stop=""
    @pointermove.stop=""
    @change="update()"
    v-model="value">
      <option v-if="value == -1" value="-1" style="color: red;">Error</option>
      <option v-for="(option, index) in options"
        :value="option">
          {{ option }}
      </option>
  </select>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    readonly: Boolean,
    emitter:Function, 
    ikey:String, 
    getData:Function, 
    putData:Function, 
    title:String,
    options:Array<String>
  },
  name: "VueSelectComponent",
  data() {
    return {
      value: 0,
    }
  },
  methods: {
    change(index: number){
      this.value = index;
      this.update();
    },
    update() {
      if (this.ikey)
        this.putData!(this.ikey, this.value);
      this.emitter!(this.value);
    },
  },
  mounted() {
    this.value = this.getData!(this.ikey) ?? 0;
  }
});
</script>

<style scoped>
.title{
  color: white;
}
input{
  max-width: 120px;
}
</style>