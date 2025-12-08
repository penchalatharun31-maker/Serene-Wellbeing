import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Expert } from '../types';
import { Button, Input } from './UI';

interface BookingModalProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ expert, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

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

            {/* Step 2: Payment */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Session</span>
                            <span className="font-medium text-gray-900">1 Hour Consultation</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium text-gray-900">{date}, {time}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-emerald-600">${expert.price}</span>
                        </div>
                    </div>

                    <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry" placeholder="MM/YY" />
                        <Input label="CVC" placeholder="123" />
                    </div>
                    <div className="flex items-center mt-4">
                        <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Save card for future payments</label>
                    </div>
                </div>
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
                <Button onClick={handleNext} disabled={!date || !time} className="w-full sm:w-auto sm:ml-3">
                    Continue to Payment
                </Button>
            )}
            {step === 2 && (
                <Button onClick={handleNext} className="w-full sm:w-auto sm:ml-3">
                    Pay ${expert.price}
                </Button>
            )}
            {step === 3 && (
                <Button onClick={onClose} className="w-full sm:w-auto sm:ml-3">
                    Done
                </Button>
            )}
            {step === 2 && (
                <Button variant="outline" onClick={handleBack} className="mt-3 w-full sm:mt-0 sm:w-auto">
                    Back
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
