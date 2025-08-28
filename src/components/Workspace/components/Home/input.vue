<script setup>
import VoiceIcon from './icons/voice.vue';
import VoiceActiveIcon from './icons/voice-active.vue';
import SendIcon from './icons/send.vue';
import ImageIcon from './icons/image.vue';
import { ref, useTemplateRef } from 'vue';
import { hideFullLoading, showFullLoading } from '../../../../utils/event-bus';
import { convertImagesToBase64 } from '../../../../utils/upload';
import { createVoiceInput } from '../../../../utils/voice-input';

const text = ref('');
const fileInputRef = useTemplateRef('fileInputRef');
const {start, onResult, onError} = createVoiceInput();

// 向上层发生消息事件
const emitter = defineEmits(['sendMessage', 'fileSelect']);
const {placeholder, ban, allImageInput} = defineProps({
    placeholder: {
        type: String,
        default: '讲一讲你想录入的主题，开始制作你的专属回忆吧～'
    },
    ban: {
        type: Boolean,
        default: false
    },
    allImageInput: {
        type: Boolean,
        default: false
    }
});

function handleSend() {
    if (ban) return;
    if (text.value.trim()) {
        // 处理发送逻辑
        console.log('发送内容:', text.value);
        emitter('sendMessage', text.value);
        text.value = ''; // 清空输入框
    }
}

// 触发文件选择
function triggerFileInput() {
    fileInputRef.value?.click();
}

// 处理文件选择完成
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    showFullLoading('正在上传图片');
    console.log('选择的文件:', files);
    try {
        convertImagesToBase64(files).then(urls => {
            console.log('上传成功:', urls);
            setTimeout(() => {
                hideFullLoading();
                emitter('fileSelect', urls);
            }, 3000);
        }).catch(err => {
            hideFullLoading();
            console.error('上传失败:', err);
        })
    } catch (err) {
        hideFullLoading();
    }
    // 清空 input 的值，这样能够选择同一个文件时也能触发 change 事件
    event.target.value = '';
}

const voicing = ref(false);

function handleVoiceInput() {
    voicing.value = true;
    start();
    onResult((transcript) => {
        voicing.value = false;
        text.value = transcript;
    });
    onError((error) => {
        voicing.value = false;
        console.error("语音识别错误：", error);
    });
}

</script>
<template>
    <div :class="$style['input-wrapper']">
        <textarea
            :class="$style['input-box']"
            :placeholder="placeholder"
            v-model="text"
        ></textarea>
        <div :class="$style['functions']">
            <div v-if="allImageInput" :class="$style['image-input']" @click="triggerFileInput"><ImageIcon /></div>
            <div 
                :class="[$style['voice-input'], voicing ? $style['voicing'] : '']" 
                @click="handleVoiceInput"
            >
                <VoiceIcon v-if="!voicing" />
                <VoiceActiveIcon v-else class="active-icon" />
            </div>
            <div :class="$style['send']" @click="handleSend"><SendIcon /></div>
        </div>
    </div>
    <input 
        type="file" 
        accept="image/*" 
        multiple 
        ref="fileInputRef"
        @change="handleFileSelect"
        v-show="false"
    />
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
  z-index: 3;
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

    .send, .voice-input {
        margin-left: 20px;
        cursor: pointer;
    }

    .image-input {
        transform: translateY(5px);
    }

    .voice-input {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        
        &.voicing {
            color: #00F6FF;
            :deep(.active-icon) {
                animation: pulse 2s infinite;
            }
        }
    }

    @keyframes pulse {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
}
</style>