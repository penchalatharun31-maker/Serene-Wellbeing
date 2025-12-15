import apiClient from './api';

export const resourceService = {
  // Get all resources
  getResources: async (params?: {
    type?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/resources', { params });
    return response.data;
  },

  // Get resource by ID
  getResourceById: async (id: string) => {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data;
  },

  // Like resource
  likeResource: async (id: string) => {
    const response = await apiClient.post(`/resources/${id}/like`);
    return response.data;
  },

  // Create resource (admin/expert)
  createResource: async (data: any) => {
    const response = await apiClient.post('/resources', data);
    return response.data;
  },

  // Generate AI content
  generateContent: async (topic: string, type: 'article' | 'tips' | 'guide') => {
    const response = await apiClient.post('/resources/generate/content', {
      topic,
      type,
    });
    return response.data;
  },
};
