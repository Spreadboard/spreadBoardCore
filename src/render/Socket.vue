<template>
  <div class="socket" :class="className" :title="socket.name"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { kebab } from "./utils";
export default defineComponent({
  props: ["type", "socket"],
  setup(props) {
    const className = computed(() => {
      return kebab([(props.type as string), (props.socket.name as string)]);
    });
    return {
      className: className
    };
  }
});
</script>

<style lang="scss" scoped>
@import "./vars";

.socket {
  display: inline-block;
  cursor: pointer;
  border: 1px solid white;
  border-radius: calc($socket-size / 2);
  width: $socket-size;
  height: $socket-size;
  margin: $socket-margin;
  vertical-align: middle;
  background: $socket-color;
  z-index: 2;
  box-sizing: border-box;
  &:hover {
    border-width: 4px;
  }
  &.multiple {
    border-color: yellow;
  }
  &.output {
    margin-right: - calc($socket-size / 2);
  }
  &.input {
    margin-left: - calc($socket-size / 2);
  }
}
</style>
