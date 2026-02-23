import apiClient from './api';

export const analyticsService = {
  // Get user analytics
  getUserAnalytics: async (period = '30d') => {
    const response = await apiClient.get('/analytics/user', {
      params: { period },
    });
    return response.data;
  },

  // Get expert analytics
  getExpertAnalytics: async (period = '30d') => {
    const response = await apiClient.get('/analytics/expert', {
      params: { period },
    });
    return response.data;
  },

  // Get platform analytics (admin)
  getPlatformAnalytics: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get('/analytics/platform', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
