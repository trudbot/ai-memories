<script setup>
import Chat from '../Chat/index.vue';
</script>

<template>
    <div :class="$style['memento-chat-container']">
        <Chat />
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;
.memento-chat-container {
    height: 100%;
    padding-left: px2vw(16);
    padding-right: px2vw(88);
}
</style>