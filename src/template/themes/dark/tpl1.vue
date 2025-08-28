<script setup>
import Wrapper from '../../template-wrapper.vue'

const {data} = defineProps(['data']);

const title = data.title;
const content = data.content;
const image = data.imgs[0];
</script>

<template>
    <Wrapper class="wrapper full-cover-bg">
        <div class="title">{{ title }}</div>
        <div class="content">{{ content }}</div>
        <div class="main-img full-cover-bg">
        </div>
        <div
            :style="{
                backgroundImage: `url(${image})`
            }"
            class="slot"
        ></div>
        <div class="icon1"></div>
    </Wrapper>
</template>

<style lang="scss" scoped>
.wrapper {
    color: white;
    background-image: url('http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756212992929_1%20(1).png');
}
.title {
    margin-top: calc(var(--ratio) * 46px);
    text-align: center;
}

.content {
    // 首行缩进
    text-indent: 2em;
    margin-top: calc(var(--ratio) * 31px);
    padding: 0 calc(var(--ratio) * 57px);
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

.slot {
    position: absolute;
    z-index: 1;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    top: calc(var(--ratio) * 271px);
    width: calc(var(--ratio) * 529px);
    height: calc(var(--ratio) * 373px);
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
    top: calc(var(--ratio) * 217px);
    left: calc(var(--ratio) * 29px);
}

</style>