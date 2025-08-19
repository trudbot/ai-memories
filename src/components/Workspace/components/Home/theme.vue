<script setup>

const themes = [
    {
        name: '人生回忆录',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085237.png'
    },
    {
        name: '恋爱日记',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085238.png'
    },
    {
        name: '宝宝成长日记',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085239.png'
    },
    {
        name: '追星日记',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085240.png'
    },
    {
        name: '旅行回忆录',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085241.png'
    },
    {
        name: '心情随记',
        image: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/Frame%202036085242.png'
    }
]
</script>
<template>
    <div :class="$style['theme-container']">
        <p :class="$style['title']">可选主题</p>
        <div :class="$style['theme-list']">
            <div :class="$style['theme-item']" v-for="(item, index) in themes" :key="index">
                <img :src="item.image" alt="" />
            </div>
        </div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.theme-container {
    width: 100%;
    margin-top: px2vw(38);
}

.title {
    font-family: PingFang SC;
    line-height: 1;
    color: white;
}

.theme-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px 10px; // row-gap column-gap
    width: 100%;
    margin-top: px2vw(19);
}

.theme-item {
    height: px2vw(134);
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>