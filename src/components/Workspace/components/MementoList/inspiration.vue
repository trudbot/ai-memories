<script setup>
import { ref } from 'vue';

const inspirations = ref([
    '灵感推荐1',
    '灵感推荐2',
    '灵感推荐3',
    '灵感推荐4',
    '灵感推荐5',
    '灵感推荐6',
    '灵感推荐7',
    '灵感推荐8',
    '灵感推荐9',
    '灵感推荐10',
    '灵感推荐11',
    '灵感推荐12',
]);
</script>

<template>
    <div :class="$style['inspiration-container']">
        <div :class="$style['title']">
            灵感推荐
        </div>
        <div :class="$style['inspiration-list']">
            <div :class="$style['inspiration-item']" v-for="(item, index) in inspirations" :key="index">
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

  display: grid;
//   display: flex;
//   flex-wrap: wrap;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px 20px; /* 15px vertical, 20px horizontal */
}

.inspiration-item {
  cursor: pointer;
//   width: var(--item-width);
  height: px2vw(60);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border-width: 1px;
//   border-color: linear-gradient(0deg, #E8E8FF, #E8E8FF),
//     linear-gradient(0deg, #475B79, #475B79);

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