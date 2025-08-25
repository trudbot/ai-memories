<script setup>
import Input from './input.vue'
import Theme from './theme.vue';
import { recommandTheme } from '@/agents/recommad-theme/recommand-theme';
import { showFullLoading, hideFullLoading } from '../../../../utils/event-bus';
import { inspiration } from '../../../../data/session-data';
import { useRouter } from 'vue-router';

const router = useRouter();

let isFetching = false;

function handleSendMessage(message) {
    if (isFetching || !message || !message?.length) return;
    console.log('发送的消息:', message);
    isFetching = true;
    showFullLoading('推荐主题和场景词中...');
    recommandTheme(message).then((response) => {
        console.log('推荐的主题和场景词:', response);
        inspiration.value = response.words;
        router.push('/workspace/memento');
    }).catch((error) => {
        console.error('推荐主题失败:', error);
    }).finally(() => {
        console.log('关闭loading')
        isFetching = false;
        hideFullLoading();
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