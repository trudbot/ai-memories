<script setup>
import Close from './close.vue'
const {data, isAddBtn} = defineProps(['data', 'isAddBtn']);
const emit = defineEmits(['remove']);
</script>

<template>
    <div :class="$style['item']">
        <button
            v-if="!isAddBtn"
            :class="$style['close']"
            @click.stop="emit('remove', data)"
            aria-label="remove"
            title="移除"
        >
            ×
        </button>
        <div v-if="isAddBtn"><Close /></div>
        <span v-else>{{ data?.title || data?.word || 'uname' }}</span>
    </div>
</template>

<style lang="scss" module>
@use "@/mixin.scss" as *;
.item {
    font-size: max(18px, px2vw(18));
    cursor: pointer;
    height: px2vw(117);
    @include flex-center();
    color: white;
    // border-width: 1.01px;
    border-radius: 8.08px;
    position: relative;

    border-image-source: linear-gradient(0deg, #E8E8FF, #E8E8FF),
    linear-gradient(0deg, #475B79, #475B79);
    background-color: #32415280;

}

.close {
    position: absolute;
    top: px2vw(6);
    right: px2vw(6);
    width: px2vw(22);
    height: px2vw(22);
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.1);
    color: #aaa;
    font-size: px2vw(14);
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 160ms ease;

    &:hover {
        background: rgba(0, 0, 0, 0.55);
    }
}
</style>