<script setup>
import { reactive, ref, nextTick, useTemplateRef, computed } from 'vue';
import Input from '../Home/input.vue';
import Loading from '../Loading/index.vue';
import { useRoute, useRouter } from 'vue-router';
import {memento, theme} from '../../../../data/session-data';
import {createChatAgent} from '../../../../agents/chat/chat'
import {replaceArrayItems} from '../../../../utils/array'
import { summarize } from '../../../../agents/summarize/summarize';
import { hideFullLoading, showFullLoading } from '../../../../utils/event-bus';

const messageListRef = useTemplateRef('messageListRef')
const router = useRouter();
let isFetching = ref(false);
const id = useRoute().params.id;
const currentMemento = computed(() => memento.value.find(item => item.mementoId === id));

// 创建聊天agent
const {sendMessage, getHistory} = createChatAgent({
    theme: theme.value,
    word: currentMemento.value.word,
    // history: currentMemento.value.chatHistory
});

const messages = reactive(currentMemento.value.chatHistory);

console.log('current memento', currentMemento.value);

function scrollToBottom() {
    nextTick(() => {
        if (messageListRef.value) {
            messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
        }
    });
}

function handleSendMessage(message, type='text') {
    console.log('Sending message:', message);
    if (isFetching.value || !message || !message?.length) return;
    isFetching.value = true;
    messages.push({role: 'user', content: message});
    scrollToBottom();
    
    messages.push({role: 'assistant', content: '', loading: true});
    scrollToBottom();
    
    sendMessage({
        type,
        content: message,
    }, chunk => {
        console.log('Received chunk:', chunk);
        messages[messages.length - 1] = {role: 'assistant', content: chunk};
        scrollToBottom();
    }, res => {
        console.log('Received response:', res);
        messages[messages.length - 1] = {role: 'assistant', content: res};
        memento.value = replaceArrayItems(memento.value, item => item.mementoId === id, {
            ...currentMemento.value,
            chatHistory: [...getHistory()]
        });
        isFetching.value = false;
        scrollToBottom();
    });
}

function handleBack() {
    router.back();
}
hideFullLoading();
function handleSummarize() {
    if (isFetching.value) return;
    isFetching.value = true;
    showFullLoading('正在生成回忆碎片');
    const history = getHistory().filter(item => {
        return !Array.isArray(item.content)
    })
    summarize(history).then(res => {
        console.log('Summarization result:', res);
        memento.value = replaceArrayItems(memento.value, item => item.mementoId === id, {
            ...currentMemento.value,
            title: res.title,
            content: res.content
        });
        isFetching.value = false;
        hideFullLoading();
        router.push(`/workspace/memento-edit/${id}`);
    });
}

function handleFileSelect(urls) {
    console.log('选择的文件:', urls);
    memento.value = replaceArrayItems(memento.value, item => item.mementoId === id, {
        ...currentMemento.value,
        images: [...currentMemento.value.images, ...urls]
    });
    handleSendMessage(urls.map(url => ({
        type: 'input_image', 
        image_url: url,
        detail: 'low'
    })), 'image');
}
</script>

<template>
    <div :class="$style['chat-container']">
        <div ref="messageListRef" :class="$style['message-list']">
            <div v-for="(msg, index) in messages" :key="index" :class="msg.role === 'user' ? $style['user-message-item'] : $style['bot-message-item']">
                <div v-if="msg.loading"><Loading/></div>
                <div v-else-if="typeof msg.content === 'string'">{{ msg.content }}</div>
                <div v-else-if="Array.isArray(msg.content)" :class="$style['image-list']">
                    <img
                        v-for="(img, imgIndex) in msg.content"
                        :key="imgIndex"
                        :src="img.image_url"
                        :alt="'Image ' + img.image_url + imgIndex"
                    />
                </div>
            </div>
        </div>
        <div :class="$style['input-area']">
            <Input
                placeholder="和ai聊聊你的故事吧"
                @sendMessage="handleSendMessage"
                @fileSelect="handleFileSelect"
                :ban="isFetching"
                allImageInput
            />
            <div :class="$style['control']">
                <div :class="$style['back']" @click="handleBack">返回</div>
                <div :class="$style['next']" @click="handleSummarize">生成回忆碎片</div>
            </div>
        </div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.message-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: px2vw(30);
    padding: px2vw(20) 0;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.input-area {
    padding-top: px2vw(20);
    padding-bottom: px2vw(30);

    .control {
        margin-top: 41px;
        @include flex(row, space-between, center);
    }

    .back {
        width: 320px;
        height: 39px;
        @include flex-center();
        border-radius: 8px;
        border-width: 1px;
        border: 1px solid #00F6FF;
    }

    .next {
        width: 320px;
        height: 39px;
        border-radius: 8px;
        background: #00F6FF;
        @include flex-center();
        color: black;
    }

    .back, .next {
        cursor: pointer;
    }
}

.user-message-item {
    max-width: 50%;
    align-self: flex-end;
    padding: px2vw(15);
    background: #6F6F6F80;
    border-radius: 8px;
}

.bot-message-item {
    max-width: 50%;
    align-self: flex-start;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: px2vw(10) px2vw(10);
    img {
        width: px2vw(300px);
    }
}
</style>