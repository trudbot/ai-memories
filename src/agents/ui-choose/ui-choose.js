import {z} from 'zod';
import prompt from './prompt.js'
import usePrompt from '../../utils/usePrompt.js'
import { requestJsonOutput } from '../../llm/jsonAgent.js';
import { dark as defaultUM } from './ui-module.js';

const uiChooseSchema = z.object({
    memoryUI: z.array(z.object({
        name: z.string(),
        slots: z.object({
            title: z.string(),
            content: z.string(),
            imgs: z.array(z.string().describe('图片的id列表'))
        })
    })),
    error: z.boolean()
});

/**
 * 
 * @param {{title: string, content: string}} memory 
 * @param {*} uiModules 
 * @returns {Promise<{memoryUI: {name: string, slots: {title: string, content: string, imgs: string[]}}[], error: boolean}>}
 */
export const uiChoose = (memory, uiModules) => {
    return requestJsonOutput(null, usePrompt(prompt, {
        memory,
        uiModules: uiModules || defaultUM
    }), uiChooseSchema);
};
