import { ref } from "vue";
import {genId} from '../utils/genId';

/**
 * 用户要
 */
export const userWant = ref('');
export const theme = ref('');
/**
 * @type {{value: {value: string, prompt: string}[]}}}
 * @description 灵感词列表
 */
export const inspiration = ref([
    { value: '清晨的第一缕阳光', prompt: '' },
    { value: '上学路上的伙伴', prompt: '' },
    { value: '第一次上学的紧张与兴奋', prompt: '' },
    { value: '老师讲故事的声音', prompt: '' },
    { value: '校园铃声与走廊的回响', prompt: '' },
    { value: '放学后的嬉闹与追逐', prompt: '' },
    { value: '捏泥巴与画画的乐趣', prompt: '' },
    { value: '夏日河边的游泳与玩水', prompt: '' },
    { value: '雨天窗外的世界', prompt: '' },
    { value: '雪地里的打滚与堆雪人', prompt: '' },
    { value: '祖父母的故事与手工', prompt: '' },
    { value: '家里的老物件和味道', prompt: '' },
    { value: '第一次独立做家务', prompt: '' },
    { value: '第一次学会骑自行车', prompt: '' },
    { value: '生日蛋糕上的愿望', prompt: '' }
]);

/**
 * @type {{
 *  value: {
 *      title?: string,
 *      content?: string,
 *      createdAt?: string,
 *      mementoId: string,
 *      images: string[],
 *      word: {value: string, prompt: string},
 *      chatHistory: {role: 'system' | 'user' | 'assistant', content: any}[],
 * }};
 * @description 回忆录数据
 */
export const memento = ref([]);

export function addDefaultMemento(word) {
    memento.value.push({
        word: typeof word === 'string' ? { value: word, prompt: '' } : word,
        mementoId: genId(),
        images: [],
        chatHistory: [],
        createdAt: Date.now().toString(),
    });
}

export function removeMemento(item) {
    memento.value = memento.value.filter(m => m.mementoId !== item.mementoId);
}
