<script setup>
import {ref} from 'vue'
import MementoItem from './memento-item.vue';
import {memento} from '../../../../data/session-data';
import { useRouter } from 'vue-router';

const emit = defineEmits(['add', 'mementoClick']);
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
    console.log('生成回忆录');
    router.push('/memories');
}
</script>


<template>
    <div :class="$style['list-container']">
        <div :class="$style['title']">创建记忆碎片</div>
        <div :class="$style['list']">
            <div v-for="item in memento" :key="item.title || item.word">
                <MementoItem :data="item" @click="openChat(item)"/>
            </div>
            <div>
                <MementoItem :isAddBtn="true" @click="addMemento"/>
            </div>
        </div>
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
}
</style>