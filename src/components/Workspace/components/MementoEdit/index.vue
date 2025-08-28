<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import Add from '../MementoList/close.vue'
import { memento } from '../../../../data/session-data';
import { replaceArrayItems } from '../../../../utils/array';
import { useRouter, useRoute } from 'vue-router';

const id = useRoute().params.id;
const router = useRouter();

const currentMemento = memento.value.find(item => item.mementoId === id);
const title = ref(currentMemento.title);
const content = ref(currentMemento.content);
const imageList = ref(currentMemento.images);

const contentRef = useTemplateRef('contentRef');

onMounted(() => {
    if (contentRef.value) {
        contentRef.value.innerHTML = content.value;
    }
});
function handleContentChange(event) {
    console.log('内容变化了:', event.target.innerText);
    content.value = event.target.innerText;
}

function handleTitleChange(event) {
    console.log('标题变化了:', event.target.innerText);
    title.value = event.target.innerText;
}

function handleSave() {
    memento.value = replaceArrayItems(memento.value, m => m.mementoId === id, m => ({
        ...m,
        title: title.value,
        content: content.value,
        images: imageList.value
    }));
    router.push('/workspace/memento');
}

function handleBack() {
    router.back();
}
</script>
<template>
    <div :class="$style['memento-edit-container']">
        <div :class="$style['memento-card']">
            <div
                :class="$style['title']"
                contenteditable
                @input="handleTitleChange"
            >{{ title }}</div>
            <div
                :class="$style['content']"
                contenteditable="true"
                @input="handleContentChange"
                ref="contentRef"
            ></div>
            <div :class="$style['img-list']">
                <div
                    v-for="(img, index) in imageList"
                    :key="index"
                    :class="$style['img-item']"
                    :style="{
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }"
                >
                </div>
                <div :class="$style['add-img']"><Add/></div>
            </div>
        </div>
        <div :class="$style['control']">
            <div :class="[$style['step-back'], $style['button']]" @click="handleBack">上一步</div>
            <div :class="[$style['save-and-return'], $style['button']]" @click="handleSave">保存并返回</div>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '@/mixin.scss' as *;

.memento-edit-container {
    height: 100%;
    padding-left: px2vw(16);
    padding-right: px2vw(88);
}

.memento-card {
    position: relative;
    background: #1B232C80;
    min-height: px2vw(643);
    border-radius: 16px;
    border: 1px solid #475B79;
    backdrop-filter: blur(4px);
    padding-left: px2vw(32);
    padding-top: px2vw(45);
    padding-right: px2vw(32);
    padding-bottom: px2vw(212);

    .title {
        font-weight: 600;
        font-size: 24px;
        letter-spacing: 0px;
        outline: none;

        &:focus {
            outline: none;
        }
    }

    .content {
        margin-top: 13px;
        font-size: 16px;
        outline: none;
        text-indent: 2em;
        white-space: pre-wrap;
        word-break: break-all;
        line-height: 1.5;

        &:focus {
            outline: none;
        }
    }
}

.img-list {
    position: absolute;
    bottom: px2vw(94);
    display: flex;
    gap: px2vw(11);


    .img-item, .add-img {
        width: px2vw(118);
        height: px2vw(118);
        border: 1.01px solid #475B79;
        border-radius: 8px;
    }

    .add-img {
        @include flex-center();
        cursor: pointer;
        background: #32415280;
    }
}

.control {
    margin-top: px2vw(41);
    display: flex;
    flex-direction: row;
    flex-flow: row-reverse;
    gap: px2vw(44);
}

.button {
    width: px2vw(131);
    height: px2vw(39);
    border-radius: 8px;
    background: #1B232C;
    @include flex-center();
    cursor: pointer;
}
</style>