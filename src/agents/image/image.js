import {z} from 'zod';
import prompt from './prompt.js'
import { requestJsonOutput } from '../../llm/jsonAgent.js';

export const imageSchema = z.object({
    descriptions: z.array(z.string().describe("图片的描述")),
    error: z.boolean()
});

/**
 * 
 * @param {{type: 'input_image', image_url: string}[]} images 
 * @returns {Promise<{descriptions: string[], error: boolean}>}
 */
export function understandImage(images) {
    return requestJsonOutput(prompt, images, imageSchema);
}