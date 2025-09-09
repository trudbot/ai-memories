import axios from 'axios';
import { loadEnvFromFile } from './node-env.js';
import { isBrowser } from './main-check.js';

/**
 * 创建带默认头的 axios 实例
 * @param {string} token - 认证 token
 * @returns {import('axios').AxiosInstance}
 */
export function createApiClient(token) {
    return axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}

// 从浏览器存储中读取配置
function loadFromBrowserStorage() {
  if (!isBrowser()) return {}; // Node 环境
  
  try {
    // 优先从 localStorage 读取，fallback 到 sessionStorage
    const apiKey = localStorage.getItem('VITE_BAIDU_API_KEY') || 
                  sessionStorage.getItem('VITE_BAIDU_API_KEY');
    
    return {
      VITE_BAIDU_API_KEY: apiKey
    };
  } catch (err) {
    console.warn("无法读取浏览器存储:", err.message);
    return {};
  }
}

async function getBaiduApiKey(key) {
    const browserStorage = loadFromBrowserStorage();
    const nodeEnv = await loadEnvFromFile();
    return key || browserStorage.VITE_BAIDU_API_KEY || (typeof import.meta !== "undefined" && import.meta.env.VITE_BAIDU_API_KEY) || nodeEnv.VITE_BAIDU_API_KEY || undefined;
}

export default createApiClient(await getBaiduApiKey());
// 示例：
// const api = createApiClient('bce-v3/ALTAK-*********/614fb**********');
// api.post('/your/api', { foo: 'bar' })
//     .then(res => console.log(res.data));
//     .catch(err => console.error(err));
