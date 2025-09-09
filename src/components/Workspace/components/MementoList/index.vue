<script setup>
import InspirationList from './inspiration.vue';
import List from './list.vue';
import { addDefaultMemento, removeMemento } from '../../../../data/session-data';
import { useRouter } from 'vue-router';
import { showFullLoading, hideFullLoading } from '../../../../utils/event-bus';
import { recommandTheme } from '@/agents/recommad-theme/recommand-theme';
import { userWant, theme, inspiration } from '../../../../data/session-data';

const router = useRouter();

function handleInspirationSelect(item) {
    console.log('Selected inspiration:', item);
    addDefaultMemento(item);
}

function handleAdd() {
  addDefaultMemento({value: '未命名', prompt: ''});
}

function handleMementoClick(item) {
    console.log('Clicked memento:', item);
    router.push(`/workspace/memento-chat/${item.mementoId}`);
}

function handleRemove(item) {
  removeMemento(item);
}

function handleInspirationChange() {
  console.log('灵感推荐变化:', inspiration.value);
  if (userWant.value === '') {
    console.log('用户意图为空，跳转到首页');
    router.push('/workspace/home');
    return;
  }
  showFullLoading('正在为您生成新的灵感...');
  recommandTheme(userWant.value).then((response) => {
      console.log('推荐的主题和场景词:', response);
      inspiration.value = response.words;
      theme.value = response.theme;
  }).catch((error) => {
      console.error('推荐主题失败:', error);
  }).finally(() => {
      hideFullLoading();
  });
  
}
</script>

<template>
    <div :class="$style['memento-page']">
        <InspirationList
          @select="handleInspirationSelect"
          @change="handleInspirationChange"
        />
        <List
          @add="handleAdd"
          @mementoClick="handleMementoClick"
          @remove="handleRemove"
        />
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