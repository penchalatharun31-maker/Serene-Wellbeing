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

  // New Profile Completeness & B2B Fields
  profilePhoto?: string;
  qualifications?: string[];
  specializations?: string[];
  sessionRate?: number;
  calLink?: string;
  bankDetails?: string;
  panNumber?: string;
  videoIntro?: string;
  personalStory?: string;
  clientSuccessStories?: string[];
  communicationStyle?: string;
  populationsServed?: string[];
  therapeuticApproaches?: string[];
  firstSessionPreview?: string;
  signatureApproach?: string;
  corporateExperience?: number;
  workshopTopics?: string[];
  certifications?: string[];
  bgvCompleted?: boolean;
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

  calculateProfileCompleteness: (expert: any) => {
    const weights: Record<string, number> = {
      // Required (40%)
      profilePhoto: 5,
      qualifications: 5,
      specializations: 5,
      about: 5,
      price: 5,
      calLink: 5,
      bankDetails: 5,
      panNumber: 5,

      // High Impact (35%)
      videoIntroUrl: 15,
      personalStory: 10,
      clientSuccessStories: 10,

      // Matching Quality (15%)
      personalityProfile: 9, // Subdivided if needed, but let's count the object
      populationsServed: 3,
      therapeuticApproaches: 3,

      // B2B Bonus (10%)
      corporateExperience: 3,
      workshopTopics: 2,
      certifications: 3,
      bgvCompleted: 2,
    };

    let score = 0;
    let maxScore = 0;

    const isEmpty = (val: any) => {
      if (val === null || val === undefined) return true;
      if (typeof val === 'string') return val.trim().length === 0;
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === 'object') return Object.keys(val).length === 0;
      return false;
    };

    for (const [field, weight] of Object.entries(weights)) {
      maxScore += weight;
      if (expert[field] && !isEmpty(expert[field])) {
        score += weight;
      }
    }

    const percentage = Math.round((score / maxScore) * 100);
    let message = "";

    if (percentage < 50) {
      message = "Complete your profile to start receiving bookings";
    } else if (percentage < 75) {
      message = "Add a video intro to get 3x more bookings!";
    } else if (percentage < 90) {
      message = "Almost there! Add success stories for maximum visibility";
    } else {
      message = "🌟 Profile complete! You're all set for bookings";
    }

    return { percentage, message };
  }
};
