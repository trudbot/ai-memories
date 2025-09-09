import { isMain } from '../utils/main-check.js';
import api from '../utils/request.js';

/**
 * Generate an image based on the provided parameters.
 * @param {*} param0 - The parameters for image generation.
 * @returns {Promise<Array<{url: string}>>} - The generated image(s).
 */
export async function genImg({
    model = 'irag-1.0',
    n = 1,
    prompt,
    refer_image
}) {
    console.log("genImg prompt", {
        model,
        n, prompt,
        refer_image
    });
    const res = await api.post('https://qianfan.baidubce.com/v2/images/generations', {
        model,
        n,
        prompt
    });
    
    return res?.data?.data || [];
}

if (isMain()) {
    genImg({
        prompt: '生成一个王源在跳舞的图片， 每个手里都拿着一包香烟'
    }).then(res => {
        console.log("genImg res", res);
    })
}