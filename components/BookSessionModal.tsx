import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Expert } from '../types';
import { Button } from './UI';
import { CalendarPicker } from './CalendarPicker';
import { TimeSlotPicker } from './TimeSlotPicker';

interface BookSessionModalProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({
  expert,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'schedule' | 'payment' | 'processing' | 'success' | 'error'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBack = () => {
    if (step === 'payment') setStep('schedule');
  };

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Calculate price based on duration
      const hourlyRate = expert.price;
      const price = duration === 30 ? hourlyRate / 2 : duration === 60 ? hourlyRate : hourlyRate * 1.5;

      // Calculate endTime
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endHours = Math.floor((hours * 60 + minutes + duration) / 60);
      const endMinutes = (hours * 60 + minutes + duration) % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      // 1. Create Razorpay order
      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: price,
          currency: expert.currency || 'INR',
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // 2. Open Razorpay checkout
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890';

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Serene Wellbeing',
        description: `Session with ${expert.name}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            setStep('processing');

            // 3. Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // 4. Create session booking
            const sessionResponse = await fetch(`${API_BASE_URL}/api/v1/sessions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                expertId: expert.id,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                endTime: endTime,
                duration: duration,
                price: price,
                currency: expert.currency || 'INR',
                notes: notes,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!sessionResponse.ok) {
              throw new Error('Failed to create session booking');
            }

            const sessionData = await sessionResponse.json();
            setSessionId(sessionData.session?._id || sessionData.data?._id);
            setStep('success');

            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess();
            }
          } catch (err: any) {
            console.error('Booking error:', err);
            setError(err.message || 'Failed to complete booking');
            setStep('error');
          }
        },
        prefill: {
          name: localStorage.getItem('user_name') || '',
          email: localStorage.getItem('user_email') || '',
          contact: localStorage.getItem('user_phone') || '',
        },
        theme: {
          color: '#10B981',
        },
        modal: {
          ondismiss: function () {
            setStep('payment');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
      setStep('error');
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime12h = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculatePrice = () => {
    const hourlyRate = expert.price;
    if (duration === 30) return hourlyRate / 2;
    if (duration === 60) return hourlyRate;
    return hourlyRate * 1.5; // 90 minutes
  };

  const currencySymbol = expert.currency === 'USD' ? '$' : '₹';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {step === 'schedule' && 'Schedule Session'}
              {step === 'payment' && 'Confirm Booking'}
              {step === 'processing' && 'Processing...'}
              {step === 'success' && 'Booking Confirmed!'}
              {step === 'error' && 'Booking Failed'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {/* Expert Info */}
            <div className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
              <img
                src={expert.image || expert.profilePhoto}
                className="w-14 h-14 rounded-full object-cover mr-4"
                alt={expert.name}
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{expert.name}</p>
                <p className="text-sm text-emerald-700">{expert.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Starting at</p>
                <p className="text-lg font-bold text-emerald-600">
                  {currencySymbol}{expert.price}/hr
                </p>
              </div>
            </div>

            {/* Step 1: Schedule */}
            {step === 'schedule' && (
              <div className="space-y-6">
                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Session Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setDuration(mins)}
                        className={`py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                          duration === mins
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 text-gray-600 hover:border-emerald-200'
                        }`}
                      >
                        {mins} min
                        <div className="text-xs mt-1">
                          {currencySymbol}
                          {mins === 30 ? expert.price / 2 : mins === 60 ? expert.price : expert.price * 1.5}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                  <CalendarPicker
                    expertId={expert.id}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                    duration={duration}
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                    <TimeSlotPicker
                      expertId={expert.id}
                      selectedDate={selectedDate}
                      duration={duration}
                      onTimeSelect={setSelectedTime}
                      selectedTime={selectedTime}
                    />
                  </div>
                )}

                {/* Notes */}
                {selectedTime && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific topics or concerns you'd like to discuss..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment Summary */}
            {step === 'payment' && selectedDate && selectedTime && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-900">{formatTime12h(selectedTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">{duration} minutes</span>
                  </div>
                  {notes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Notes</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                        {notes}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-2xl text-emerald-600">
                      {currencySymbol}{calculatePrice()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment will be processed via Razorpay</p>
                    <p className="text-blue-700">
                      You'll be redirected to a secure payment gateway to complete your booking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing */}
            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <p className="text-lg font-bold text-gray-900">Creating your booking...</p>
                <p className="text-sm text-gray-500">Please wait, this will only take a moment.</p>
              </div>
            )}

            {/* Success */}
            {step === 'success' && (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
                  <CheckCircle className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Booked!</h3>
                <p className="text-gray-600 mb-6">
                  Your session with {expert.name} has been confirmed for{' '}
                  <span className="font-semibold">
                    {selectedDate && formatDate(selectedDate)} at{' '}
                    {selectedTime && formatTime12h(selectedTime)}
                  </span>
                  .
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-emerald-800">
                    📧 A confirmation email with session details and meeting link has been sent to your email.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {step === 'error' && (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Failed</h3>
                <p className="text-gray-600 mb-6">
                  {error || 'Something went wrong while processing your booking. Please try again.'}
                </p>
                <Button onClick={() => setStep('payment')} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            {step === 'schedule' && (
              <>
                <Button
                  onClick={() => setStep('payment')}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full sm:w-auto"
                >
                  Continue to Payment
                </Button>
                <Button variant="outline" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto">
                  Cancel
                </Button>
              </>
            )}
            {step === 'payment' && (
              <>
                <Button onClick={handlePayment} className="w-full sm:w-auto">
                  Pay {currencySymbol}{calculatePrice()}
                </Button>
                <Button variant="outline" onClick={handleBack} className="mt-3 w-full sm:mt-0 sm:w-auto">
                  Back
                </Button>
              </>
            )}
            {step === 'success' && (
              <Button onClick={onClose} className="w-full sm:w-auto">
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
