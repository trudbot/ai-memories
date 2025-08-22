import OpenAI from "openai";

// ----------node环境下设置clash代理----------------
const PROXY = "http://127.0.0.1:7890";


const autoProxyFetch = await (async () => {
  if (typeof window !== "undefined") {
    // 浏览器环境不需要代理
    return fetch;
  } else {
    const { HttpsProxyAgent } = await import('https-proxy-agent');
    const nodeFetch = (await import('node-fetch')).default;
    return (url, options = {}) => {
      const restOptions = { ...options };

      if (PROXY) {
        const agent = new HttpsProxyAgent(PROXY);
        restOptions.agent = agent;
      }

      return nodeFetch(url, restOptions);
    }
  }
})()

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

// 使用环境变量创建客户端，避免在仓库中硬编码密钥
export async function createOpenAIClient({ apiKey, baseURL } = {}) {
  const nodeEnv = await loadEnvFromFile();
  const key = apiKey ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_API_KEY) ||
    nodeEnv.VITE_OPENAI_API_KEY ||
    undefined;
  const base = baseURL ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_BASE_URL) ||
    nodeEnv.VITE_OPENAI_BASE_URL ||
    undefined;
  return new OpenAI({
    apiKey: key,
    baseURL: base,
    dangerouslyAllowBrowser: true,
    fetch: autoProxyFetch
  });
}

const openai = await createOpenAIClient();

export default openai;

export const model = 'gpt-5-nano';