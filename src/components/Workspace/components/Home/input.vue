<script setup>
import VoiceIcon from './icons/voice.vue';
import SendIcon from './icons/send.vue';
</script>
<template>
    <div :class="$style['input-wrapper']">
        <textarea :class="$style['input-box']" placeholder="讲一讲你想录入的主题，开始制作你的专属回忆吧～"></textarea>
        <div :class="$style['functions']">
            <div :class="$style['voice-input']"><VoiceIcon /></div>
            <div :class="$style['send']"><SendIcon /></div>
        </div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.input-wrapper {
  position: relative;
  width: 100%;
  height: 188px;
  border: 1px solid #475B79;
  border-radius: 16px;
  background: linear-gradient(90deg, #2B3850 0%, #1C212B 100%);
  padding: 25px 33px 20px 33px;
}

.input-box {
    width: 100%;
    height: calc(100% - 32px);
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    color: white;
    font-size: 16px;
    line-height: 1.5;
    font-family: PingFang SC;
    font-size: 16px;
    
    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
}

.functions {
    position: absolute;
    right: 44px;
    bottom: 20px;
    @include flex(row, flex-start, center);

    .send {
        margin-left: 23px;
    }
}
</style>