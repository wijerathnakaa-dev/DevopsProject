import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  getStoredUser,
  getStoredToken,
  setStoredUser
} from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser() || {
    id: 1,
    name: 'Kavindu Wijerathna',
    email: 'customer@chaceylon.lk',
    role: 'customer'
  });
  const [token, setToken] = useState(() => getStoredToken() || 'demo_token');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync state if user changes in localStorage
  useEffect(() => {
    const existing = getStoredUser();
    if (existing) setUser(existing);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await registerUser({ name, email, password });
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
  };

  // Quick switch role for testing Admin vs Customer in lab evaluation
  const toggleRole = () => {
    if (!user) {
      const demoAdmin = { id: 99, name: 'Admin Manager', email: 'admin@chaceylon.lk', role: 'admin' };
      setUser(demoAdmin);
      setStoredUser(demoAdmin);
      return;
    }
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const updated = { ...user, role: newRole, name: newRole === 'admin' ? 'Admin Manager' : 'ChaCeylon Customer' };
    setUser(updated);
    setStoredUser(updated);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        toggleRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
