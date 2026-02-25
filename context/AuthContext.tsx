import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, noNavigate?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: User['role'], country?: string, currency?: string, noNavigate?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user from backend on mount (tokens are in httpOnly cookies)
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');

      // If we have a stored user, try to verify with backend
      if (storedUser) {
        try {
          // Verify auth with backend using the httpOnly cookie
          const response = await authService.getCurrentUser();
          setUser(response.user);
        } catch (err) {
          // Auth failed (cookie expired/invalid), clear storage
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // No stored user, but let's check if we have valid cookies
        try {
          const response = await authService.getCurrentUser();
          setUser(response.user);
          // Store user info in localStorage for quick access
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err) {
          // No valid auth, continue as guest
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, noNavigate: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response: AuthResponse = await authService.login({ email, password });

      // No need to store tokens - they're in httpOnly cookies
      // Only store user info for quick access
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update state
      setUser(response.user as any);

      if (!noNavigate) {
        navigate(`/dashboard/${response.user.role}`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: User['role'] = 'user',
    country?: string,
    currency?: string,
    noNavigate: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response: AuthResponse = await authService.register({
        name,
        email,
        password,
        role,
        country,
        currency,
      });

      // No need to store tokens - they're in httpOnly cookies
      // Only store user info for quick access
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update state
      setUser(response.user as any);

      if (!noNavigate) {
        navigate(`/dashboard/${response.user.role}`);
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (clears httpOnly cookies on server)
      await authService.logout();
    } catch (err) {
      // Continue with local logout even if API call fails
      console.error('Logout error:', err);
    } finally {
      // Clear local state
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('sessionId');
      // Use replace to prevent back button from going to authenticated pages
      navigate('/', { replace: true });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
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
