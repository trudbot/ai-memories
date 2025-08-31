<script setup>
import { inspiration } from '../../../../data/session-data';

const emit = defineEmits(['select', 'change']);

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
        <div :class="$style['change']" @click="emit('change')">换一批</div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.inspiration-container {
  position: relative;

  .change {
    position: absolute;
    right: px2vw(30);
    top: calc(100% + 20px);
    color: #00F6FF;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: color 160ms ease, transform 160ms ease, text-shadow 160ms ease, opacity 160ms ease;
    will-change: transform;

    &:hover {
      color: #7FFBFF;
      transform: translateY(-1px);
      text-shadow: 0 0 10px rgba(0, 246, 255, 0.6);
    }

    &:active {
      transform: translateY(0);
      opacity: 0.9;
    }

    &:focus-visible {
      outline: 2px solid rgba(0, 246, 255, 0.8);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
}

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
  // border-width: 1px;

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