import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Stores auth token and (optional) user profile/basic info if backend returns it.
   * If backend doesn't return user, we still store token to access protected endpoints.
   */
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('dt_token'); } catch { return null; }
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('dt_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('dt_token', token);
      else localStorage.removeItem('dt_token');
    } catch {}
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('dt_user', JSON.stringify(user));
      else localStorage.removeItem('dt_user');
    } catch {}
  }, [user]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await api.login({ email, password });
      // Expecting { token, user? }
      if (result?.token) setToken(result.token);
      if (result?.user) setUser(result.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await api.register({ name, email, password });
      // Some backends auto-login after register, some don't. If token present, store it.
      if (result?.token) setToken(result.token);
      if (result?.user) setUser(result.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    token, user, loading, login, register, logout, setUser,
    isAuthenticated: !!token,
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
