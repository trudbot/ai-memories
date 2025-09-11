<script setup>
import { ref } from 'vue';
import HomeSvg from './icons/Home.vue';
import ActiveHome from './icons/AigcSystemHome.vue';
import ToolkitSvg from './icons/AigcSystemAItoolkit.vue';
import ActiveToolkit from './icons/ActiveToolkit.vue';
import WorksSvg from './icons/AigcSystemWorks.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const routeMap = {
    home: '/workspace/home',
    inspiration: '/workspace/memento',
    myWorks: '/workspace/myWorks'
};

const reverseRouteMap = {
    '/workspace/home': 'home',
    '/workspace/memento': 'inspiration',
    '/workspace/myWorks': 'myWorks'
};

const activeItem = ref(reverseRouteMap[route.path] || 'home');

function sidebarItemClick(item) {
    activeItem.value = item;
    router.push(routeMap[item]);
}

router.beforeEach(e => {
    if (reverseRouteMap[e.path]) {
        activeItem.value = reverseRouteMap[e.path];
    }
});
</script>

<template>
    <div :class="$style['sidebar-container']">
        <div :class="$style['menu']">
            <div :class="[$style['menu-item'], { [$style['active']]: activeItem === 'home' }]" @click="sidebarItemClick('home')">
                <ActiveHome v-if="activeItem === 'home'"/>
                <HomeSvg  v-else />
                <span :class="$style['text']">首页</span>
            </div>
            <div :class="[$style['menu-item'], { [$style['active']]: activeItem === 'inspiration' }]" @click="sidebarItemClick('inspiration')">
                <ActiveToolkit v-if="activeItem === 'inspiration'"/>
                <ToolkitSvg v-else/>
                <span :class="$style['text']">回忆碎片</span>
            </div>
            <div :class="[$style['menu-item'], { [$style['active']]: activeItem === 'myWorks' }]" @click="sidebarItemClick('myWorks')">
                <WorksSvg /><span :class="$style['text']">我的作品</span>
            </div>
        </div>
    </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.sidebar-container {
  width: 100%;
  height: 100%;
  padding: px2vw(24);
  color: white;
}

.menu {
    @include flex(column);
    .menu-item {
        &:not(:first-child) {
            margin-top: px2vw(8);
        }
        color: #9DA1AB;
        height: px2vw(40);
        width: 100%;
        @include flex(row, flex-start, center);
        padding-left: px2vw(10);

        &.active {
            background: #1B232C;
            border-radius: 8px;
            color: white;
        }

        .text {
            margin-left: px2vw(8);
            font-size: 14px;
        }
    }
}
</style>