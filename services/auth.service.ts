import apiClient from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'expert' | 'company' | 'super_admin';
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  currency?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'expert' | 'company' | 'super_admin';
    avatar?: string;
    credits: number;
    isVerified: boolean;
    country?: string;
    currency?: string;
  };
}

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      // Mock register for development purposes if backend is down
      if (error.status === 0 || error.message?.includes('Network error')) {
        console.warn('Backend unreachable, using mock register for development');

        return {
          success: true,
          token: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: {
            id: 'mock-user-id',
            name: data.name,
            email: data.email,
            role: data.role || 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
            credits: 0,
            isVerified: true,
            country: data.country,
            currency: data.currency,
          }
        };
      }
      throw error;
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Mock login for development purposes if backend is down
      if (error.status === 0 || error.message?.includes('Network error')) {
        console.warn('Backend unreachable, using mock login for development');

        // Return a mock expert user for testing
        return {
          success: true,
          token: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: {
            id: 'mock-expert-id',
            name: 'Dr. Jane Smith (Mock)',
            email: credentials.email,
            role: 'expert',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert',
            credits: 100,
            isVerified: true,
          }
        };
      }
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.status === 0 || error.message?.includes('Network error')) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          return { success: true, user: JSON.parse(storedUser) };
        }
      }
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: {
    notifications?: boolean;
    emailUpdates?: boolean;
    language?: string;
  }) => {
    const response = await apiClient.put('/auth/preferences', preferences);
    return response.data;
  },
};
