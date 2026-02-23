import apiClient from './api';

export const messageService = {
  // Send message
  sendMessage: async (
    receiverId: string,
    content: string,
    type = 'text',
    fileUrl?: string,
    fileName?: string
  ) => {
    const response = await apiClient.post('/messages', {
      receiverId,
      content,
      type,
      fileUrl,
      fileName,
    });
    return response.data;
  },

  // Get conversations
  getConversations: async () => {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  },

  // Get messages with a user
  getMessages: async (userId: string, page = 1, limit = 50) => {
    const response = await apiClient.get(`/messages/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]) => {
    const response = await apiClient.post('/messages/mark-read', {
      messageIds,
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (id: string) => {
    const response = await apiClient.delete(`/messages/${id}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data;
  },
};
