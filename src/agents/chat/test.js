import { createChatAgent } from "./chat.js";

const {sendMessage} = createChatAgent();

sendMessage('你好呀', delta => {
    console.log(delta);
})