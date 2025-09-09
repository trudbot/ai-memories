import { z } from 'zod';
import prompt from './prompt.js'
import { requestJsonOutput } from '../../llm/jsonAgent.js';

export const RecommandThemeSchema = z.object({
    theme: z.string().min(1, "主题不能为空").describe("主题词"),
    words: z.array(z.object({
        value: z.string().describe("场景词"),
        prompt: z.string().describe("关于该场景词的聊天开场白")
    })).describe("当前主题下推荐的场景词及其开场白"),
    error: z.boolean().default(false).describe("是否能出用户输入中读取出主题")
});

// 根据用户输入， 生成主题词， 和推荐场景词
export async function recommandTheme(userInput) {
    const res = await requestJsonOutput(prompt, userInput, RecommandThemeSchema);
    if (res.error) {
        throw new Error("无法提取主题或场景词" + JSON.stringify(res));
    }
    return {
        ...res,
    }
}