import apiClient from './api';

export interface CreatePaymentOrderParams {
  sessionId: string;
  amount: number;
  currency?: string;
  timezone?: string;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PurchaseCreditsParams {
  amount: number;
  credits: number;
  currency?: string;
}

export interface VerifyCreditPurchaseParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  credits: number;
}

export const paymentService = {
  // Create Razorpay order for session payment
  createPaymentOrder: async (
    sessionId: string,
    amount: number,
    currency?: string,
    timezone?: string
  ) => {
    const response = await apiClient.post('/payments/create-order', {
      sessionId,
      amount,
      currency,
      timezone,
    });
    return response.data;
  },

  // Verify Razorpay payment
  verifyPayment: async (params: VerifyPaymentParams) => {
    const response = await apiClient.post('/payments/verify', params);
    return response.data;
  },

  // Purchase credits
  purchaseCredits: async (amount: number, credits: number, currency?: string) => {
    const response = await apiClient.post('/payments/credits/purchase', {
      amount,
      credits,
      currency,
    });
    return response.data;
  },

  // Verify credit purchase
  verifyCreditPurchase: async (params: VerifyCreditPurchaseParams) => {
    const response = await apiClient.post('/payments/credits/verify', params);
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

  // Legacy Stripe methods (deprecated - kept for backward compatibility)
  // TODO: Remove after full migration to Razorpay
  createPaymentIntent: async (sessionId: string, amount: number) => {
    console.warn('createPaymentIntent is deprecated. Use createPaymentOrder instead.');
    return paymentService.createPaymentOrder(sessionId, amount);
  },

  confirmPayment: async (paymentIntentId: string) => {
    console.warn('confirmPayment is deprecated. Use verifyPayment instead.');
    throw new Error('Method not supported. Please use verifyPayment with Razorpay parameters.');
  },

  confirmCreditPurchase: async (paymentIntentId: string) => {
    console.warn('confirmCreditPurchase is deprecated. Use verifyCreditPurchase instead.');
    throw new Error('Method not supported. Please use verifyCreditPurchase with Razorpay parameters.');
  },
};
