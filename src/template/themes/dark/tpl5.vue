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
            <div class="slot" :style="{
                backgroundImage: `url(${image[3]})`
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
    margin-top: calc(var(--ratio) * 25px);
    height: calc(var(--ratio) * 130px);
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
    display: grid;
    grid-template-columns: repeat(2, calc(var(--ratio) * 225px));
    gap: calc(var(--ratio) * 12px) calc(var(--ratio) * 12px);
    margin-top: calc(var(--ratio) * 20px);
}

.slot {
    z-index: 1;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    width: calc(var(--ratio) * 225px);
    aspect-ratio: 1 / 1;
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