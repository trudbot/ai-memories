<script setup>
import Close from './close.vue'
const {data, isAddBtn} = defineProps(['data', 'isAddBtn']);
</script>

<template>
    <div :class="$style['item']">
        <div v-if="isAddBtn"><Close /></div>
        <span v-else>{{ data?.title || 'uname' }}</span>
    </div>
</template>

<style lang="scss" module>
@use "@/mixin.scss" as *;
.item {
    height: px2vw(117);
    @include flex-center();
    color: white;
    border-width: 1.01px;
    border-radius: 8.08px;

    border-image-source: linear-gradient(0deg, #E8E8FF, #E8E8FF),
    linear-gradient(0deg, #475B79, #475B79);
    background-color: #32415280;

}
</style>