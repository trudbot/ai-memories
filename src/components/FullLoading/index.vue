<template>
  <div v-if="visible" class="full-loading-overlay" role="status" aria-live="polite">
    <div class="loader-wrap">
      <div class="spinner"></div>
      <div class="message" v-if="message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { emitter } from '../../utils/event-bus';

const visible = ref(false);
const message = ref<string | null>(null);

function onShow(payload?: { message?: string }) {
  message.value = payload?.message ?? null;
  visible.value = true;
}
function onHide() {
  visible.value = false;
  // 可选：在隐藏后清除 message
  setTimeout(() => { message.value = null; }, 200);
}

onMounted(() => {
  emitter.on('full-loading:show', onShow);
  emitter.on('full-loading:hide', onHide);
});

onUnmounted(() => {
  emitter.off('full-loading:show', onShow);
  emitter.off('full-loading:hide', onHide);
});
</script>

<style scoped>
.full-loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 12, 12, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.loader-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  color: #fff;
  min-width: 160px;
  text-align: center;
}

/* 简单 spinner */
.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.15);
  border-top-color: #fff;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  font-size: 14px;
  color: #fff;
  opacity: 0.95;
}
</style>