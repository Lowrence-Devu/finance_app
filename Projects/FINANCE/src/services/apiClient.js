const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

class APIClient {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: response.statusText };
        }

        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ API request failed:", error.message);
      throw error;
    }
  }

  /* =========================
     👤 USER APIs
  ========================= */

  upsertUser(userData) {
    return this.request("/api/users/upsert", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  getUser(email) {
    return this.request(`/api/users/${email}`);
  }

  getUserProfile() {
    return this.request("/api/users/profile");
  }

  updateUserProfile(data) {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  getUserStats() {
    return this.request("/api/users/stats");
  }

  /* =========================
     💰 TRANSACTION APIs
  ========================= */

  getTransactions(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params
      ? `/api/transactions?${params}`
      : "/api/transactions";

    return this.request(endpoint);
  }

  getTransaction(id) {
    return this.request(`/api/transactions/${id}`);
  }

  createTransaction(data) {
    return this.request("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateTransaction(id, data) {
    return this.request(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteTransaction(id) {
    return this.request(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  }

  getTransactionSummary(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params
      ? `/api/transactions/analytics/summary?${params}`
      : "/api/transactions/analytics/summary";

    return this.request(endpoint);
  }

  getTransactionsByCategory(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params
      ? `/api/transactions/analytics/by-category?${params}`
      : "/api/transactions/analytics/by-category";

    return this.request(endpoint);
  }

  /* =========================
     🧪 HEALTH CHECK
  ========================= */

  checkHealth() {
    return this.request("/api/health");
  }
}

export default new APIClient();