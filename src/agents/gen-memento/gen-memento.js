import {z} from 'zod';
import prompt from './prompt.md?raw'
import { requestJsonOutput } from '../../llm/jsonAgent.js';

export const GenMementoSchema = z.object({
    title: z.string().min(1, "标题不能为空").describe("记忆碎片的标题"),
    content: z.string().min(1, "内容不能为空").describe("记忆碎片的内容")
});

/**
 * 
 * @param {Array<{role: 'system' | 'user', content: any}>} history 
 * @returns {{title: string, content: string}}
 */
export async function genMemento(history) {
    const res = await requestJsonOutput(prompt, JSON.stringify(history), GenMementoSchema);
    return {
        ...res,
    }
}