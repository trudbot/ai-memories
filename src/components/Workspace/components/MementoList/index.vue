<script setup>
import InspirationList from './inspiration.vue';
import List from './list.vue';
import { addDefaultMemento } from '../../../../data/session-data';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleInspirationSelect(item) {
    console.log('Selected inspiration:', item);
    addDefaultMemento(item);
}

function handleAdd() {
  addDefaultMemento('任意');
}

function handleMementoClick(item) {
    console.log('Clicked memento:', item);
    router.push(`/workspace/memento-chat/${item.mementoId}`);
}
</script>

<template>
    <div :class="$style['memento-page']">
        <InspirationList @select="handleInspirationSelect"/>
        <List @add="handleAdd" @mementoClick="handleMementoClick"/>
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