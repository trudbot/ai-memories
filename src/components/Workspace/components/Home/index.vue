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
    <Input @send-message="handleSendMessage"/>
    <Theme @themeSelected="handleThemeSelected"/>
</template>