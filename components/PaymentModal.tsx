import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { X, CreditCard, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (credits: number) => void;
    currency?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, currency = 'INR' }) => {
    const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
    const [method, setMethod] = useState<'card' | 'upi' | null>(null);
    const [selectedPack, setSelectedPack] = useState<{ credits: number, price: number } | null>(null);

    const currencySymbol = currency === 'USD' ? '$' : '₹';

    const packs = [
        { credits: 50, price: currency === 'USD' ? 6 : 499 },
        { credits: 150, price: currency === 'USD' ? 15 : 1299 },
        { credits: 500, price: currency === 'USD' ? 49 : 3999 },
    ];

    if (!isOpen) return null;

    const handlePackSelect = (pack: { credits: number, price: number }) => {
        setSelectedPack(pack);
        setStep('select');
    };

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleFinish = () => {
        if (selectedPack) onSuccess(selectedPack.credits);
        setStep('select');
        setMethod(null);
        setSelectedPack(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Top Up Credits</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {packs.map((pack) => (
                                    <div
                                        key={pack.credits}
                                        onClick={() => setSelectedPack(pack)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPack?.credits === pack.credits ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">{pack.credits} Credits</p>
                                                <p className="text-sm text-gray-500">For personal sessions</p>
                                            </div>
                                            <p className="text-xl font-bold text-emerald-600">{currencySymbol}{pack.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedPack && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">Select Payment Method</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setMethod('upi')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${method === 'upi' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
                                        >
                                            <Smartphone className={method === 'upi' ? 'text-emerald-600' : 'text-gray-400'} size={24} />
                                            <span className="mt-2 font-bold text-sm">UPI</span>
                                        </button>
                                        <button
                                            onClick={() => setMethod('card')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${method === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
                                        >
                                            <CreditCard className={method === 'card' ? 'text-emerald-600' : 'text-gray-400'} size={24} />
                                            <span className="mt-2 font-bold text-sm">Card</span>
                                        </button>
                                    </div>

                                    <Button className="w-full h-12 text-lg shadow-lg shadow-emerald-200" onClick={() => setStep('details')} disabled={!method}>
                                        Continue to Pay {currencySymbol}{selectedPack.price}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {method === 'upi' ? (
                                <div className="space-y-4">
                                    <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                                        <Smartphone className="text-emerald-600" />
                                        <p className="text-sm text-gray-700 font-medium">Pay via UPI App</p>
                                    </div>
                                    <Input label="Enter UPI ID" placeholder="username@upi" required />
                                    <div className="pt-4">
                                        <p className="text-xs text-center text-gray-500 mb-4 flex items-center justify-center gap-1">
                                            <ShieldCheck size={14} className="text-emerald-500" /> Secure payment via Razorpay
                                        </p>
                                        <Button className="w-full" onClick={async () => {
                                            if (!selectedPack) return;
                                            try {
                                                const token = localStorage.getItem('auth_token');
                                                // 1. Create Order
                                                const res = await fetch('http://localhost:5000/api/payments/create-razorpay-order', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({ amount: selectedPack.price, currency: currency || 'INR' })
                                                });
                                                const data = await res.json();

                                                if (!data.success) throw new Error('Order creation failed');

                                                // 2. Open Razorpay
                                                const options = {
                                                    key: "rzp_test_1234567890", // Replace with env var in real app
                                                    amount: data.order.amount,
                                                    currency: data.order.currency,
                                                    name: "Serene Wellbeing",
                                                    description: "Credits Topup",
                                                    order_id: data.order.id,
                                                    handler: function (response: any) {
                                                        // 3. Handle Success
                                                        console.log("Payment Successful", response);
                                                        handlePay(); // Transition UI to success
                                                    },
                                                    prefill: {
                                                        name: "User Name",
                                                        email: "user@example.com",
                                                        contact: "9999999999"
                                                    },
                                                    theme: { color: "#10B981" }
                                                };

                                                const rzp1 = new (window as any).Razorpay(options);
                                                rzp1.open();
                                            } catch (err) {
                                                console.error("Payment failed", err);
                                                alert("Payment initialization failed");
                                            }
                                        }}>Verify and Pay</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input label="Card Number" placeholder="0000 0000 0000 0000" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Expiry Date" placeholder="MM/YY" required />
                                        <Input label="CVV" placeholder="***" type="password" required />
                                    </div>
                                    <Input label="Name on Card" placeholder="SARAH JOHNSON" required />
                                    <div className="pt-4 text-center">
                                        <p className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1">
                                            <ShieldCheck size={14} className="text-emerald-500" /> Your card data is encrypted and secure
                                        </p>
                                        <Button className="w-full" onClick={handlePay}>Pay {currencySymbol}{selectedPack?.price}</Button>
                                    </div>
                                </div>
                            )}
                            <Button variant="ghost" className="w-full" onClick={() => setStep('select')}>Change Payment Method</Button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-bold text-gray-900">Processing Payment...</p>
                            <p className="text-sm text-gray-500">Please do not refresh or close the window.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <CheckCircle size={48} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-900">Payment Successful!</h4>
                                <p className="text-gray-500 mt-2">Added <span className="text-emerald-600 font-bold">{selectedPack?.credits} credits</span> to your account.</p>
                            </div>
                            <Button className="w-full" onClick={handleFinish}>Back to Dashboard</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
