<script setup>
import { ref } from 'vue';
import { inspiration } from '../../../../data/session-data';

const emit = defineEmits(['select']);

function selectInspiration(item) {
    console.log('selected inspiration:', item);
    emit('select', item);
}
</script>

<template>
    <div :class="$style['inspiration-container']">
        <div :class="$style['title']">
            灵感推荐
        </div>
        <div :class="$style['inspiration-list']">
            <div :class="$style['inspiration-item']" v-for="(item, index) in inspiration" :key="index" @click="selectInspiration(item)">
                <span>{{ item }}</span>
            </div>
        </div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.title {
  font-size: 18px;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 12px;
  color: white;
}

.inspiration-list {
  --item-width: 150px;

  display: flex;
  flex-wrap: wrap;
//   display: flex;
//   flex-wrap: wrap;
  // grid-template-columns: repeat(6, 1fr);
  gap: 15px 20px; /* 15px vertical, 20px horizontal */
}

.inspiration-item {
  padding: max(10px, px2vw(12));
  min-width: max(150px, px2vw(150));
  cursor: pointer;
//   width: var(--item-width);
  height: max(60px, px2vw(60));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border-width: 1px;

  font-size: 14px;
  background: #32415280;

  span {
    background: 
        linear-gradient(270deg, #79D5FF 0%, #A4F6FF 39.29%, #F4FF7B 78.57%);

      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
  }
}
</style>