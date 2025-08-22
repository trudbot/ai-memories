import { createChatAgent } from "./chat.js";

const { sendMessage } = createChatAgent('第一次遇见她');

sendMessage({ type: 'text', content: '你好呀' }, delta => {

}, res => {
    console.log('\nresponse:', res);
    sendMessage({ type: 'image', content: 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/202407082112768.jpg' }, delta => {

    }, res => {
        console.log('\nresponse:', res);
    })
})