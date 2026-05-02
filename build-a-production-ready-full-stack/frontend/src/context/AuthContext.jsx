import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ttm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ttm_token'));

  const persistSession = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('ttm_user', JSON.stringify(payload.user));
    localStorage.setItem('ttm_token', payload.token);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persistSession(data);
  };

  const signup = async (values) => {
    const { data } = await api.post('/auth/register', values);
    persistSession(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ttm_user');
    localStorage.removeItem('ttm_token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
