<script setup>
import Wrapper from '../../template-wrapper.vue'
const {data} = defineProps(['data']);
const title = data.title;
const content = data.content;
const image = data.imgs;
</script>

<template>
    <Wrapper class="wrapper full-cover-bg">
        <div class="title" v-html="title"></div>
        <div class="content" v-html="content"></div>
        <div class="imgs">
            <div class="slot" :style="{
                backgroundImage: `url(${image[0]})`
            }"></div>
            <div class="slot" :style="{
                backgroundImage: `url(${image[1]})`
            }"></div>
            <div class="slot" :style="{
                backgroundImage: `url(${image[2]})`
            }"></div>
        </div>
        <div class="icon1"></div>
    </Wrapper>
</template>

<style lang="scss" scoped>
.wrapper {
    color: white;
    background: black;
    padding: 0 calc(var(--ratio) * 32px);
}
.title {
    margin-top: calc(var(--ratio) * 46px);
    text-align: left;
}

.content {
    // 首行缩进
    text-indent: 2em;
    max-height: calc(var(--ratio) * 349px);
    margin-top: calc(var(--ratio) * 51px);
    padding-bottom: calc(var(--ratio) * 30px);
}

.main-img {
    position: absolute;
    z-index: 2;
    background-image: url('https://gips2.baidu.com/it/u=1211620365,1113055532&fm=3028&app=3028&f=PNG&fmt=auto&q=94&size=f517_411');
    width: calc(var(--ratio) * 593px);
    height: calc(var(--ratio) * 411px);
    top: calc(var(--ratio) * 252px);
    left: calc(var(--ratio) * -41px);
}

.imgs {
    height: calc(var(--ratio) * 294px);
    margin-top: calc(var(--ratio) * 20px);
    margin-left: calc(var(--ratio) * -100px);
    margin-right: calc(var(--ratio) * -100px);
    gap: calc(var(--ratio) * 20px);
    display: flex;
    transform: rotate(-5deg) scale(0.9);
    transform-origin: center center;
}

.slot {
    z-index: 1;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    width: calc(var(--ratio) * 200px);
    height: calc(var(--ratio) * 200px);
}

.icon1 {
    position: absolute;
    z-index: 2;
    background-image: url('https://gips1.baidu.com/it/u=1671507614,2221781835&fm=3028&app=3028&f=PNG&fmt=auto&q=100&size=f274_110');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: calc(var(--ratio) * 268.0458068847656px);
    height: calc(var(--ratio) * 84.57062530517578px);
    top: calc(var(--ratio) * 705px);
    left: calc(var(--ratio) * 228px);
}

</style>