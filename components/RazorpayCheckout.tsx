import React, { useState, useEffect } from 'react';
import { useSessionPayment, useCreditPurchase, RazorpayResponse } from '../hooks/useRazorpay';
import { CurrencySelector, CurrencyDisplay } from './CurrencySelector';
import { TimezoneSelector } from './TimezoneSelector';
import { getDefaultCurrency } from '../utils/currency';
import { getDefaultTimezone } from '../utils/timezone';
import { Button } from './UI';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

interface SessionCheckoutProps {
  sessionId: string;
  amount: number;
  expertName: string;
  sessionDate?: string;
  sessionTime?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onCancel?: () => void;
  showCurrencySelector?: boolean;
  showTimezoneSelector?: boolean;
}

export const SessionCheckout: React.FC<SessionCheckoutProps> = ({
  sessionId,
  amount,
  expertName,
  sessionDate,
  sessionTime,
  onSuccess,
  onCancel,
  showCurrencySelector = true,
  showTimezoneSelector = true,
}) => {
  const [currency, setCurrency] = useState(getDefaultCurrency());
  const [timezone, setTimezone] = useState(getDefaultTimezone());

  const { isLoaded, isLoading, error, initiatePayment } = useSessionPayment();

  const handlePayment = () => {
    initiatePayment({
      sessionId,
      amount,
      currency,
      timezone,
      onSuccess: (response) => {
        onSuccess(response);
      },
      onFailure: (error) => {
        console.error('Payment failed:', error);
      },
    });
  };

  if (!isLoaded && isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Loading payment system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Session with</span>
          <span className="font-medium text-gray-900">{expertName}</span>
        </div>

        {sessionDate && sessionTime && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-medium text-gray-900">
              {sessionDate}, {sessionTime}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-emerald-600">
            <CurrencyDisplay amount={amount} currency={currency} />
          </span>
        </div>
      </div>

      {showCurrencySelector && (
        <CurrencySelector
          value={currency}
          onChange={setCurrency}
          label="Select Currency"
        />
      )}

      {showTimezoneSelector && (
        <TimezoneSelector
          value={timezone}
          onChange={setTimezone}
          label="Your Timezone"
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Secure Payment</p>
            <p>You'll be redirected to Razorpay's secure checkout to complete your payment.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay <CurrencyDisplay amount={amount} currency={currency} />
            </>
          )}
        </Button>

        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

interface CreditCheckoutProps {
  amount: number;
  credits: number;
  onSuccess: (response: RazorpayResponse) => void;
  onCancel?: () => void;
  showCurrencySelector?: boolean;
}

export const CreditCheckout: React.FC<CreditCheckoutProps> = ({
  amount,
  credits,
  onSuccess,
  onCancel,
  showCurrencySelector = true,
}) => {
  const [currency, setCurrency] = useState(getDefaultCurrency());

  const { isLoaded, isLoading, error, purchaseCredits } = useCreditPurchase();

  const handlePayment = () => {
    purchaseCredits({
      amount,
      credits,
      currency,
      onSuccess: (response) => {
        onSuccess(response);
      },
      onFailure: (error) => {
        console.error('Credit purchase failed:', error);
      },
    });
  };

  if (!isLoaded && isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Loading payment system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Credits</span>
          <span className="font-medium text-gray-900">{credits} Credits</span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-emerald-600">
            <CurrencyDisplay amount={amount} currency={currency} />
          </span>
        </div>
      </div>

      {showCurrencySelector && (
        <CurrencySelector
          value={currency}
          onChange={setCurrency}
          label="Select Currency"
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Secure Payment</p>
            <p>You'll be redirected to Razorpay's secure checkout to complete your payment.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy {credits} Credits for <CurrencyDisplay amount={amount} currency={currency} />
            </>
          )}
        </Button>

        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
