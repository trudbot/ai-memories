import ExifReader from 'exifreader';

/**
 * 提取图片信息：宽、高、宽高比、拍摄时间
 * @param {File} file - 用户选择的图片文件
 * @returns {Promise<{width:number, height:number, ratio:number, takenAt:string|null}>}
 */
async function getImageInfo(file) {
  if (!(file instanceof File)) throw new Error("参数必须是 File 对象");

  // 1. 用 <img> 加载，获取实际宽高
  const url = URL.createObjectURL(file);
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const ratio = +(width / height).toFixed(4);

  // 2. 解析 EXIF 获取拍摄时间
  let takenAt = null;
  try {
    const buf = await file.arrayBuffer();
    const tags = await ExifReader.load(buf, { expanded: true });
    // 常见字段：DateTimeOriginal 或 CreateDate
    takenAt = tags?.exif?.DateTimeOriginal?.description || 
              tags?.exif?.CreateDate?.description || 'unknown';
  } catch (err) {
    console.warn("未能解析 EXIF:", err);
  }

  URL.revokeObjectURL(url);

  return { width, height, ratio, takenAt };
}