import OpenAI from "openai";

// 使用环境变量创建客户端，避免在仓库中硬编码密钥
export function createOpenAIClient({ apiKey, baseURL } = {}) {
    console.log('import.meta.env', import.meta.env);
  const key = apiKey || import.meta.env?.VITE_OPENAI_API_KEY || import.meta.env?.VITE_DEEPSEEK_API_KEY || "";
  const base = baseURL || import.meta?.env?.VITE_OPENAI_BASE_URL || import.meta?.env?.VITE_DEEPSEEK_BASE_URL || undefined;
  return new OpenAI({ apiKey: key, baseURL: base, dangerouslyAllowBrowser: true });
}

// 兼容旧的默认导出（使用环境变量）
const openai = createOpenAIClient();
export default openai;