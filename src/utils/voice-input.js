export function createVoiceInput() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("当前浏览器不支持语音识别");
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false; // 是否连续识别
  recognition.interimResults = true; // 是否返回中间结果
  recognition.lang = "zh-CN"; // 默认中文，可以改为 "en-US" 等

  let resultHandler = () => {};
  let errorHandler = () => {};

  recognition.addEventListener("result", (event) => {
    console.log("语音识别结果：", event);
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    resultHandler(transcript, event);
  });

  recognition.addEventListener("error", (e) => {
    console.error("语音识别错误：", e);
    errorHandler(e);
  });

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    onResult: (handler) => {
      resultHandler = handler;
    },
    onError: (handler) => {
      errorHandler = handler;
    },
  };
}

// // 使用示例
// const { start, onResult, onError } = createVoiceInput();

// onResult((text) => {
//   console.log("识别结果：", text);
// });

// onError((err) => {
//   console.error("语音识别错误：", err);
// });

// document.getElementById("btn").onclick = () => {
//   start();
// };
