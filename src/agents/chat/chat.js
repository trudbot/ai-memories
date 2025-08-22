import { createStreamChat } from "../../llm/streamChat.js";
import prompt from "./prompt.js";

export function createChatAgent() {
    const chat = createStreamChat({
        systemPrompt: prompt,
    });
    
    async function sendMessage(message, onUpdate, onFinish) {
        return await chat.sendMessage(message, onUpdate, onFinish);
    }
    
    return {
        sendMessage
    }
}