import { ref } from "vue";

/**
 * @type {{value: string[]}}}
 * @description 灵感词列表
 */
export const inspiration = ref([]);

/**
 * @type {{
 *  value: {
 *      title?: string,
 *      content?: string,
 *      createdAt?: string,
 *      mementoId: string,
 *      images: string[],
 *      chatHistory: {role: 'system' | 'user' | 'assistant', content: any}[],
 * }};
 * @description 回忆录数据
 */
export const memento = ref([]);