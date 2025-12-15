import apiClient from './api';

export interface Expert {
  _id: string;
  userId: {
    name: string;
    email: string;
    avatar?: string;
  };
  title: string;
  specialization: string[];
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  availability: any;
  isApproved: boolean;
  isAcceptingClients: boolean;
}

export interface ExpertFilters {
  specialization?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  language?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const expertService = {
  // Get all experts
  getExperts: async (filters?: ExpertFilters) => {
    const response = await apiClient.get('/experts', { params: filters });
    return response.data;
  },

  // Get expert by ID
  getExpertById: async (id: string) => {
    const response = await apiClient.get(`/experts/${id}`);
    return response.data;
  },

  // Get expert by user ID
  getExpertByUserId: async (userId: string) => {
    const response = await apiClient.get(`/experts/user/${userId}`);
    return response.data;
  },

  // Create expert profile
  createExpertProfile: async (data: any) => {
    const response = await apiClient.post('/experts/profile', data);
    return response.data;
  },

  // Update expert profile
  updateExpertProfile: async (data: any) => {
    const response = await apiClient.put('/experts/profile', data);
    return response.data;
  },

  // Update availability
  updateAvailability: async (availability: any) => {
    const response = await apiClient.put('/experts/availability', {
      availability,
    });
    return response.data;
  },

  // Get expert stats
  getExpertStats: async () => {
    const response = await apiClient.get('/experts/stats/me');
    return response.data;
  },

  // Get AI recommendations
  getRecommendations: async (concerns: string[], preferences?: string) => {
    const response = await apiClient.post('/experts/recommendations', {
      concerns,
      preferences,
    });
    return response.data;
  },

  // Get expert availability for a date
  getAvailability: async (expertId: string, date: string) => {
    const response = await apiClient.get('/experts/availability', {
      params: { expertId, date },
    });
    return response.data;
  },

  // Analyze expert profile (AI)
  analyzeProfile: async () => {
    const response = await apiClient.post('/experts/profile/analyze');
    return response.data;
  },
};
