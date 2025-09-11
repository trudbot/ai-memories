import OpenAI from "openai";
import { loadEnvFromFile } from "../utils/node-env.js";
import { isBrowser } from "../utils/main-check.js";

// ----------node环境下设置clash代理----------------
const PROXY = "http://127.0.0.1:7890";


// const autoProxyFetch = await (async () => {
//   if (typeof window !== "undefined") {
//     // 浏览器环境不需要代理
//     return fetch;
//   } else {
//     const { HttpsProxyAgent } = await import('https-proxy-agent');
//     const nodeFetch = (await import('node-fetch')).default;
//     return (url, options = {}) => {
//       const restOptions = { ...options };

//       if (PROXY) {
//         const agent = new HttpsProxyAgent(PROXY);
//         restOptions.agent = agent;
//       }

//       return nodeFetch(url, restOptions);
//     }
//   }
// })()

// ------------------------------------------------

// 从浏览器存储中读取配置
function loadFromBrowserStorage() {
  if (!isBrowser()) return {}; // Node 环境
  
  try {
    // 优先从 localStorage 读取，fallback 到 sessionStorage
    const apiKey = localStorage.getItem('VITE_OPENAI_API_KEY') || 
                  sessionStorage.getItem('VITE_OPENAI_API_KEY');
    const baseURL = localStorage.getItem('VITE_OPENAI_BASE_URL') || 
                   sessionStorage.getItem('VITE_OPENAI_BASE_URL');
    
    return {
      VITE_OPENAI_API_KEY: apiKey,
      VITE_OPENAI_BASE_URL: baseURL
    };
  } catch (err) {
    console.warn("无法读取浏览器存储:", err.message);
    return {};
  }
}

// 使用环境变量创建客户端，避免在仓库中硬编码密钥
export async function createOpenAIClient({ apiKey, baseURL } = {}) {
  const nodeEnv = await loadEnvFromFile();
  const browserStorage = loadFromBrowserStorage();
  const key = apiKey ||
    browserStorage.VITE_OPENAI_API_KEY ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_API_KEY) ||
    nodeEnv.VITE_OPENAI_API_KEY ||
    undefined;
    
  const base = baseURL ||
    browserStorage.VITE_OPENAI_BASE_URL ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_BASE_URL) ||
    nodeEnv.VITE_OPENAI_BASE_URL ||
    undefined;
  try {
    return new OpenAI({
      apiKey: key,
      baseURL: base,
      dangerouslyAllowBrowser: true,
      // fetch: autoProxyFetch
    });
  } catch (err) {
    return undefined;
  }
}

const openai = await createOpenAIClient();
// const deepseek = await createOpenAIClient({
//   apiKey: import.meta.env?.VITE_DEEPSEEK_API_KEY || undefined,
//   baseURL: 'https://api.deepseek.com'
// });

export default openai;

export const model = 'gpt-5-nano';
// export {
//   deepseek
// }