<script lang="js" setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div :class="$style['header-container']">
    <div :class="$style['brand']" @click="() => router.push('/')">
        Memory
    </div>
  </div>
</template>

<style module lang="scss">
@use '../../mixin.scss' as *;

.header-container {
  background-color: black;
  height: 100%;
  display: flex;
  align-items: center;
}

.brand {
    width: 112px;
    height: 25px;
    color: white;
    font-family: Abril Fatface;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 14px;
    letter-spacing: 0px;
    margin-left: px2vw(38);
    @include flex-center;
    cursor: pointer;
}
</style>
