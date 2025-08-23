<script setup>
import {ref} from 'vue'
import MementoItem from './memento-item.vue';
const mementos = ref([
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
    {title: '初见'},
]);
</script>


<template>
    <div :class="$style['list-container']">
        <div :class="$style['title']">创建记忆碎片</div>
        <div :class="$style['list']">
            <div v-for="item in mementos" :key="item.title">
                <MementoItem :data="item" />
            </div>
            <div>
                <MementoItem :isAddBtn="true" />
            </div>
        </div>
        <div :class="$style['gen']">
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