import { io } from "socket.io-client";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.listeners = new Map();
  }

  connect(userId) {
    // ✅ Prevent duplicate connections
    if (this.socket?.connected) return;

    this.userId = userId;

    this.socket = io(BASE_URL, {
      transports: ["websocket"], // 🔥 important for production
      auth: {
        token: localStorage.getItem("token"),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      this.socket.emit("user-join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // ✅ Events
    this.socket.on("new-transaction", (data) => {
      this.emitEvent("transaction-created", data);
    });

    this.socket.on("update-transaction", (data) => {
      this.emitEvent("transaction-updated", data);
    });

    this.socket.on("delete-transaction", (data) => {
      this.emitEvent("transaction-deleted", data);
    });

    this.socket.on("users-online", (users) => {
      this.emitEvent("users-online", users);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 WebSocket manually disconnected");
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
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
      this.listeners.set(
        event,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }

  emitEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();