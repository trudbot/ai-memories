import { isBrowser } from '../utils/main-check.js';
import api from '../utils/request.js';
import openai from './llm.js';

/**
 * Generate an image based on the provided parameters.
 * @param {*} param0 - The parameters for image generation.
 * @returns {Promise<Array<string>>} - Array of image URLs.
 */
export async function genImg_qianfan({
    model = 'irag-1.0',
    n = 1,
    prompt,
}) {
    console.log("genImg prompt", {
        model,
        n, prompt,
    });
    const res = await api.post('https://qianfan.baidubce.com/v2/images/generations', {
        model,
        n,
        prompt
    });
    
    return (res?.data?.data || []).map(item => item.url);
}

/**
 * 
 * @returns {Promise<Array<string>>} - Base64 encoded image(s)
 * https://platform.openai.com/docs/guides/image-generation#generate-images
 */
export async function genImg_openai({
    prompt,
    n = 1,
    model = "gpt-image-1",
    size = '1024x1024'
}) {
    if (!prompt) throw new Error("genImg_openai 缺少 prompt 参数");
    const res = await openai.images.generate({
        model,
        prompt,
        n,
        size,
        quality: 'low'
    });

    return res.data.map(item => `data:image/png;base64,${item.b64_json}`);
}

export const genImg = genImg_qianfan;

if (!isBrowser()) {
    // genImg({
    //     prompt: '"初识不久却兴趣相投的氛围：柔和室内暖光下，两位年轻人面对面微笑交谈，肢体放松、目光真诚，清新自然、浅色调、胶片质感、浅景深、写实风"',
    //     model: 'flux.1-schnell'
    // }).then(res => {
    //     console.log("genImg res", res);
    // })
    // genImg_openai("初识不久却兴趣相投的氛围：柔和室内暖光下，两位年轻人面对面微笑交谈，肢体放松、目光真诚，清新自然、浅色调、胶片质感、浅景深、写实风").then(res => {
    //     const bytes = Buffer.from(res, 'base64');
    //     console.log(res);
    //     import('fs').then(fs => {
    //         fs.writeFileSync('output.png', bytes);
    //     })
    // })
}