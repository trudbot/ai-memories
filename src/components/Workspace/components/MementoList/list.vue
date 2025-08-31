<script setup>
import {ref} from 'vue'
import MementoItem from './memento-item.vue';
import {memento} from '../../../../data/session-data';
import { useRouter } from 'vue-router';

const emit = defineEmits(['add', 'mementoClick', 'remove']);
const router = useRouter();

function addMemento() {
    emit('add');
}
console.log(memento.value);
function openChat(item) {
    console.log('Clicked memento:', item);
    emit('mementoClick', item);
}

function generateMemories() {
    router.push('/workspace/myWorks');
}
</script>


<template>
    <div :class="$style['list-container']">
        <div :class="$style['title']">创建回忆碎片</div>
        <TransitionGroup :class="$style['list']" name="memento" tag="div">
            <div v-for="item in memento" :key="item.title || item.word">
                <MementoItem :data="item" @click="openChat(item)" @remove="emit('remove', item)"/>
            </div>
            <div :key="'__add'">
                <MementoItem :isAddBtn="true" @click="addMemento"/>
            </div>
        </TransitionGroup>
        <div :class="$style['gen']" @click="generateMemories">
            生成回忆录
        </div>
    </div>
</template>

<style lang="scss" module>
@use '@/mixin.scss' as *;

.list-container {
    padding-bottom: px2vw(170);
}

.title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    margin-top: px2vw(76);
}

.list {
    margin-top: px2vw(24.45);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: px2vw(23) px2vw(16);
}

.gen {
    font-size: px2vw(14);
    font-weight: 600;
    position: sticky;
    left: 100%;
    bottom: px2vw(50);
    width: px2vw(320);
    height: px2vw(39);
    margin-top: px2vw(32.9);
    border-radius: 8px;
    background-color: #00F6FF;
    color: black;
    @include flex-center();
    cursor: pointer;

    transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease, color .2s ease;

    &:hover {
        box-shadow: 0 0 px2vw(10) rgba(0, 246, 255, 0.55), 0 px2vw(4) px2vw(12) rgba(0, 246, 255, 0.35);
        transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
}

/* TransitionGroup animations (use :global to work with CSS Modules) */
:global(.memento-enter-active),
:global(.memento-leave-active) {
    transition: opacity 200ms ease, transform 200ms ease;
}
:global(.memento-enter-from),
:global(.memento-leave-to) {
    opacity: 0;
    transform: scale(0.96);
}
/* FLIP move animation when grid items reorder */
:global(.memento-move) {
    transition: transform 200ms ease;
}
</style>