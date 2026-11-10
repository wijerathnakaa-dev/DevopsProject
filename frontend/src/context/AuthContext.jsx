import { createContext, useContext, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredUser,
  getStoredToken
} from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser() || null);
  const [token, setToken] = useState(() => getStoredToken() || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

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
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
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
        logout
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
