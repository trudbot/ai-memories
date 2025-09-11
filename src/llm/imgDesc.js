import { isBrowser } from '../utils/main-check.js';
import api from '../utils/request.js';

const prompt = `
你需要为用户上传的每张图片都生成一段描述文案，用文字传达图片的场景、人物、动作、情绪等信息， 能让没见过图片的人也能想象出图片的样子。
你必需返回一个JSON对象，格式如下：
{
    imgDesc: string[]
}
`;
/**
 * 
 * @param {string[]} imgList
 * @return {Promise<string[]>} 每个元素对应一张图片的描述 
 */
export async function imgDesc(imgList) {
    const res = await api.post('https://qianfan.baidubce.com/v2/chat/completions', {
        model: 'ernie-4.5-turbo-vl',
        messages: [
            {
                role: 'user',
                content: [
                    {type: 'text', text: prompt},
                    ...imgList.map(url => ({type: 'image_url', image_url: {url}}))
                ]
            }
        ],
        response_format: {
            type: 'json_schema',
            json_schema: {
                type: 'object',
                properties: {
                    imgDesc: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        description: '图片描述数组，每个元素对应一张图片的描述'
                    }
                },
                required: ['imgDesc'],
                additionalProperties: false
            }
        }
    });
    try {
        const data = JSON.parse(res.data.choices[0].message.content);
        if (Array.isArray(data.imgDesc) && data.imgDesc.length === imgList.length) {
            return data.imgDesc;
        }
        throw new Error("返回的 imgDesc 数量与图片数量不匹配");
    } catch (e) {
        console.error("解析 模型 返回内容失败:", e);
        throw new Error(`解析 模型 返回内容失败: ${e.message}`);
    }
}

if (!isBrowser()) {
    imgDesc([
        'https://qianfan-modelbuilder-img-gen.bj.bcebos.com/irag-1.0/7441674ed042446fa3a04a6a6ff8416a/211630412dfd49209b55ca435d453f8a/img-0332357c-e4e6-4501-7de2-5076a28c3add.png?authorization=bce-auth-v1%2F50c8bb753dcb4e1d8646bb1ffefd3503%2F2025-09-10T04%3A12%3A56Z%2F86400%2Fhost%2Faba01c3e87a0c8e76f6d0c021f85ca73d14ce8c4f20829a2f8113dff46b6513a',
        'https://qianfan-modelbuilder-img-gen.bj.bcebos.com/irag-1.0/7441674ed042446fa3a04a6a6ff8416a/211630412dfd49209b55ca435d453f8a/img-4d2eabf0-302f-4e1e-6a9f-cb037babbf28.png?authorization=bce-auth-v1%2F50c8bb753dcb4e1d8646bb1ffefd3503%2F2025-09-10T04%3A12%3A57Z%2F86400%2Fhost%2F0f71909ad12a1dbe402b5baeedc94a181000af72507bcf2b5ddabf14f1f9eaf2'
    ]).then(res => {
        console.log("imgDesc data", res);
    })
}