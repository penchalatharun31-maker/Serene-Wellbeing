import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor - Add CSRF token (tokens now sent via httpOnly cookies)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No longer need to manually add Authorization header - cookies are sent automatically
    // with withCredentials: true

    // Add CSRF token for state-changing operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = localStorage.getItem('csrfToken');
      const sessionId = localStorage.getItem('sessionId');

      if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      if (sessionId && config.headers) {
        config.headers['X-Session-Id'] = sessionId;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and store CSRF token
apiClient.interceptors.response.use(
  (response) => {
    // Store CSRF token and session ID from response headers
    const csrfToken = response.headers['x-csrf-token'];
    const sessionId = response.headers['x-session-id'];

    if (csrfToken) {
      localStorage.setItem('csrfToken', csrfToken);
    }
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token using the refresh token cookie
      // The refreshToken is now in an httpOnly cookie, so we just call the endpoint
      try {
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Send the refreshToken cookie
          }
        );

        // If refresh succeeds, retry the original request
        // The new accessToken cookie is automatically set by the server
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear local data and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('sessionId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        status: 0,
      });
    }

    // Handle other errors
    const errorData = error.response?.data as { message?: string } | undefined;
    const errorMessage = errorData?.message || 'An error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
