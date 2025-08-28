import agent, { model } from "./llm.js";

/**
 * 
 * @param {{systemPrompt: string; history: Array<{role: 'user' | 'assistant', content: any}>}} params 
 * @returns 
 */
export function createStreamChat(params) {
  /**
   * @type {Array<{role: 'system' | 'user' | 'assistant', content: any}>}
   */
  const history = params.history || [];

  /**
   * @param {type: 'text' || 'image', content: any} input
   * @param {(delta: string) => void} onUpdate
   * @param {(response: string) => void} onFinish
   */
  async function sendMessage(input, onUpdate, onFinish) {
    console.log('sendMessage', input);
    if (input.type === "text") {
      history.push({ role: "user", content: input.content });
    } else if (input.type === "image") {
      history.push({
        role: "user", content: input.content
      });
    }
    console.log('history', history);
    const stream = await createRequest([
      { role: "system", content: params.systemPrompt },
      ...history
    ]);

    let res = "";

    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        res += event.delta;
        onUpdate?.(res);
      }
      if (event.type === 'response.completed') {
        history.push({ role: "assistant", content: res });
        onFinish?.(res);
      }
    }
  }

  function createRequest(messages) {
    return agent.responses.create({
      model,
      input: messages,
      stream: true,
    })
  }

  function getHistory() {
    return history;
  }

  return {
    sendMessage,
    getHistory
  }
}