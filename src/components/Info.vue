<template>
    <div style="width: max-content; padding: 5px; margin: auto;">
        <h2>
            Info
        </h2>

        <a target="_blank" href="https://github.com/Spreadboard/spreadBoardCore">
            <Icon icon="github-inverted"></Icon>
            Source Code
        </a>

        <p></p>

        <a target="_blank" href="https://github.com/Spreadboard/spreadBoardCore#used-software">
            <Icon icon="library"></Icon>
            Used Software
        </a>

        <p></p>

        <a style="display: inline;" title="Coming Soon">
            <Icon icon="book"></Icon>
            Documentation
        </a>

        <p></p>

        <a target="_blank" href="https://opensource.org/licenses/MIT">
            <Icon icon="tag"></Icon>
            License
        </a>

        <p></p>

        <a target="_blank" href="https://github.com/Spreadboard/spreadBoardCore/issues">
            <Icon icon="bug"></Icon>
            Issues
        </a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from './VS-Icon.vue';

export default defineComponent({
    name: "Infor",
    components: {
        Icon: Icon
    }
});

</script>