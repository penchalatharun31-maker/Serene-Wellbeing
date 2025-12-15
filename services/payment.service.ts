import apiClient from './api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (sessionId: string, amount: number) => {
    const response = await apiClient.post('/payments/create-intent', {
      sessionId,
      amount,
    });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string) => {
    const response = await apiClient.post('/payments/confirm', {
      paymentIntentId,
    });
    return response.data;
  },

  // Purchase credits
  purchaseCredits: async (amount: number, credits: number) => {
    const response = await apiClient.post('/payments/credits/purchase', {
      amount,
      credits,
    });
    return response.data;
  },

  // Confirm credit purchase
  confirmCreditPurchase: async (paymentIntentId: string) => {
    const response = await apiClient.post('/payments/credits/confirm', {
      paymentIntentId,
    });
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/payments/history', {
      params: { page, limit },
    });
    return response.data;
  },

  // Request refund
  requestRefund: async (sessionId: string, reason: string) => {
    const response = await apiClient.post('/payments/refund', {
      sessionId,
      reason,
    });
    return response.data;
  },
};
