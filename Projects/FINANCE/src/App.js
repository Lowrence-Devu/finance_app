import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Register from './pages/Register';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { ToastProvider } from './components/Toast';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AnimatedRoutes({ showSplash, setShowSplash }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate('/dashboard');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [user, loading, showSplash, setShowSplash, navigate]);

  if (user && showSplash) {
    return <SplashScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/" element={
          <RequireAuth>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
              <Home />
            </motion.div>
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
              <Dashboard />
            </motion.div>
          </RequireAuth>
        } />
        <Route path="/profile" element={
          <RequireAuth>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
              <Profile />
            </motion.div>
          </RequireAuth>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function ConditionalNavbar() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <Navbar />;
}

function SplashRoutes() {
  const [showSplash, setShowSplash] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      setShowSplash(true);
    }
  }, [user, loading]);

  return <AnimatedRoutes showSplash={showSplash} setShowSplash={setShowSplash} />;
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <ConditionalNavbar />
              <div style={{ paddingTop: '68px' }}>
                <SplashRoutes />
              </div>
            </Router>
          </RoleProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
