import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import websocketService from '../services/websocketService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [error, setError] = useState(null);

  // Login/register with backend API
  const login = async (userData) => {
    try {
      setError(null);
      const response = await apiClient.upsertUser(userData);
      
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userId', response.user._id);
        
        // Connect WebSocket
        websocketService.connect(response.user._id);
        
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.error || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      console.error('Login error:', err);
      return { success: false, error: errorMsg };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    websocketService.disconnect();
  };

  // Verify token and restore session
  const verifySession = async () => {
    if (token) {
      try {
        const userProfile = await apiClient.getUserProfile();
        if (userProfile && userProfile.success) {
          setUser(userProfile);
          websocketService.connect(userProfile._id);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        logout();
      }
    }
    setLoading(false);
  };

  // Auto-login on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Verify session in background
      verifySession();
    } else {
      setLoading(false);
    }
  }, []);

  // Persist theme and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Apply theme to body for smooth transitions
    if (theme === 'dark') {
      document.body.style.background = '#0f1117';
      document.body.style.color = '#e4e9f0';
    } else {
      document.body.style.background = '#f8f9fc';
      document.body.style.color = '#1a1a2e';
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, theme, setTheme, toggleTheme, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
