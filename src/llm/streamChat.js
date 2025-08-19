import { createOpenAIClient } from "./llm";

function pickDefaultModel(baseURLFromArgs) {
  const envBase = import.meta?.env?.VITE_OPENAI_BASE_URL || import.meta?.env?.VITE_DEEPSEEK_BASE_URL || "";
  const base = baseURLFromArgs || envBase || "";
  if (base.includes("deepseek")) return import.meta?.env?.VITE_DEEPSEEK_MODEL || "deepseek-chat";
  return import.meta?.env?.VITE_OPENAI_MODEL || "gpt-4o-mini";
}

/**
 * 创建一个流式对话实例
 * @param {Object} options
 * @param {string} [options.model] - 模型名（不传则按 baseURL 自动选择）
 * @param {string} [options.systemPrompt] - 系统提示词
 * @param {Array<{role: 'system'|'user'|'assistant', content: string}>} [options.history] - 初始对话历史
 * @param {string} [options.apiKey] - 可选，传入则覆盖环境变量
 * @param {string} [options.baseURL] - 可选，传入则覆盖环境变量
 * @param {number} [options.temperature=1] - 采样温度
 */
export function createStreamChat({ model, systemPrompt, history = [], apiKey, baseURL, temperature = 1 } = {}) {
  const client = createOpenAIClient({ apiKey, baseURL });
  const internal = {
    systemPrompt: systemPrompt || "",
    messages: [],
    abortController: null,
    baseURL,
  };

  // 初始化历史（含系统提示）
  const reset = (newHistory = []) => {
    internal.messages.length = 0;
    if (internal.systemPrompt) internal.messages.push({ role: "system", content: internal.systemPrompt });
    if (Array.isArray(newHistory) && newHistory.length) internal.messages.push(...newHistory);
  };
  reset(history);

  const setSystemPrompt = (sp) => {
    internal.systemPrompt = sp || "";
    // 保留除 system 外的历史
    const nonSystem = internal.messages.filter((m) => m.role !== "system");
    reset(nonSystem);
  };

  const getMessages = () => internal.messages.slice();

  const abort = () => {
    if (internal.abortController) {
      internal.abortController.abort();
      internal.abortController = null;
    }
  };

  /**
   * 发送用户消息，流式返回内容
   * @param {string} content - 用户输入
   * @param {Object} [hooks]
   * @param {(payload: { delta: string, content: string, chunk: any }) => void} [hooks.onUpdate]
   * @param {(payload: { content: string }) => void} [hooks.onFinish]
   * @param {(err: any) => void} [hooks.onError]
   * @returns {Promise<string>} - 最终完整回复
   */
  const sendMessage = async (content, hooks = {}) => {
    const { onUpdate, onFinish, onError } = hooks;
    const userMsg = { role: "user", content: String(content ?? "") };
    const runMessages = [...internal.messages, userMsg];

    const chosenModel = model || pickDefaultModel(internal.baseURL);

    internal.abortController = new AbortController();
    let full = "";

    try {
      const stream = await client.chat.completions.create(
        {
          model: chosenModel,
          messages: runMessages,
          temperature,
          stream: true,
        },
        { signal: internal.abortController.signal },
      );

      for await (const chunk of stream) {
        const delta = chunk?.choices?.[0]?.delta?.content || "";
        if (delta) {
          full += delta;
          onUpdate && onUpdate({ delta, content: full, chunk });
        }
      }

      // 成功后写入对话历史
      internal.messages.push(userMsg);
      internal.messages.push({ role: "assistant", content: full });
      onFinish && onFinish({ content: full });
      return full;
    } catch (err) {
      if (onError) onError(err);
      throw err;
    } finally {
      internal.abortController = null;
    }
  };

  return {
    sendMessage,
    abort,
    reset,
    setSystemPrompt,
    getMessages,
  };
}

export default createStreamChat;
