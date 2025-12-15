import apiClient from './api';

export interface CreateSessionData {
  expertId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  notes?: string;
  useCredits?: boolean;
}

export const sessionService = {
  // Create a new session booking
  createSession: async (data: CreateSessionData) => {
    const response = await apiClient.post('/sessions', data);
    return response.data;
  },

  // Get user's sessions
  getUserSessions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/sessions/user/all', { params });
    return response.data;
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    const response = await apiClient.get('/sessions/user/upcoming');
    return response.data;
  },

  // Get expert's sessions
  getExpertSessions: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/sessions/expert/all', { params });
    return response.data;
  },

  // Get session by ID
  getSessionById: async (id: string) => {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },

  // Update session (expert only)
  updateSession: async (id: string, data: any) => {
    const response = await apiClient.put(`/sessions/${id}`, data);
    return response.data;
  },

  // Cancel session
  cancelSession: async (id: string, cancelReason: string) => {
    const response = await apiClient.post(`/sessions/${id}/cancel`, {
      cancelReason,
    });
    return response.data;
  },

  // Rate session
  rateSession: async (id: string, rating: number, review?: string) => {
    const response = await apiClient.post(`/sessions/${id}/rate`, {
      rating,
      review,
    });
    return response.data;
  },
};
