<script setup>
import { reactive, ref, nextTick, useTemplateRef } from 'vue';
import Input from '../Home/input.vue';
import Loading from '../Loading/index.vue';

const messageListRef = useTemplateRef('messageListRef')

const messages = reactive([
    {type: 'assistant', content: '心动的瞬间常常让人记忆深刻，你能展开给我讲讲么？你们当时是在哪儿？在做什么？'},
    {type: 'user', content: '我们在咖啡馆见面，她穿着一件红色的连衣裙，阳光透过窗户洒在她的头发上，显得格外耀眼。'},
    {type: 'assistant', content: '有哪些留下来的东西呢？比如照片，聊天截图……'},
]);

let isFetching = ref(false);

function scrollToBottom() {
    nextTick(() => {
        if (messageListRef.value) {
            messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
        }
    });
}

function handleSendMessage(message) {
    if (isFetching.value || !message || !message?.length) return;
    isFetching.value = true;
    messages.push({type: 'user', content: message});
    scrollToBottom();
    
    // 模拟AI回复
    const res = "谢谢你分享这个美好的瞬间！";
    messages.push({type: 'assistant', content: '', loading: true});
    scrollToBottom();
    
    setTimeout(() => {
        messages[messages.length - 1] = {type: 'assistant', content: res};
        isFetching.value = false;
        scrollToBottom();
    }, 2000);
}
</script>


<template>
    <div :class="$style['chat-container']">
        <div ref="messageListRef" :class="$style['message-list']">
            <div v-for="(msg, index) in messages" :key="index" :class="msg.type === 'user' ? $style['user-message-item'] : $style['bot-message-item']">
                <div v-if="msg.loading"><Loading/></div>
                <div v-else>{{ msg.content }}</div>
            </div>
        </div>
        <div :class="$style['input-area']">
            <Input
                placeholder="和ai聊聊你的故事吧"
                @sendMessage="handleSendMessage"
            />
            <div :class="$style['control']">
                <div :class="$style['back']">返回</div>
                <div :class="$style['next']">生成记忆碎片</div>
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
    padding: px2vw(10);
    background: #6F6F6F80;
    border-radius: 8px;
}

.bot-message-item {
    max-width: 50%;
    align-self: flex-start;
}


</style>