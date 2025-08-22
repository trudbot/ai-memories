import agent from "./llm.js";

/**
 * 
 * @param {{systemPrompt: string}} params 
 * @returns 
 */
export function createStreamChat(params) {
  /**
   * @type {Array<{role: 'system' | 'user' | 'assistant', content: any}>}
   */
  const history = [];

  /**
   * @param {type: 'text' || 'image', content: string} input
   * @param {(delta: string) => void} onUpdate
   * @param {(response: string) => void} onFinish
   */
  async function sendMessage(input, onUpdate, onFinish) {
    if (input.type === "text") {
      history.push({ role: "user", content: input.content });
    } else if (input.type === "image") {
      history.push({ role: "user", content: [
        { type: 'input_image', image_url: input.content, detail: 'low' }
      ]});
    }

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
      model: "gpt-5-nano",
      input: messages,
      stream: true,
    })
  }

  return {
    sendMessage
  }
}