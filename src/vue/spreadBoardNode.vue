<template lang="pug">
.node(:class="[selected(), node.name ] | kebab")
    .title {{node.i18nKeys && editor.i18n ? editor.i18n(node.i18nKeys) : node.name}}

    // Outputs
    .output(v-for='output in outputs()' :key="output.key")
        .output-title {{output.name}}
        Socket(v-socket:output="output", type="output", :socket="output.socket")
    
    // Controls
    .control(
        v-for='control in controls()',
        :key="control.key",
        v-control="control"
    )
    
    // Inputs
    .input(v-for='input in inputs()' :key="input.key")
        Socket(v-socket:input="input", type="input", :socket="input.socket")
        .input-title(v-show='!input.showControl()') {{input.name}}
        .input-control(
            v-show='input.showControl()'
            v-control="input.control"
        )
</template>

<script  lang="ts">

import mixin from './mixins';
import Socket from './spreadBoardSocket.vue';
export default {
  name: 'SpreadBoardNode',
  mixins: [mixin],
  props:[],
  components: {
    Socket
  }
};

</script>

<style scoped>

</style>