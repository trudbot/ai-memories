<script setup>
import tpl1 from '@/template/themes/dark/tpl1.vue';
import tpl2 from '@/template/themes/dark/tpl2.vue';
import tpl3 from '@/template/themes/dark/tpl3.vue';
import tpl4 from '@/template/themes/dark/tpl4.vue';
import tpl5 from '@/template/themes/dark/tpl5.vue';
import { hideFullLoading, showFullLoading } from '@/utils/event-bus';
import { memento } from '@/data/session-data';
import { uiChoose } from '@/agents/ui-choose/ui-choose';
import { ref, computed, watch } from 'vue';
import { genId } from '@/utils/genId';
import { useRouter } from 'vue-router';
import { imgDesc } from '../../../../llm/imgDesc';
import PreStep from './pre.vue';

const router = useRouter();

const uiComponents = {
    tpl1,
    tpl2,
    tpl3,
    tpl4,
    tpl5
}

const icons = [
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841131_1b93a570a9cfea7339400496a6962c72.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841235_37364a93583b81ae1f81b0a44682572c.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841335_87123684-a25f3d74bbabd46ff7203ff1faad82b3365238e794512a34900ae0914b1d8cc4.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841432_87701760-918b8efdc8c57ae448947e9ecf83d3ec836dde010c0126cb2b803d5a9885a079.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841534_%E5%96%87%E5%8F%AD.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841632_%E5%BD%A2%E7%8A%B6%201%201.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841728_a9f8731323ed8af9bb7990e55ca7aeb3.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841823_bf55835f95047ceec4c8490cf0684cd1.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633841919_Group%201312318028%20(1).png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633842013_Group%202036085815.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633842111_Group%202036085828.png',
  'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756633842221_Rectangle.png'
]

const allImages = memento.value.reduce((acc, item) => {
    return [...acc, ...(item.images || [])]
}, []);

const imgMap = {};

const memories = memento.value.map(item => {
    return {
        title: item.title,
        content: item.content,
        imgs: item.images.map(img => {
            const imgId = genId();
            imgMap[imgId] = img;
            return imgId;
        })
    }
});

const test_memento = [
    {
        title: '第一次骑车',
        content: '小学三年级的一个夏天，爸爸推着那辆旧自行车在小区楼下陪我练习。我跌倒了好几次，膝盖破了皮，还忍不住哭了。可等到终于能自己摇摇晃晃骑出去时，风吹在脸上的那一瞬间，我觉得自己真的长大了一点。',
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    },
    {
        title: '大学寝室的夜晚',
        content: "那些深夜熄灯后的宿舍，几个人躺在床上小声聊天。有人讲八卦，有人规划未来，还有人偷偷在被窝里打游戏。窗外的风吹动窗帘，整个夜晚充满了自由和年轻的味道。",
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    },
    {
        title: '第一次远行',
        content: '毕业后，一个人背着双肩包去了陌生的城市。火车站里人来人往，我却带着点兴奋和不安。走在陌生街道上，看着新的风景，突然意识到——原来自己真的开始了属于自己的生活。',
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    }
]

const ui = ref([]);

// pagination: show 2 at a time
const pageSize = 2;
const page = ref(0);
const totalPages = computed(() => Math.ceil(ui.value.length / pageSize));
const visibleUi = computed(() => {
  const start = page.value * pageSize;
  return ui.value.slice(start, start + pageSize);
});
const isPrevDisabled = computed(() => page.value <= 0);
const isNextDisabled = computed(() => totalPages.value === 0 || page.value >= totalPages.value - 1);
const prev = () => { if (!isPrevDisabled.value) page.value -= 1; };
const next = () => { if (!isNextDisabled.value) page.value += 1; };

// 拖拽相关状态
const draggedSticker = ref(null);
const droppedStickers = ref([]); // 存储已放置的贴纸 [{url, x, y, pageIndex}]

// 拖拽开始
function handleDragStart(event, stickerUrl) {
  draggedSticker.value = stickerUrl;
  event.dataTransfer.setData('text/plain', stickerUrl);
}

// 允许放置
function handleDragOver(event) {
  event.preventDefault();
}

// 放置贴纸
function handleDrop(event, pageIndex) {
  event.preventDefault();
  
  if (!draggedSticker.value) return;
  
  const pageElement = event.currentTarget;
  const rect = pageElement.getBoundingClientRect();
  
  // 计算相对于页面元素的位置
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // 添加新贴纸
  droppedStickers.value.push({
    url: draggedSticker.value,
    x: x - 15, // 减去贴纸宽度的一半，让贴纸居中
    y: y - 15, // 减去贴纸高度的一半，让贴纸居中
    pageIndex: (page.value * 2) + pageIndex, // 全局页面索引
    id: Date.now() + Math.random() // 唯一ID
  });
  
  draggedSticker.value = null;
}

