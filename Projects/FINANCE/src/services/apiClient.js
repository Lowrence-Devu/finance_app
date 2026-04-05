const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class APIClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async upsertUser(userData) {
    return this.request('/api/users/upsert', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(email) {
    return this.request(`/api/users/${email}`, { method: 'GET' });
  }

  async getUserProfile() {
    return this.request('/api/users/profile', { method: 'GET' });
  }

  async updateUserProfile(profileData) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats() {
    return this.request('/api/users/stats', { method: 'GET' });
  }

  // Transaction endpoints
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transactions?${queryString}` : '/api/transactions';
    return this.request(endpoint, { method: 'GET' });
  }

  async getTransaction(id) {
    return this.request(`/api/transactions/${id}`, { method: 'GET' });
  }

  async createTransaction(transactionData) {
    return this.request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id, transactionData) {
    return this.request(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id) {
    return this.request(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionSummary(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transactions/analytics/summary?${queryString}` : '/api/transactions/analytics/summary';
    return this.request(endpoint, { method: 'GET' });
  }

  async getTransactionsByCategory(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transactions/analytics/by-category?${queryString}` : '/api/transactions/analytics/by-category';
    return this.request(endpoint, { method: 'GET' });
  }

  async checkHealth() {
    return this.request('/api/health', { method: 'GET' });
  }
}

export default new APIClient();
