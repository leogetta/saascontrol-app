import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { User, Company, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; companyName: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data.user);
      setCompany(response.data.company);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const data: AuthResponse = response.data;
    
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setCompany(data.company);
  };

  const register = async (formData: { email: string; password: string; name: string; companyName: string }) => {
    const response = await authAPI.register({ ...formData, employeesCount: 25 });
    const data: AuthResponse = response.data;
    
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setCompany(data.company);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider value={{ user, company, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};