
// const client = new OSS({
//     // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
//     region: "oss-cn-shanghai",
//     authorizationV4: true,
//     // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
//     bucket: "trudbot-md-img",
// });

/**
 * 
 * @param {File[]} files 
 * @returns {string[]}
 */
/**
 * 将图片文件转换为 base64 编码
 * @param {File[]} files - 图片文件数组
 * @returns {Promise<string[]>} 返回 base64 编码数组
 */
/**
 * 压缩图片并转换为base64
 * @param {File} file - 图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.maxWidth - 最大宽度（像素）
 * @param {number} options.quality - 压缩质量（0-1）
 * @returns {Promise<string>}
 */
function compressImage(file, options = { maxWidth: 800, quality: 0.5 }) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // 如果图片宽度超过最大宽度，等比例缩放
            if (width > options.maxWidth) {
                height = (options.maxWidth * height) / width;
                width = options.maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为base64，设置压缩质量
            const base64 = canvas.toDataURL('image/jpeg', options.quality);
            resolve(base64);
        };
        img.onerror = reject;

        // 将File对象转换为blob URL
        img.src = URL.createObjectURL(file);
    });
}

export function convertImagesToBase64(files, options = { maxWidth: 800, quality: 0.5 }) {
    return Promise.all(files.map(file => compressImage(file, options)));
}

// export function upload(files) {
//     // return new Promise(res => {
//     //     res([
//     //         'http://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756276831981_AD7524461DAE4168C5ADFBD1A.jpg'
//     //     ])
//     // })
//     const promises = [];
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         // 使用当前时间戳作为文件名
//         const timestamp = Date.now();
//         const random = Math.random().toString(36).substring(2, 15);
//         const fileName = `${timestamp}_${random}`;
//         const promise = client.put(fileName, file).then(result => {
//             return result.url;
//         }).catch(err => {
//             console.error('上传失败: ', err);
//             throw err;
//         });
//         promises.push(promise);
//     }
//     return Promise.all(promises);
// }