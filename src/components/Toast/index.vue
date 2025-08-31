<template>
  <div class="toast-wrap" aria-live="polite" aria-atomic="true">
    <transition-group name="toast" tag="div" class="stack">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
        role="status"
      >
        <span class="msg">{{ t.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { emitter } from '../../utils/event-bus';

interface ToastItem { id: number; message: string; type: 'info'|'success'|'warning'|'error'; timeout?: number; }

const toasts = ref<ToastItem[]>([]);
let seed = 1;

function onShow(payload?: { message?: string; type?: ToastItem['type']; duration?: number }) {
  if (!payload?.message) return;
  const id = seed++;
  const item: ToastItem = {
    id,
    message: payload.message,
    type: payload.type ?? 'info',
    timeout: payload.duration ?? 2000,
  };
  toasts.value.push(item);
  if (item.timeout && item.timeout > 0) {
    setTimeout(() => remove(id), item.timeout);
  }
}

function onClear() {
  toasts.value = [];
}

function remove(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

onMounted(() => {
  emitter.on('toast:show', onShow);
  emitter.on('toast:clear', onClear);
});

onUnmounted(() => {
  emitter.off('toast:show', onShow);
  emitter.off('toast:clear', onClear);
});
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  pointer-events: none; /* let clicks fall through when possible */
}
.stack { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.toast {
  pointer-events: auto;
  max-width: 80vw;
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.28);
  font-size: 16px;
  line-height: 1.5;
  animation: toast-pop 220ms cubic-bezier(.2,.8,.2,1) 0ms both, toast-pulse 1200ms ease-in-out 240ms 2 both;
}
.toast.success { background: #1f8a50; }
.toast.warning { background: #b57f00; }
.toast.error { background: #b13535; }

/* animations */
.toast-enter-active, .toast-leave-active { transition: opacity 180ms ease; }
.toast-enter-from { opacity: 0; }
.toast-leave-to { opacity: 0; }
.toast-move { transition: transform 180ms ease; }

.msg { white-space: pre-wrap; line-height: 1.4; }

@keyframes toast-pop {
  0% { opacity: 0; transform: translateY(-8px) scale(0.92); }
  60% { opacity: 1; transform: translateY(-2px) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toast-pulse {
  0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 12px 30px rgba(0,0,0,0.28); }
  50% { transform: translateY(-2px) scale(1.03); box-shadow: 0 18px 40px rgba(0,0,0,0.35); }
}
</style>
