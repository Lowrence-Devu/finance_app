import io from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket) return;

    this.userId = userId;
    this.socket = io(WS_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.socket.emit('user-join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Register event listeners
    this.socket.on('new-transaction', (data) => {
      this.emitEvent('transaction-created', data);
    });

    this.socket.on('update-transaction', (data) => {
      this.emitEvent('transaction-updated', data);
    });

    this.socket.on('delete-transaction', (data) => {
      this.emitEvent('transaction-deleted', data);
    });

    this.socket.on('users-online', (users) => {
      this.emitEvent('users-online', users);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emitEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        callback(data);
      });
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

export default new WebSocketService();
