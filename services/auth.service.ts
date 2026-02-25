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
  // Note: tokens are no longer in response body, they're sent as httpOnly cookies
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
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    // Cookies are cleared by the server
    localStorage.removeItem('user');
    localStorage.removeItem('csrfToken');
    localStorage.removeItem('sessionId');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
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
