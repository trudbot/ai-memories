<script lang="js" setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div :class="$style['header-container']">
    <div :class="$style['brand']" @click="() => router.push('/')">
        
    </div>
  </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.header-container {
  background-color: black;
  height: 100%;
  display: flex;
  align-items: center;
}

.brand {
    width: 112px;
    height: 25px;
    background-image: url('http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756375335315_Group%201312318023.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-left: px2vw(38);
    @include flex-center;
    cursor: pointer;
    z-index: 2;
}
</style>
