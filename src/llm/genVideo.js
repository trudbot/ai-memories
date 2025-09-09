import api from '../utils/request.js';
/**
 * Generate a video based on the provided parameters.
 * @param {{content: Array<{type: 'text', text: string} | {type: 'image', image_url: string}>, model?: string, duration?: number}} options
 * @param {({video_url: string, duration: number, width: string, height: string}) => any} onFinish
 */
export async function genVideo(options, onFinish) {
    const res = await api.post('https://qianfan.baidubce.com/v2/video/generations', {
        ...options
    });
    console.log("genVideo res", res);
    const data = res?.data || {};
    if (!data.task_id) {
        throw new Error('视频生成失败');
    }

    const taskId = data.task_id;

    async function queryStatus() {
        const res = await api.get('https://qianfan.baidubce.com/video/generations', {
            task_id: taskId
        });
        console.log("genVideo queryStatus res", JSON.stringify(res.data, null, 2));
        /**
         * @type {'pending' | 'queued' | 'running' | 'succeeded' | 'failed'}
         */
        const status = res?.data?.status;
        if (status === 'succeeded') {
            console.log("视频生成成功", res?.data?.content?.video_url);
            onFinish && onFinish({
                duration: res?.data?.duration,
                video_url: res?.data?.content?.video_url,
                width: res?.data?.width,
                height: res?.data?.height
            });
        }

        return status;
    }

    return {
        queryStatus
    }
}