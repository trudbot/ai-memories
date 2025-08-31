import { ref } from "vue";
import {genId} from '../utils/genId';

/**
 * 用户要
 */
export const userWant = ref('');
export const theme = ref('');
/**
 * @type {{value: string[]}}}
 * @description 灵感词列表
 */
export const inspiration = ref([
    "清晨的第一缕阳光",
    "上学路上的伙伴",
    "第一次上学的紧张与兴奋",
    "老师讲故事的声音",
    "校园铃声与走廊的回响",
    "放学后的嬉闹与追逐",
    "捏泥巴与画画的乐趣",
    "夏日河边的游泳与玩水",
    "雨天窗外的世界",
    "雪地里的打滚与堆雪人",
    "祖父母的故事与手工",
    "家里的老物件和味道",
    "第一次独立做家务",
    "第一次学会骑自行车",
    "生日蛋糕上的愿望"
]);

/**
 * @type {{
 *  value: {
 *      title?: string,
 *      content?: string,
 *      createdAt?: string,
 *      mementoId: string,
 *      images: string[],
 *      word: string,
 *      chatHistory: {role: 'system' | 'user' | 'assistant', content: any}[],
 * }};
 * @description 回忆录数据
 */
export const memento = ref([]);

export function addDefaultMemento(word) {
    memento.value.push({
        word,
        mementoId: genId(),
        images: [],
        chatHistory: [],
        createdAt: Date.now().toString(),
    });
}

export function removeMemento(item) {
    memento.value = memento.value.filter(m => m.mementoId !== item.mementoId);
}
