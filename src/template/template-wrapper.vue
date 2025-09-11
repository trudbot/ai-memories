<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

const wrapperEl = useTemplateRef('wrapperEl');
let ro /** @type {ResizeObserver | null} */ = null

const updateRatio = () => {
    const el = wrapperEl.value
    if (!el) return
    const width = el.getBoundingClientRect().width
    if (width > 0) {
        el.style.setProperty('--ratio', String(width / 517))
    }
}

onMounted(() => {
    updateRatio()
    ro = new ResizeObserver(() => updateRatio())
    if (wrapperEl.value) {
        ro.observe(wrapperEl.value)
    }
})

onBeforeUnmount(() => {
    if (ro && wrapperEl.value) ro.unobserve(wrapperEl.value)
    if (ro) ro.disconnect()
    ro = null
})
</script>

<template>
    <div :class="$style['template-wrapper']" ref="wrapperEl" contenteditable="true">
        <slot />
    </div>
</template>

<style lang="scss" module>
.template-wrapper {
    position: relative;
    overflow: hidden;
    aspect-ratio: 517 / 850;
    /* default ratio fallback, will be overridden dynamically */
    --ratio: 1.3;
    width: 100%;
    font-family: PingFang SC;
    outline: none;
    &:focus {
        outline: none;
    }
}

:global(div) {
    background-size: cover;
    background-position: center center;
}

:global(.title) {
    font-size: calc(24px * var(--ratio));
    line-height: 1;
    font-weight: 600;

    :global(highlight) {
        position: relative;
    }

    :global(highlight)::after {
        content: '';
        position: absolute;
        width: 100%;
        aspect-ratio: 68 / 8;
        background-image: url('http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756441418290_Vector%201944.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        top: 100%;
        left: 0;
    }
}

:global(.content) {
    font-weight: 400;
    font-size: calc(16px * var(--ratio));
    line-height: 1.5;
    letter-spacing: 0;

    /* highlight decoration like title, but works for body text */
    :global(highlight) {
        position: relative;
        // display: inline-block;
        color: #FF8234;
    }

    /* italic variants */
    :global(italic),
    :global(em),
    :global(i) {
        font-style: italic;
    }

    /* underline variants */
    :global(underline),
    :global(u) {
        text-decoration-line: underline;
        text-decoration-color: currentColor;
        text-decoration-thickness: calc(2px * var(--ratio));
        text-underline-offset: calc(2px * var(--ratio));
    }

    /* strike/line-through variants */
    :global(strike),
    :global(s),
    :global(del) {
        text-decoration-line: line-through;
        text-decoration-color: rgba(0,0,0,0.5);
        text-decoration-thickness: calc(2px * var(--ratio));
    }
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
