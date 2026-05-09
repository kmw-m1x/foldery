import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]                     = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]               = useState(true);
  const navigate = useNavigate();

  // Check auth on initial load (session restore via cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data.user;
        setUser(userData);
        setIsAuthenticated(true);

        // If flagged, redirect to force-change page
        if (userData.mustChangePassword) {
          navigate('/admin/change-password', { replace: true });
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data.user;
    setUser(userData);
    setIsAuthenticated(true);

    // Redirect based on mustChangePassword flag
    if (userData.mustChangePassword) {
      navigate('/admin/change-password', { replace: true });
    } else {
      navigate('/admin/dashboard');
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);