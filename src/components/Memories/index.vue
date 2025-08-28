<script setup>
import tpl1 from '../../template/themes/dark/tpl1.vue';
import tpl2 from '../../template/themes/dark/tpl2.vue';
import tpl3 from '../../template/themes/dark/tpl3.vue';
import tpl4 from '../../template/themes/dark/tpl4.vue';
import tpl5 from '../../template/themes/dark/tpl5.vue';
import { hideFullLoading, showFullLoading } from '../../utils/event-bus';
import { memento } from '../../data/session-data';
import { uiChoose } from '../../agents/ui-choose/ui-choose';
import { ref } from 'vue';
import { genId } from '../../utils/genId';

const uiComponents = {
    tpl1,
    tpl2,
    tpl3,
    tpl4,
    tpl5
}

showFullLoading('正在生成中...');

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
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
        ]
    },
    {
        title: '大学寝室的夜晚',
        content: "那些深夜熄灯后的宿舍，几个人躺在床上小声聊天。有人讲八卦，有人规划未来，还有人偷偷在被窝里打游戏。窗外的风吹动窗帘，整个夜晚充满了自由和年轻的味道。",
        imgs: [
            'https://example.com/image3.jpg',
            'https://example.com/image4.jpg',
            'https://example.com/image5.jpg'
        ]
    },
    {
        title: '第一次远行',
        content: '毕业后，一个人背着双肩包去了陌生的城市。火车站里人来人往，我却带着点兴奋和不安。走在陌生街道上，看着新的风景，突然意识到——原来自己真的开始了属于自己的生活。',
        imgs: [
            'https://example.com/image6.jpg',
            'https://example.com/image7.jpg'
        ]
    }
]

const ui = ref([]);

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
      "name": "tpl2",
      "slots": {
        "title": "第一次远行",
        "content": "毕业后，一个人背着双肩包去了陌生的城市。火车站里人来人往，我却带着点兴奋和不安。走在陌生街道上，看着新的风景，突然意识到——原来自己真的开始了属于自己的生活。",
        "imgs": [
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png",
          "https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png"
        ]
      }
    }
  ],
  "error": false
}

if (memento.value.length > 0) {
    // setTimeout(() => {
    //     ui.value = data.memoryUI;
    //     hideFullLoading();
    // }, 3000);
    console.log('开始生成ui');
    uiChoose(memories).then(res => {
        console.log('生成结果', res);
        ui.value = res.memoryUI.map(item => {
          return {
            ...item,
            slots: {
              ...item.slots,
              imgs: item.slots.imgs.map(imgId => imgMap[imgId])
            }
          };
        });
    }).finally(() => {
        hideFullLoading();
    });
} else {
    hideFullLoading();
}
</script>

<template>
  <div :class="$style['memories-container']">
    <template v-for="module in ui">
        <component
            v-if="uiComponents[module.name]"
            :is="uiComponents[module.name]"
            :data="module.slots"
        />
    </template>
  </div>
</template>

<style module lang="scss">
@use '@/mixin.scss' as *;

.memories-container {
  padding: px2vw(40);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: px2vw(20) px2vw(40);
}
</style>