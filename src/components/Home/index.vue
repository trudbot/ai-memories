<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToWorkspace() {
    router.push('/workspace');
}
</script>

<template>
    <div :class="$style['home-container']">
        <div :class="$style['home-content']">
            <div :class="$style['line']">把时光</div>
            <div :class="$style['line']">存成永不褪色的模样</div>
            <div :class="$style['button']" @click="navigateToWorkspace">点击体验</div>
        </div>
        <!--半透明遮罩-->
        <div :class="$style['overlay']">
        </div>
    </div>
</template>

<style module lang="scss">
@use '../../mixin.scss' as *;

.home-container {
  height: 100%;
  width: 100%;
  background-color: black;
  position: relative;

  background-image: url('https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/%E6%96%B0%E5%AF%B9%E8%AF%9D.png');
  background-size: cover;
  background-position: center;
}

.home-content {
    z-index: 2;
    position: absolute;
    .line {
        font-family: PingFang SC;
        font-weight: 600;
        font-style: Semibold;
        font-size: 64px;
        leading-trim: NONE;
        line-height: 90px;
        letter-spacing: 0px;
        color: white;
    }

    .button {
        width: 170px;
        height: 53px;
        opacity: 1;
        border-radius: 100px;
        top: 494px;
        left: 212px;
        gap: 20px;
        background: white;
        text-align: center;

        font-family: PingFang SC;
        font-weight: 600;
        font-size: 24px;
        line-height: 53px;
        letter-spacing: 0%;

        margin-top: px2vw(32);
        
        // Hover animation
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate3d(0, 0, 0);

        &:hover {
            transform: scale(1.02);
            background: rgba(255, 255, 255, 0.95);
        }

        &:active {
            transform: scale(0.98);
            transition: all 0.1s ease;
        }
    }

    left: px2vw(212);
    top: px2vw(218);

}

.overlay {
    position: absolute;
    height: 100%;
    width: px2vw(622);
    top: 0;
    left: 0;
    background: linear-gradient(270.53deg, rgba(0, 0, 0, 0) 0.35%, #000000 99.43%);
}
</style>