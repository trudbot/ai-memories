import {z} from 'zod';
import prompt from './prompt.js'
import usePrompt from '../../utils/usePrompt.js'
import { requestJsonOutput } from '../../llm/jsonAgent.js';

export const mementoSummarySchema = z.object({
    title: z.string().min(1, "标题不能为空").describe("记忆碎片的标题"),
    content: z.string().min(1, "内容不能为空").describe("记忆碎片的内容")
});

/**
 * 根据对话历史生成记忆碎片的摘要
 * @param {any[]} history - 对话历史记录数组
 * @returns {Promise<{title: string, content: string}>} 返回包含标题和内容的记忆碎片对象
 */
export function summarize(history) {
    return requestJsonOutput(null, usePrompt(prompt, {
        history,
    }), mementoSummarySchema);
}