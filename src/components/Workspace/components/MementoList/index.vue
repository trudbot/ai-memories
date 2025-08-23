<script setup>
import InspirationList from './inspiration.vue';
import List from './list.vue';
</script>

<template>
    <div :class="$style['memento-page']">
        <InspirationList />
        <List/>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.memento-page {
  padding-top: 30px;
  padding-left: px2vw(16);
  padding-right: px2vw(178);
}
</style>