// reset to first page whenever ui list changes (e.g., regenerated)
watch(ui, () => { page.value = 0; });

const data = {
  "memoryUI": [
    {
      "name": "tpl1",
      "slots": {
        "title": "第一次骑车",
        "content": "小学三年级的一个夏天，爸爸推着那辆旧自行车在小区楼下陪我练习。我跌倒了好几次，膝盖破了皮，还忍不住哭了。可等到终于能自己摇摇晃晃骑出去时，风吹在脸上的那一瞬间，我觉得自己真的长大了一点。",
        "imgs": [
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png"
        ]
      }
    },
    {
      "name": "tpl3",
      "slots": {
        "title": "大学寝室的夜晚",
        "content": "那些深夜熄灯后的宿舍，几个人躺在床上小声聊天。有人讲八卦，有人规划未来，还有人偷偷在被窝里打游戏。窗外的风吹动窗帘，整个夜晚充满了自由和年轻的味道。",
        "imgs": [
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png",
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png",
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png"
        ]
      }
    },
    {
      "name": "tpl3",
      "slots": {
        "title": "大学寝室的夜晚",
        "content": "那些深夜熄灯后的宿舍，几个人躺在床上小声聊天。有人讲八卦，有人规划未来，还有人偷偷在被窝里打游戏。窗外的风吹动窗帘，整个夜晚充满了自由和年轻的味道。",
        "imgs": [
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png",
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png",
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png"
        ]
      }
    },
    {
      "name": "tpl1",
      "slots": {
        "title": "第一次骑车",
        "content": "小学三年级的一个夏天，爸爸推着那辆旧自行车在小区楼下陪我练习。我跌倒了好几次，膝盖破了皮，还忍不住哭了。可等到终于能自己摇摇晃晃骑出去时，风吹在脸上的那一瞬间，我觉得自己真的长大了一点。",
        "imgs": [
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png"
        ]
      }
    },
  ],
  "error": false
}

async function generateUI() {
    showFullLoading('正在生成中...');
    // ui.value = data.memoryUI.map(item => {
    //   return {
    //     ...item,
    //     slots: {
    //       ...item.slots,
    //       imgs: item.slots.imgs.map(imgId => imgMap[imgId] || imgId)
    //     }
    //   };
    // });
    if (memories.length > 0) {
        const imgs = Object.getOwnPropertyNames(imgMap);
        const descs = await imgDesc(imgs.map(id => imgMap[id]));
        const descMap = {};
        imgs.forEach((id, idx) => {
            descMap[id] = descs[idx];
        });
        console.log('图片描述', descs);
        memories.forEach(mem => {
            mem.imgs = mem.imgs.map((imgId) => {
                return {
                    id: imgId,
                    desc: descMap[imgId] || ''
                }
            });
        });
        console.log('开始生成ui', memories);
        uiChoose(memories).then(res => {
            console.log('生成结果', res);
            ui.value = res.memoryUI.map(item => {
              return {
                ...item,
                slots: {
                  ...item.slots,
                  imgs: item.slots.imgs.map(imgId => imgMap[imgId] || imgId)
                }
              };
            });
        }).finally(() => {
            hideFullLoading();
        });
    } else {
        console.log('无回忆碎片');
        hideFullLoading();
    }
}

generateUI();
</script>

<template>
  <div :class="$style['memories-container']">
    <div :class="$style['memory-show']">
          <transition-group name="fade-scale" tag="div" :class="$style['pages']">
            <div 
              :class="[$style['page'], i === 0 ? 'page-left' : 'page-right']" 
              v-for="(module, i) in visibleUi" 
              :key="(page * 2) + i"
              @dragover="handleDragOver"
              @drop="(e) => handleDrop(e, i)"
            >
              <component
                  v-if="uiComponents[module.name]"
                  :is="uiComponents[module.name]"
                  :data="module.slots"
              />
              <!-- 渲染已放置的贴纸 -->
              <div 
                v-for="sticker in droppedStickers.filter(s => s.pageIndex === (page * 2) + i)"
                :key="sticker.id"
                :class="$style['dropped-sticker']"
                :style="{
                  left: sticker.x + 'px',
                  top: sticker.y + 'px'
                }"
              >
                <img :src="sticker.url" alt="贴纸" />
              </div>
            </div>
          </transition-group>
          <div :class="$style['sticker']">
              <div :class="$style['sticker-title']">贴纸库</div>
              <div :class="$style['sticker-list']">
                  <div 
                    :class="$style['sticker-item']" 
                    v-for="url in icons"
                    :key="url"
                    draggable="true"
                    @dragstart="(e) => handleDragStart(e, url)"
                  >
                    <img :src="url" alt="贴纸" />
                  </div>
              </div>
          </div>
       <div :class="$style['nav']">
         <div :class="[$style['btn'], {[$style['disabled']]: isPrevDisabled}]" @click="prev">&lt;</div>
         <div :class="[$style['btn'], {[$style['disabled']]: isNextDisabled}]" @click="next">&gt;</div>
       </div>
      </div>
  <div :class="$style['bottom-control']">
     <div :class="$style['back']" @click="router.back()">
      <pre-step/>
     </div>
         <div :class="$style['reflash']" @click="generateUI">重新生成</div>
         <div :class="$style['print']">打印成册</div>
      </div>
  </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.memories-container {
  padding: px2vw(40);
}

