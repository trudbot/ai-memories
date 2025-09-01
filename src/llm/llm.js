import OpenAI from "openai";

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

// 检测是否为 Node 环境并读取 .env.local
async function loadEnvFromFile() {
  if (typeof window !== "undefined") return {}; // 浏览器环境

  try {
    const { readFileSync } = await import("fs");
    const { resolve, dirname } = await import("path");
    const { fileURLToPath } = await import("url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = resolve(__dirname, "../../.env.local");
    const envContent = readFileSync(envPath, "utf-8");

    const env = {};
    envContent.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join("=");
        }
      }
    });
    return env;
  } catch (err) {
    console.warn("无法读取 .env.local 文件:", err.message);
    return {};
  }
}

// 从浏览器存储中读取配置
function loadFromBrowserStorage() {
  if (typeof window === "undefined") return {}; // Node 环境
  
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
  return new OpenAI({
    apiKey: key,
    baseURL: base,
    dangerouslyAllowBrowser: true,
    // fetch: autoProxyFetch
  });
}

// 辅助函数：设置浏览器存储中的 API 配置
export function setApiConfig({ apiKey, baseURL, persistent = true } = {}) {
  if (typeof window === "undefined") return false;
  
  try {
    const storage = persistent ? localStorage : sessionStorage;
    
    if (apiKey) {
      storage.setItem('VITE_OPENAI_API_KEY', apiKey);
    }
    if (baseURL) {
      storage.setItem('VITE_OPENAI_BASE_URL', baseURL);
    }
    return true;
  } catch (err) {
    console.error("保存配置失败:", err.message);
    return false;
  }
}

// 辅助函数：获取浏览器存储中的 API 配置
export function getApiConfig() {
  if (typeof window === "undefined") return {};
  
  try {
    const apiKey = localStorage.getItem('VITE_OPENAI_API_KEY') || 
                  sessionStorage.getItem('VITE_OPENAI_API_KEY');
    const baseURL = localStorage.getItem('VITE_OPENAI_BASE_URL') || 
                   sessionStorage.getItem('VITE_OPENAI_BASE_URL');
    
    return { apiKey, baseURL };
  } catch (err) {
    console.warn("读取配置失败:", err.message);
    return {};
  }
}

// 辅助函数：清除浏览器存储中的 API 配置
export function clearApiConfig() {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.removeItem('VITE_OPENAI_API_KEY');
    localStorage.removeItem('VITE_OPENAI_BASE_URL');
    sessionStorage.removeItem('VITE_OPENAI_API_KEY');
    sessionStorage.removeItem('VITE_OPENAI_BASE_URL');
    return true;
  } catch (err) {
    console.error("清除配置失败:", err.message);
    return false;
  }
}

const openai = await createOpenAIClient();
// const deepseek = await createOpenAIClient({
//   apiKey: import.meta.env?.VITE_DEEPSEEK_API_KEY || undefined,
//   baseURL: 'https://api.deepseek.com'
// });

export default openai;

export const model = 'gpt-5';
// export {
//   deepseek
// }