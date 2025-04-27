/* File: src/context/AuthContext.jsx */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => { setToken(null); setUser(null); })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password }
    );
    setToken(data.token);
    setUser(data.user);
    navigate('/dashboard');
  };

  const signup = async (name, email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      { name, email, password }
    );
    setToken(data.token);
    setUser(data.user);
    navigate('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}