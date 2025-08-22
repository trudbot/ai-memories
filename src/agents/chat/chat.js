import { createStreamChat } from "../../llm/streamChat.js";
import prompt from "./prompt.js";
import usePrompt from '../../utils/usePrompt.js'

export function createChatAgent(themeword) {
    const chat = createStreamChat({
        systemPrompt: usePrompt(prompt, { themeword })
    });

    return chat;
}