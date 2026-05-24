import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('sems_token');
    const storedUser = localStorage.getItem('sems_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        initSocket(storedToken);
      } catch {
        localStorage.removeItem('sems_token');
        localStorage.removeItem('sems_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('sems_token', authToken);
    localStorage.setItem('sems_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    initSocket(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sems_token');
    localStorage.removeItem('sems_user');
    setToken(null);
    setUser(null);
    disconnectSocket();
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('sems_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
