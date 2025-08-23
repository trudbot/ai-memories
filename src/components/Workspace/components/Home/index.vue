<script setup>
import Input from './input.vue'
import Theme from './theme.vue';
import { recommandTheme } from '@/agents/recommad-theme/recommand-theme';

let isFetching = false;

function handleSendMessage(message) {
    if (isFetching || !message || !message?.length) return;
    console.log('发送的消息:', message);
    isFetching = true;
    recommandTheme(message).then((response) => {
        isFetching = false;
        console.log('推荐的主题和场景词:', response);
    }).catch((error) => {
        console.error('推荐主题失败:', error);
    });
}

function handleThemeSelected(theme) {
    handleSendMessage(theme?.name || '');
}
</script>

<template>
    <div :class="$style['workspace-home-container']">
        <Input @send-message="handleSendMessage"/>
        <Theme @themeSelected="handleThemeSelected"/>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;
.workspace-home-container {
  width: 100%;
  padding-top: 45px;
  padding-left: px2vw(16);
  padding-right: px2vw(88);
}
</style>