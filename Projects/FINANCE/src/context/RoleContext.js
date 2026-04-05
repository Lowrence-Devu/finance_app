import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || 'viewer');

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const toggleRole = () => {
    setRole(prevRole => prevRole === 'admin' ? 'viewer' : 'admin');
  };

  const isAdmin = role === 'admin';
  const isViewer = role === 'viewer';

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isAdmin, isViewer }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
