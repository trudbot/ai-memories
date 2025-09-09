/**
 * Web 语音识别工具类
 * @example
 * const recognizer = new SpeechRecognizer({
 *   lang: 'zh-CN',
 *   continuous: true,
 *   onResult: (text) => console.log('最终结果:', text),
 *   onInterimResult: (text) => console.log('临时结果:', text),
 *   onError: (error) => console.error('错误:', error),
 *   onStart: () => console.log('开始录音'),
 *   onEnd: () => console.log('录音结束')
 * });
 * 
 * recognizer.start(); // 开始识别
 * recognizer.stop();  // 停止识别
 */
export default class SpeechRecognizer {
  /**
   * @param {Object} options 配置项
   * @param {string} [options.lang='zh-CN'] 语言（如 'en-US', 'zh-CN'）
   * @param {boolean} [options.continuous=true] 是否持续识别
   * @param {Function} [options.onResult] 最终识别结果回调
   * @param {Function} [options.onInterimResult] 临时结果回调
   * @param {Function} [options.onError] 错误回调
   * @param {Function} [options.onStart] 开始录音回调
   * @param {Function} [options.onEnd] 录音结束回调
   */
  constructor(options = {}) {
    this.options = {
      lang: 'zh-CN',
      continuous: true,
      ...options
    };

    // 检测浏览器支持
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!this.SpeechRecognition) {
      throw new Error('当前浏览器不支持语音识别（请使用 Chrome/Edge/Safari）');
    }

    this.recognition = null;
    this.isRunning = false;
  }

  /**
   * 初始化识别器
   */
  _initRecognition() {
    if (this.recognition) return;

    this.recognition = new this.SpeechRecognition();
    this.recognition.lang = this.options.lang;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = true;

    // 绑定事件
    this.recognition.onresult = (event) => this._handleResult(event);
    this.recognition.onerror = (event) => this._handleError(event);
    this.recognition.onend = () => {
      this.isRunning = false;
      this.options.onEnd?.();
    };
  }

  /**
   * 处理识别结果
   */
  _handleResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // 触发回调
    if (interimTranscript) this.options.onInterimResult?.(interimTranscript);
    if (finalTranscript) this.options.onResult?.(finalTranscript);
  }

  /**
   * 处理错误
   */
  _handleError(event) {
    this.isRunning = false;
    const errorMap = {
      'not-allowed': '麦克风权限被拒绝',
      'no-speech': '未检测到语音输入',
      'audio-capture': '麦克风采集失败',
      'network': '网络连接问题',
      'bad-grammar': '语法错误',
      'language-not-supported': '不支持的语言'
    };
    const errorMsg = errorMap[event.error] || `语音识别错误: ${event.error}`;
    this.options.onError?.(errorMsg);
  }

  /**
   * 开始语音识别
   * @returns {Promise<void>}
   */
  async start() {
    if (this.isRunning) return;

    try {
      this._initRecognition();
      this.recognition.start();
      this.isRunning = true;
      this.options.onStart?.();
    } catch (error) {
      this._handleError({ error: error.message });
    }
  }

  /**
   * 停止语音识别
   */
  stop() {
    if (!this.isRunning) return;
    this.recognition.stop();
    this.isRunning = false;
  }

  /**
   * 销毁识别器（释放资源）
   */
  destroy() {
    this.stop();
    this.recognition = null;
  }
}