.sticker {
   position: absolute;
   right: px2vw(47.5);
   width: px2vw(199.5);
   height: 100%;
   padding-top: px2vw(31);
  //  overflow: scroll;

   .sticker-title {
    font-size: max(px2vw(16), 16px);
    font-weight: 600;
   }

   .sticker-list {
    padding-top: px2vw(17);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: px2vw(12);
   }

   .sticker-item {
     height: px2vw(58.5);
    background: #1B232C;
     border-radius: 6px;
     @include flex-center();
     cursor: grab;
     
     &:active {
       cursor: grabbing;
     }
   }
}

.memory-show {
    width: px2vw(984);
    height: px2vw(600);
    border-radius: 16px;
    border: 1px solid #475B79;
    background: #1B232C80;
    position: relative;
    // @include flex-center();

    .pages {
      position: absolute;
      inset: 0;
    }

    .page {
       position: absolute;
       flex: 0;
       width: px2vw(319.88);

       &:first-child {
         left: px2vw(25.69);
         top: px2vw(26.78);
       }

       &:nth-child(2) {
        left: px2vw(372.53);
        top: px2vw(26.78);
       }
    }

    .dropped-sticker {
      position: absolute;
      width: px2vw(30);
      height: px2vw(30);
      z-index: 10;
      pointer-events: none;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    /* explicit left/right positions as global utilities */
    :global(.page-left) {
      left: px2vw(25.69);
      top: px2vw(26.78);
    }
    :global(.page-right) {
      left: px2vw(372.53);
      top: px2vw(26.78);
    }

    .nav {
      position: absolute;
      bottom: px2vw(20);
      left: px2vw(338);
      display: flex;
      gap: px2vw(12);
    }

    .btn {
      font-size: px2vw(15);
      user-select: none;
      cursor: pointer;
      color: #ffffff;
      transition: opacity .2s ease, text-shadow .2s ease, transform .2s ease;

      &:not(.disabled):hover {
        opacity: 1;
        text-shadow: 0 0 px2vw(6) rgba(214, 227, 242, 0.9), 0 0 px2vw(12) rgba(71, 91, 121, 0.7);
        transform: scale(1.1);
      }
      &:not(.disabled):active {
        transform: scale(1.04);
      }
    }

    .disabled {
      opacity: .6;
      pointer-events: none;
      cursor: default;
      color: #9aa7b4;
    }

    /* fade + scale transition (global so transition-group class names aren't scoped) */
    :global(.fade-scale-enter-active),
    :global(.fade-scale-leave-active) {
      transition: opacity 1.2s ease, transform 1.2s ease;
    }
    :global(.fade-scale-enter-from) {
      opacity: 0;
      transform: scale(.96);
    }
    :global(.fade-scale-leave-to) {
      opacity: 0;
      transform: scale(.94);
    }
}

.reflash {
  cursor: pointer;
  width: px2vw(131);
  height: px2vw(39);
  border-radius: px2vw(8);
  background-color: #1B232C;
  @include flex-center();
  font-size: 18px;
  font-weight: 500;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease, color .2s ease;

  &:hover {
    background-color: #222b34;
    box-shadow: 0 0 px2vw(10) rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}

.print {
  cursor: pointer;
  width: px2vw(147);
  height: px2vw(39);
  border-radius: px2vw(8);
  background-color: #00F6FF;
  @include flex-center();
  font-size: 18px;
  font-weight: 500;
  color: black;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease, color .2s ease;

  &:hover {
    box-shadow: 0 0 px2vw(10) rgba(0, 246, 255, 0.55), 0 px2vw(4) px2vw(12) rgba(0, 246, 255, 0.35);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}

.bottom-control {
  @include flex-center();
  gap: px2vw(12);
  margin-top: px2vw(48);
}

.back {
  cursor: pointer;
  width: px2vw(39);
  height: px2vw(39);
  border-radius: px2vw(8);
  background-color: #1B232C;
  color: #ffffff;
  @include flex-center();
  font-size: 18px;
  font-weight: 600;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease, color .2s ease;

  &:hover {
    background-color: #222b34;
    box-shadow: 0 0 px2vw(10) rgba(255,255,255,0.12);
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
}
</style>