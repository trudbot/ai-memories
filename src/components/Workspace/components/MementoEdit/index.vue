<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import Add from '../MementoList/close.vue'
import { memento } from '../../../../data/session-data';
import { replaceArrayItems } from '../../../../utils/array';
import { useRouter, useRoute } from 'vue-router';
import ImageIcon from '../Home/icons/image.vue';
import TestData from './test_data.json';
import { genImgPrompt } from '../../../../agents/gen-img-prompt/gen-prompt';
import { genImg } from '../../../../llm/genImg';

const id = useRoute().params.id;
const router = useRouter();

const currentMemento = memento.value.find(item => item.mementoId === id);
// const currentMemento = JSON.parse(JSON.stringify(TestData));
const title = ref(currentMemento.title || '未命名');
const content = ref(currentMemento.content || '');
const imageList = ref(currentMemento.images);
const aiImageList = ref([]);
const isFetching = ref(false);
// console.log(JSON.stringify(currentMemento));
const historyNoImage = currentMemento.chatHistory.map(msg => {
    if (Array.isArray(msg.content)) {
        return {
            ...msg,
            content: [...msg.content.filter(c => c.type === 'text')]
        }
    }
    return {...msg}
});

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
        images: [...imageList.value, ...aiImageList.value.filter(img => img !== 'loading' && img !== 'error')]
    }));
    router.push('/workspace/memento');
}

function handleBack() {
    router.back();
}

async function generateAIImages() {
    if (isFetching.value || !historyNoImage.length) return;
    
    isFetching.value = true;
    console.log('生成AI图片');
    console.log('对话记录', historyNoImage);

    try {
        const prompts = await genImgPrompt(historyNoImage);
        console.log('生成的提示语:', prompts);
        aiImageList.value = prompts.promptList.map(() => 'loading');
        prompts.promptList.forEach(async (prompt, idx) => {
            console.log(`Prompt ${idx + 1}: ${prompt}`);
            try {
                const res = await genImg({prompt, n: 1});
                if (Array.isArray(res) && res.length > 0) {
                    aiImageList.value[idx] = res[0];
                }
            } catch (error) {
                console.error('生成图片失败:', error);
                aiImageList.value[idx] = 'error';
            }
        });
    } catch (error) {
        console.error('生成图片失败:', error);
    }
    isFetching.value = false;
}

function removeAiImage(index) {
    aiImageList.value = aiImageList.value.filter((_, i) => i !== index);
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

            <div :class="[$style['img-list'], $style['ai-img-list']]">
                <template v-for="(img, index) in aiImageList">
                    <div v-if="img === 'loading'" :class="[$style['img-item'], $style['img-loading']]">
                        <div :class="$style['loading-spinner']"></div>
                    </div>
                    <div
                        v-else-if="img !== 'error'"
                        :class="$style['img-item']"
                        :style="{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }"
                    >
                        <button
                            :class="$style['close']"
                            @click.stop="removeAiImage(index)"
                            aria-label="remove"
                            title="移除"
                        >
                            ×
                        </button>
                    </div>
                </template>
           
                <div 
                    :class="[$style['add-img'], isFetching ? $style['disabled'] : '']" 
                    @click="generateAIImages"
                >
                    <div v-if="isFetching">
                        <div :class="$style['loading-spinner']"></div>
                    </div>
                    <ImageIcon v-else/>
                    <div :class="$style['tip']">
                        {{ isFetching ? '生成中...' : '试试生成图片' }}
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['control']">
            <div :class="[$style['save-and-return'], $style['button']]" @click="handleSave">保存并返回</div>
            <div :class="[$style['step-back'], $style['button']]" @click="handleBack">上一步</div>
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
    padding-bottom: px2vw(321);

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
    bottom: px2vw(203);
    display: flex;
    gap: px2vw(11);


    .img-item, .add-img {
        width: px2vw(118);
        height: px2vw(118);
        border: 1.01px solid #475B79;
        border-radius: 8px;
    }

    .img-item {
        position: relative;
    }

    .img-loading {
        @include flex-center();
        background: #32415280;
    }

    .add-img {
        @include flex-center();
        cursor: pointer;
        background: #32415280;
        
        &.disabled {
            cursor: not-allowed;
            opacity: 0.6;
            pointer-events: none;
        }
    }
}

.ai-img-list {
    bottom: px2vw(73);

    .add-img {
        position: relative;
        .tip {
            position: absolute;
            line-height: 60px;
            bottom: px2vw(20);
            font-size: 11px;
            color: white;
        }
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

    transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease, color .2s ease;

    &:hover {
        background-color: #222b34;
        box-shadow: 0 0 px2vw(10) rgba(255,255,255,0.12);
        transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(71, 91, 121, 0.3);
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.close {
    position: absolute;
    top: px2vw(6);
    right: px2vw(6);
    width: px2vw(22);
    height: px2vw(22);
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.1);
    color: #aaa;
    font-size: px2vw(14);
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 160ms ease;

    &:hover {
        background: rgba(0, 0, 0, 0.55);
    }
}
</style>