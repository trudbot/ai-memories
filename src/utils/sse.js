/**
 * SSE连接管理单例类
 * 用于管理Server-Sent Events连接的创建、维护和销毁
 */
class SSEManager {
  constructor() {
    this.connections = new Map(); // 存储多个连接
    this.reconnectAttempts = new Map(); // 重连尝试次数
    this.maxReconnectAttempts = 5; // 最大重连次数
    this.reconnectDelay = 1000; // 重连延迟(ms)
    this.heartbeatInterval = 30000; // 心跳间隔(ms)
    this.heartbeatTimers = new Map(); // 心跳定时器
  }

  /**
   * 创建SSE连接
   * @param {string} url - SSE服务端点URL
   * @param {string} connectionId - 连接标识符
   * @param {Object} options - 配置选项
   * @returns {EventSource} EventSource实例
   */
  createConnection(url, connectionId = 'default', options = {}) {
    // 如果连接已存在，先关闭旧连接
    if (this.connections.has(connectionId)) {
      this.closeConnection(connectionId);
    }

    const {
      withCredentials = false,
      headers = {},
      onOpen = null,
      onMessage = null,
      onError = null,
      onClose = null,
      autoReconnect = true
    } = options;

    try {
      // 创建EventSource实例
      const eventSource = new EventSource(url, { withCredentials });
      
      // 定义事件处理函数
      const openHandler = (event) => {
        console.log(`SSE连接 ${connectionId} 已建立:`, event);
        this.reconnectAttempts.set(connectionId, 0); // 重置重连次数
        this.startHeartbeat(connectionId);
        
        if (onOpen) onOpen(event);
      };

      const messageHandler = (event) => {
        console.log(`SSE消息 ${connectionId}:`, event.data);
        
        // 处理心跳消息
        if (event.data === 'heartbeat' || event.data === 'ping') {
          this.handleHeartbeat(connectionId);
          return;
        }
        
        if (onMessage) onMessage(event);
      };

      const errorHandler = (event) => {
        console.error(`SSE连接 ${connectionId} 错误:`, event);
        this.stopHeartbeat(connectionId);
        
        if (onError) onError(event);
        
        // 自动重连逻辑
        if (autoReconnect && eventSource.readyState === EventSource.CLOSED) {
          this.handleReconnect(url, connectionId, options);
        }
      };

      // 添加事件监听器
      eventSource.addEventListener('open', openHandler);
      eventSource.addEventListener('message', messageHandler);
      eventSource.addEventListener('error', errorHandler);

      // 存储连接实例和配置
      this.connections.set(connectionId, {
        eventSource,
        url,
        options,
        createdAt: new Date(),
        lastHeartbeat: new Date(),
        // 存储事件处理函数引用，用于后续移除
        handlers: {
          open: openHandler,
          message: messageHandler,
          error: errorHandler
        }
      });

      return eventSource;

    } catch (error) {
      console.error(`创建SSE连接 ${connectionId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取连接实例
   * @param {string} connectionId - 连接标识符
   * @returns {EventSource|null} EventSource实例或null
   */
  getConnection(connectionId = 'default') {
    const connection = this.connections.get(connectionId);
    return connection ? connection.eventSource : null;
  }

  /**
   * 获取连接状态
   * @param {string} connectionId - 连接标识符
   * @returns {number|null} 连接状态或null
   */
  getConnectionState(connectionId = 'default') {
    const eventSource = this.getConnection(connectionId);
    return eventSource ? eventSource.readyState : null;
  }

  /**
   * 检查连接是否活跃
   * @param {string} connectionId - 连接标识符
   * @returns {boolean} 是否活跃
   */
  isConnectionActive(connectionId = 'default') {
    const state = this.getConnectionState(connectionId);
    return state === EventSource.OPEN;
  }

  /**
   * 关闭指定连接
   * @param {string} connectionId - 连接标识符
   */
  closeConnection(connectionId = 'default') {
    const connection = this.connections.get(connectionId);
    if (connection) {
      const { eventSource, handlers } = connection;
      
      // 移除所有事件监听器
      if (handlers) {
        eventSource.removeEventListener('open', handlers.open);
        eventSource.removeEventListener('message', handlers.message);
        eventSource.removeEventListener('error', handlers.error);
      }
      
      eventSource.close();
      this.stopHeartbeat(connectionId);
      this.connections.delete(connectionId);
      this.reconnectAttempts.delete(connectionId);
      console.log(`SSE连接 ${connectionId} 已关闭`);
    }
  }

  /**
   * 关闭所有连接
   */
  closeAllConnections() {
    for (const connectionId of this.connections.keys()) {
      this.closeConnection(connectionId);
    }
  }

  /**
   * 处理重连逻辑
   * @param {string} url - SSE服务端点URL
   * @param {string} connectionId - 连接标识符
   * @param {Object} options - 配置选项
   */
  handleReconnect(url, connectionId, options) {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`SSE连接 ${connectionId} 重连次数已达上限`);
      this.closeConnection(connectionId);
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts); // 指数退避
    console.log(`SSE连接 ${connectionId} 将在 ${delay}ms 后重连 (第${attempts + 1}次)`);

    setTimeout(() => {
      this.reconnectAttempts.set(connectionId, attempts + 1);
      this.createConnection(url, connectionId, options);
    }, delay);
  }

  /**
   * 开始心跳检测
   * @param {string} connectionId - 连接标识符
   */
  startHeartbeat(connectionId) {
    this.stopHeartbeat(connectionId); // 清除现有定时器
    
    const timer = setInterval(() => {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        this.stopHeartbeat(connectionId);
        return;
      }

      const now = new Date();
      const lastHeartbeat = connection.lastHeartbeat;
      const timeDiff = now - lastHeartbeat;

      // 如果超过2倍心跳间隔没有收到心跳，认为连接异常
      if (timeDiff > this.heartbeatInterval * 2) {
        console.warn(`SSE连接 ${connectionId} 心跳超时，尝试重连`);
        this.closeConnection(connectionId);
        
        // 触发重连
        if (connection.options.autoReconnect !== false) {
          this.handleReconnect(connection.url, connectionId, connection.options);
        }
      }
    }, this.heartbeatInterval);

    this.heartbeatTimers.set(connectionId, timer);
  }

  /**
   * 停止心跳检测
   * @param {string} connectionId - 连接标识符
   */
  stopHeartbeat(connectionId) {
    const timer = this.heartbeatTimers.get(connectionId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(connectionId);
    }
  }

  /**
   * 处理心跳消息
   * @param {string} connectionId - 连接标识符
   */
  handleHeartbeat(connectionId) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.lastHeartbeat = new Date();
    }
  }

  /**
   * 添加自定义事件监听器
   * @param {string} connectionId - 连接标识符
   * @param {string} eventType - 事件类型
   * @param {Function} handler - 事件处理函数
   */
  addEventListener(connectionId, eventType, handler) {
    const eventSource = this.getConnection(connectionId);
    if (eventSource) {
      eventSource.addEventListener(eventType, handler);
    }
  }

  /**
   * 移除自定义事件监听器
   * @param {string} connectionId - 连接标识符
   * @param {string} eventType - 事件类型
   * @param {Function} handler - 事件处理函数
   */
  removeEventListener(connectionId, eventType, handler) {
    const eventSource = this.getConnection(connectionId);
    if (eventSource) {
      eventSource.removeEventListener(eventType, handler);
    }
  }

  /**
   * 获取所有连接的状态信息
   * @returns {Object} 连接状态信息
   */
  getConnectionsStatus() {
    const status = {};
    for (const [connectionId, connection] of this.connections) {
      status[connectionId] = {
        state: connection.eventSource.readyState,
        stateText: this.getStateText(connection.eventSource.readyState),
        url: connection.url,
        createdAt: connection.createdAt,
        lastHeartbeat: connection.lastHeartbeat,
        reconnectAttempts: this.reconnectAttempts.get(connectionId) || 0
      };
    }
    return status;
  }

  /**
   * 获取连接状态文本描述
   * @param {number} state - 连接状态码
   * @returns {string} 状态文本
   */
  getStateText(state) {
    switch (state) {
      case EventSource.CONNECTING: return 'CONNECTING';
      case EventSource.OPEN: return 'OPEN';
      case EventSource.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }

  /**
   * 设置配置选项
   * @param {Object} config - 配置对象
   */
  setConfig(config) {
    if (config.maxReconnectAttempts !== undefined) {
      this.maxReconnectAttempts = config.maxReconnectAttempts;
    }
    if (config.reconnectDelay !== undefined) {
      this.reconnectDelay = config.reconnectDelay;
    }
    if (config.heartbeatInterval !== undefined) {
      this.heartbeatInterval = config.heartbeatInterval;
    }
  }
}

// 创建单例实例
const sseManager = new SSEManager();

// 导出单例实例和类
export default sseManager;
export { SSEManager };


/**
import sseManager from '@/utils/sse.js';

// 创建连接
sseManager.createConnection('http://localhost:3000/sse', 'chat', {
  onMessage: (event) => {
    console.log('收到消息:', event.data);
  },
  onError: (error) => {
    console.error('连接错误:', error);
  },
  autoReconnect: true
});

// 检查连接状态
if (sseManager.isConnectionActive('chat')) {
  console.log('聊天连接正常');
}

// 添加自定义事件监听
sseManager.addEventListener('chat', 'user-joined', (event) => {
  console.log('用户加入:', JSON.parse(event.data));
});

// 获取连接状态报告
console.log(sseManager.getConnectionsStatus());

// 关闭连接
sseManager.closeConnection('chat');
 */
