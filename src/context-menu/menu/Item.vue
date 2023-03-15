<template>
    <div @click="onClick" @mouseover="showSubitems" @mouseleave="timeoutHide" class="item" :class="{ hasSubitems }">
        {{ item!.title }}
        <div v-if="hasSubitems && visibleSubitems" class="subitems">
            <Item v-for="subitem in item!.subitems" :key="subitem.title" :item="subitem" :delay="delay"
                @hide="$emit('hide')" @click="subitemClicked">
            </Item>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from "vue";
import EditorManager from "../../manager/EditorManager";

export default defineComponent({
    props: {
        item: Object,
        args: Object,
        delay: { type: Number, required: true }
    },
    emits: ["hide", "click"],
    setup(props, { emit }) {
        let timeoutHide = () => {
            hideSubitems();
        };
        const visibleSubitems = ref(false);
        const hasSubitems = computed(() => {
            //@ts-ignore
            return props.item.subitems
        });
        const cancelHide = () => {
            const hide = timeoutHide;
            //@ts-ignore
            if (hide && hide.cancel)
                //@ts-ignore
                timeoutHide.cancel();
        }
        const showSubitems = () => {
            visibleSubitems.value = true;
            cancelHide();
        };
        const hideSubitems = () => {
            visibleSubitems.value = false;
        }
        const onClick = (e: any) => {
            e.stopPropagation();
            emit('click', props.item)
            emit('hide');
        }

        const subitemClicked = (subitem: any) => {
            emit('click', subitem)
        }

        return {
            onClick,
            showSubitems,
            timeoutHide,
            hasSubitems,
            visibleSubitems,
            subitemClicked
        }
    }
})
</script>


<style lang="scss" scoped>
@import 'src/context-menu/vars';
@import 'src/context-menu/common';

.item {
    @extend .item;

    &.hasSubitems:after {
        content: '►';
        position: absolute;
        opacity: 0.6;
        right: 5px;
        top: 5px;
    }

    .subitems {
        position: absolute;
        top: 0;
        left: 100%;
        width: $width;

        .subitem {
            @extend .item;
        }
    }
}
</style>
