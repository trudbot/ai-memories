import { requestJsonOutput } from "../../llm/jsonAgent.js";
import prompt from "./prompt.js";
import usePrompt from "../../utils/usePrompt.js";
import { z } from "zod";

const genImgPromptSchema = z.object({
    promptList: z.array(z.string()).describe("用于图片生成的提示语列表")
})

/**
 * 
 * @param {any} history 
 */
export function genImgPrompt(history) {
    return requestJsonOutput(null, usePrompt(prompt, { history }), genImgPromptSchema);
}