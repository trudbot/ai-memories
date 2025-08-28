<script setup>
</script>

<template>
    <div :class="$style['template-wrapper']" contenteditable="true">
        <slot />
    </div>
</template>

<style lang="scss" module>
.template-wrapper {
    position: relative;
    overflow: hidden;
    aspect-ratio: 517 / 850;
    --ratio: 1.3;
    width: calc(var(--ratio) * 517px);
    font-family: PingFang SC;
}

:global(.title) {
    font-size: calc(24px * var(--ratio));
    line-height: 1;
    font-weight: 600;
}

:global(.content) {
    font-weight: 400;
    font-size: calc(16px * var(--ratio));
    line-height: 1.5;
    letter-spacing: 0;
}

:global(.full-cover-bg) {
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
</style>
<!-- 
<style lang="scss" scoped>
.title {
    font-size: calc(24px * var(--ratio));
    line-height: 1;
    font-weight: 600;
}

.content {
    font-weight: 400;
    font-size: calc(16px * var(--ratio));
    line-height: 1.5;
    letter-spacing: 0;
}

.full-cover-bg {
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
</style> -->
