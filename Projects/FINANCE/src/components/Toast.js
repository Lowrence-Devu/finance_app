import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => {
    switch (props.type) {
      case 'error': return '#fee';
      case 'success': return '#efe';
      case 'warning': return '#ffe';
      case 'info': return '#eef';
      default: return '#f5f5f5';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'error': return '#c33';
      case 'success': return '#3c3';
      case 'warning': return '#cc3';
      case 'info': return '#33c';
      default: return '#999';
    }
  }};
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 9999;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  float: right;

  &:hover {
    color: #333;
  }
`;

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <ToastContainer
      type={type}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <CloseButton onClick={() => onClose(id)}>×</CloseButton>
      <div>{message}</div>
    </ToastContainer>
  );
};

const ToastListContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
`;

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastListContainer>
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </ToastListContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
