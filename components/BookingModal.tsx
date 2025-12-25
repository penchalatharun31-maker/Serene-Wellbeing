import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Expert } from '../types';
import { Button, Input } from './UI';
import { SessionCheckout } from './RazorpayCheckout';
import { RazorpayResponse } from '../hooks/useRazorpay';
import { paymentService } from '../services/payment.service';

interface BookingModalProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ expert, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step === 1) {
      // Create session before moving to payment
      try {
        setIsCreatingSession(true);
        setError(null);

        // TODO: Replace with actual session creation API call
        // For now, simulate session creation
        const mockSessionId = `session_${Date.now()}`;
        setSessionId(mockSessionId);
        setStep(2);
      } catch (err: any) {
        setError(err.message || 'Failed to create session');
      } finally {
        setIsCreatingSession(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      // Verify payment with backend
      await paymentService.verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      // Move to success step
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
    }
  };

  const handlePaymentCancel = () => {
    setStep(1);
    setSessionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
                {step === 1 && 'Select a Time'}
                {step === 2 && 'Payment Details'}
                {step === 3 && 'Confirmed!'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
            </button>
          </div>

          <div className="px-4 py-5 sm:p-6">

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Step 1: Schedule */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                         <img src={expert.image} className="w-12 h-12 rounded-full object-cover mr-4" alt="" />
                         <div>
                             <p className="text-sm text-emerald-800 font-medium">Session with</p>
                             <p className="font-bold text-gray-900">{expert.name}</p>
                         </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                        <div className="grid grid-cols-4 gap-2">
                             {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15'].map((d) => (
                                 <button
                                    key={d}
                                    onClick={() => setDate(d)}
                                    className={`py-3 rounded-lg text-sm border ${date === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}
                                 >
                                     {d}
                                 </button>
                             ))}
                        </div>
                    </div>

                    {date && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTime(t)}
                                        className={`py-2 rounded-lg text-sm border ${time === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Payment with Razorpay */}
            {step === 2 && sessionId && (
                <SessionCheckout
                  sessionId={sessionId}
                  amount={expert.price}
                  expertName={expert.name}
                  sessionDate={date || undefined}
                  sessionTime={time || undefined}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                  showCurrencySelector={true}
                  showTimezoneSelector={true}
                />
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-500 mb-8">
                        You're all set for your session with {expert.name} on {date} at {time}.
                        A confirmation email has been sent to you.
                    </p>
                </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 1 && (
                <Button
                  onClick={handleNext}
                  disabled={!date || !time || isCreatingSession}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Session...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
            )}
            {step === 3 && (
                <Button onClick={onClose} className="w-full sm:w-auto sm:ml-3">
                    Done
                </Button>
            )}
            {step === 1 && (
                <Button variant="outline" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto">
                    Cancel
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
