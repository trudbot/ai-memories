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
  width: px2vw(242);
  flex-shrink: 0; // 防止缩小
  height: 100%;
}

.main-content {
  @include flex-fill; // 占满剩余宽度
  height: 100%;
  padding-top: 45px;
  padding-left: px2vw(16);
  padding-right: px2vw(88);
  overflow-y: auto; // 允许垂直滚动
}
</style>