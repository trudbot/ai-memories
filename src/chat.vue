<script setup lang="ts">
import { UserOutlined, RobotOutlined } from '@ant-design/icons-vue';
import { Bubble, Sender } from 'ant-design-x-vue';
import { ref, h, nextTick } from 'vue';
import markdownit from 'markdown-it';
import { Typography } from 'ant-design-vue';
import { createStreamChat } from './llm/streamChat.js';

defineOptions({ name: 'AIChatPage' });

const md = markdownit({ html: true, breaks: true });
const renderMarkdown = (content) =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  });

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const messages = ref<Message[]>([
  {
    id: 1,
    content: '你好！有什么可以帮助你的吗？',
    isUser: false,
    timestamp: new Date()
  }
]);

// 基于现有首条消息，初始化对话历史与系统提示
const chat = createStreamChat({
  systemPrompt: '你是一个友好、有帮助的AI助手。请用简洁、自然的语言回答用户的问题。',
  history: messages.value.map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.content }))
});

const isTyping = ref(false);
const messageId = ref(2);
const chatContainer = ref<HTMLElement>();

const sendMessage = async (content: string) => {
  if (!content.trim()) return;

  // 添加用户消息
  const userMessage: Message = {
    id: messageId.value++,
    content: content.trim(),
    isUser: true,
    timestamp: new Date()
  };
  messages.value.push(userMessage);

  // 显示AI正在输入
  isTyping.value = true;
  await nextTick();
  scrollToBottom();

  try {
    // 创建AI占位消息
    const aiMessage: Message = {
      id: messageId.value++,
      content: '',
      isUser: false,
      timestamp: new Date()
    };
    messages.value.push(aiMessage);
    isTyping.value = false;

    // 使用封装的流式发送
    await chat.sendMessage(userMessage.content, {
      onUpdate: async ({ content: full }) => {
        const lastMessageIndex = messages.value.length - 1;
        if (lastMessageIndex >= 0 && !messages.value[lastMessageIndex].isUser) {
          messages.value[lastMessageIndex] = {
            ...messages.value[lastMessageIndex],
            content: full
          };
        }
        await nextTick();
        scrollToBottom();
      }
    });
  } catch (error) {
    console.error('AI调用失败:', error);

    // 错误处理 - 添加错误消息
    const errorMessage: Message = {
      id: messageId.value++,
      content: '抱歉，我现在无法回答您的问题。请稍后再试。',
      isUser: false,
      timestamp: new Date()
    };

    messages.value.push(errorMessage);
    isTyping.value = false;

    await nextTick();
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>

<template>
  <div class="app-container">
    <div class="ai-chat-container">
      <!-- Header 区域 -->
      <div class="chat-header">
        <h3>AI 智能助手</h3>
      </div>
      
      <!-- 消息区域 -->
      <div ref="chatContainer" class="chat-messages">
        <div v-for="message in messages" :key="message.id" class="message-wrapper">
          <Bubble
            :content="message.content"
            :avatar="{ 
              icon: message.isUser ? h(UserOutlined) : h(RobotOutlined),
              style: { 
                backgroundColor: message.isUser ? '#1890ff' : '#f0f0f0',
                color: message.isUser ? '#ffffff' : '#262626'
              }
            }"
            :variant="message.isUser ? 'filled' : 'outlined'"
            :placement="message.isUser ? 'end' : 'start'"
            :typing="false"
            :messageRender="message.isUser ? (text => text) : renderMarkdown"
            :style="{ 
              marginBottom: '8px',
              maxWidth: '100%',
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              fontSize: '15px',
              lineHeight: '1.5'
            }"
          />
          <div 
            class="message-time" 
            :class="{ 'user-time': message.isUser }"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        
        <!-- AI 正在输入提示 -->
        <div v-if="isTyping" class="message-wrapper typing-indicator">
          <Bubble
            content="正在思考中..."
            :avatar="{ 
              icon: h(RobotOutlined),
              style: { 
                backgroundColor: '#f0f0f0',
                color: '#262626'
              }
            }"
            variant="outlined"
            placement="start"
            :typing="{ step: 1, interval: 300 }"
            :style="{ 
              marginBottom: '8px',
              maxWidth: '60%',
              opacity: 0.8,
              fontSize: '15px'
            }"
          />
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="chat-input">
        <Sender
          placeholder="输入您的问题..."
          :style="{ width: '100%' }"
          @submit="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ai-chat-container {
  display: flex;
  flex-direction: column;
  /* width: 640px; */
  width: 100%;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.chat-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
  min-height: 0;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  width: 640px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 12px;
}

.message-time {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 4px;
  margin-left: 48px;
  font-family: system-ui;
}

.message-time.user-time {
  text-align: right;
  margin-left: 0;
  margin-right: 48px;
}

.typing-indicator {
  display: flex;
  flex-direction: column;
}

.chat-input {
  width: 640px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: #ffffff;
  flex-shrink: 0;
}

/* 自定义滚动条 - 显示在容器边缘 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 选中文本样式 */
::selection {
  background: #1890ff;
  color: white;
}

/* 全局重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  overflow: hidden;
}
</style>