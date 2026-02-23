import apiClient from './api';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  featuredImage: string;
  imageAlt: string;
  status: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
}

export interface Category {
  name: string;
  count: number;
}

export interface Tag {
  name: string;
  count: number;
}

export const blogService = {
  // Get all blog posts
  getAllPosts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sort?: string;
  }): Promise<BlogListResponse> => {
    const response = await apiClient.get('/blog', { params });
    return response.data;
  },

  // Get single blog post by slug
  getPostBySlug: async (slug: string): Promise<BlogPostResponse> => {
    const response = await apiClient.get(`/blog/${slug}`);
    return response.data;
  },

  // Get popular posts
  getPopularPosts: async (limit = 5): Promise<BlogListResponse> => {
    const response = await apiClient.get('/blog/popular', {
      params: { limit },
    });
    return response.data;
  },

  // Get recent posts
  getRecentPosts: async (limit = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get('/blog/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Get posts by category
  getPostsByCategory: async (
    category: string,
    limit = 10
  ): Promise<BlogListResponse> => {
    const response = await apiClient.get(`/blog/category/${category}`, {
      params: { limit },
    });
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiClient.get('/blog/categories');
    return response.data;
  },

  // Get all tags
  getTags: async (): Promise<{ success: boolean; data: Tag[] }> => {
    const response = await apiClient.get('/blog/tags');
    return response.data;
  },

  // Like a post
  likePost: async (id: string) => {
    const response = await apiClient.post(`/blog/${id}/like`);
    return response.data;
  },

  // Create blog post (Admin only)
  createPost: async (postData: Partial<BlogPost>) => {
    const response = await apiClient.post('/blog', postData);
    return response.data;
  },

  // Update blog post (Admin only)
  updatePost: async (id: string, postData: Partial<BlogPost>) => {
    const response = await apiClient.put(`/blog/${id}`, postData);
    return response.data;
  },

  // Delete blog post (Admin only)
  deletePost: async (id: string) => {
    const response = await apiClient.delete(`/blog/${id}`);
    return response.data;
  },
};
