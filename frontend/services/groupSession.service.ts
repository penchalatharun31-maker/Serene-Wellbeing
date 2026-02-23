import apiClient from './api';

export const groupSessionService = {
  // Get all group sessions
  getGroupSessions: async (params?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/group-sessions', { params });
    return response.data;
  },

  // Get group session by ID
  getGroupSessionById: async (id: string) => {
    const response = await apiClient.get(`/group-sessions/${id}`);
    return response.data;
  },

  // Create group session (expert)
  createGroupSession: async (data: any) => {
    const response = await apiClient.post('/group-sessions', data);
    return response.data;
  },

  // Update group session (expert)
  updateGroupSession: async (id: string, data: any) => {
    const response = await apiClient.put(`/group-sessions/${id}`, data);
    return response.data;
  },

  // Join group session
  joinGroupSession: async (id: string) => {
    const response = await apiClient.post(`/group-sessions/${id}/join`);
    return response.data;
  },

  // Leave group session
  leaveGroupSession: async (id: string) => {
    const response = await apiClient.post(`/group-sessions/${id}/leave`);
    return response.data;
  },

  // Cancel group session (expert)
  cancelGroupSession: async (id: string) => {
    const response = await apiClient.post(`/group-sessions/${id}/cancel`);
    return response.data;
  },

  // Get expert's group sessions
  getExpertGroupSessions: async () => {
    const response = await apiClient.get('/group-sessions/expert/all');
    return response.data;
  },
};
