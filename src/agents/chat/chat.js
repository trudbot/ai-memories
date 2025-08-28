import { createStreamChat } from "../../llm/streamChat.js";
import prompt from "./prompt.js";
import usePrompt from '../../utils/usePrompt.js'

export function createChatAgent({
    theme,
    word,
    history
}) {
    const chat = createStreamChat({
        systemPrompt: usePrompt(prompt, { theme, word }),
        history
    });

    return chat;
}