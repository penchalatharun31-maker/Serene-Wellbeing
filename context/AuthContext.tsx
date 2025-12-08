import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: User['role']) => void;
  signup: (name: string, email: string, role: User['role']) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Mock persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('serene_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, role: User['role']) => {
    // Mock login logic - in a real app this would call an API
    const newUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    };
    setUser(newUser);
    localStorage.setItem('serene_user', JSON.stringify(newUser));
    navigate(`/dashboard/${role}`);
  };

  const signup = (name: string, email: string, role: User['role']) => {
    // Mock signup logic
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: 'https://via.placeholder.com/150'
    };
    setUser(newUser);
    localStorage.setItem('serene_user', JSON.stringify(newUser));
    navigate(`/dashboard/${role}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('serene_user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};