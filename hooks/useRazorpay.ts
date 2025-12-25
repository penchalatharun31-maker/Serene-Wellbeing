import { useState, useEffect, useCallback } from 'react';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface UseRazorpayReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  openCheckout: (options: RazorpayOptions) => void;
}

/**
 * Custom hook to load and use Razorpay
 */
export const useRazorpay = (): UseRazorpayReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('Failed to load Razorpay SDK');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      // Only remove if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openCheckout = useCallback(
    (options: RazorpayOptions) => {
      if (!isLoaded) {
        console.error('Razorpay SDK not loaded yet');
        return;
      }

      if (!window.Razorpay) {
        console.error('Razorpay is not available');
        return;
      }

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err: any) {
        console.error('Failed to open Razorpay checkout:', err);
        setError(err.message || 'Failed to open payment checkout');
      }
    },
    [isLoaded]
  );

  return {
    isLoaded,
    isLoading,
    error,
    openCheckout,
  };
};

/**
 * Hook for session payment with Razorpay
 */
export interface SessionPaymentOptions {
  sessionId: string;
  amount: number;
  currency?: string;
  timezone?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: any) => void;
}

export const useSessionPayment = () => {
  const { isLoaded, isLoading, error: razorpayError, openCheckout } = useRazorpay();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (options: SessionPaymentOptions) => {
      if (!isLoaded) {
        setError('Payment system not ready. Please refresh the page.');
        return;
      }

      try {
        setProcessing(true);
        setError(null);

        // Get Razorpay key from environment
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          throw new Error('Payment configuration missing');
        }

        // Import payment service dynamically to avoid circular dependency
        const { paymentService } = await import('../services/payment.service');

        // Create Razorpay order
        const orderData = await paymentService.createPaymentOrder(
          options.sessionId,
          options.amount,
          options.currency,
          options.timezone
        );

        // Open Razorpay checkout
        openCheckout({
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Serene Wellbeing Hub',
          description: 'Session Booking Payment',
          order_id: orderData.orderId,
          theme: {
            color: '#3b82f6',
          },
          handler: (response: RazorpayResponse) => {
            options.onSuccess(response);
            setProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              if (options.onFailure) {
                options.onFailure(new Error('Payment cancelled by user'));
              }
            },
          },
        });
      } catch (err: any) {
        console.error('Payment initiation failed:', err);
        setError(err.message || 'Failed to initiate payment');
        setProcessing(false);
        if (options.onFailure) {
          options.onFailure(err);
        }
      }
    },
    [isLoaded, openCheckout]
  );

  return {
    isLoaded,
    isLoading: isLoading || processing,
    error: error || razorpayError,
    initiatePayment,
  };
};

/**
 * Hook for credit purchase with Razorpay
 */
export interface CreditPurchaseOptions {
  amount: number;
  credits: number;
  currency?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: any) => void;
}

export const useCreditPurchase = () => {
  const { isLoaded, isLoading, error: razorpayError, openCheckout } = useRazorpay();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseCredits = useCallback(
    async (options: CreditPurchaseOptions) => {
      if (!isLoaded) {
        setError('Payment system not ready. Please refresh the page.');
        return;
      }

      try {
        setProcessing(true);
        setError(null);

        // Get Razorpay key from environment
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          throw new Error('Payment configuration missing');
        }

        // Import payment service dynamically
        const { paymentService } = await import('../services/payment.service');

        // Create Razorpay order for credit purchase
        const orderData = await paymentService.purchaseCredits(
          options.amount,
          options.credits,
          options.currency
        );

        // Open Razorpay checkout
        openCheckout({
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Serene Wellbeing Hub',
          description: `Purchase ${options.credits} Credits`,
          order_id: orderData.orderId,
          theme: {
            color: '#3b82f6',
          },
          handler: (response: RazorpayResponse) => {
            options.onSuccess(response);
            setProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              if (options.onFailure) {
                options.onFailure(new Error('Payment cancelled by user'));
              }
            },
          },
        });
      } catch (err: any) {
        console.error('Credit purchase failed:', err);
        setError(err.message || 'Failed to purchase credits');
        setProcessing(false);
        if (options.onFailure) {
          options.onFailure(err);
        }
      }
    },
    [isLoaded, openCheckout]
  );

  return {
    isLoaded,
    isLoading: isLoading || processing,
    error: error || razorpayError,
    purchaseCredits,
  };
};
