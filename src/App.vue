<script lang="js" setup>
import Header from './components/Header/index.vue';

</script>

<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <Header />
    </div>
    <div :class="$style.main">
      <RouterView />
    </div>
  </div>
</template>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; // full viewport height
  width: 100vw;  // full viewport width
}

.header {
  flex: 0 0 63px; // fixed header height
  // height: 56px; // optional explicit height
}

.main {
  flex: 1 1 auto; // take remaining space
  min-height: 0;  // allow flex item to shrink for scroll containers
  overflow: auto; // scroll main content when overflow
}
</style>