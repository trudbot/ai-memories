<script setup>
import Sidebar from './components/SIdebar/index.vue';
</script>
<template>
    <div :class="$style['workspace-container']">
        <div :class="$style['sidebar']">
            <Sidebar />
        </div>
        <div :class="$style['main-content']">
            <RouterView />
        </div>
    </div>
    <img
    :class="$style['background-image']"
      src="https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/e1407b922162bf5db9bff230530c6d70d467b1ce.png"
    />
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.workspace-container {
  height: 100%;
  width: 100%;
  background-color: black;
  position: relative;
  @include flex-row;
}

.sidebar {
  z-index: 2;
  width: px2vw(242);
  flex-shrink: 0; // 防止缩小
  height: 100%;
}

.main-content {
  z-index: 2;
  @include flex-fill; // 占满剩余宽度
  height: 100%;
  padding-top: 45px;
  padding-left: px2vw(16);
  padding-right: px2vw(88);
  overflow-y: auto; // 允许垂直滚动
}

.background-image {
  position: fixed;
  z-index: 1;
  width: px2vw(1332.47);
  top: px2vw(-545);
  left: px2vw(-152.97);
  transform-origin: center center;
  transform: rotate(90deg);
  opacity: 1;
}
</style>