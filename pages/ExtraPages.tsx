import React from 'react';
import { Card, Button } from '../components/UI';
import { Gift, Copy, Facebook, Twitter, Linkedin, Globe, Eye, CreditCard, Star } from 'lucide-react';

export const Referrals: React.FC = () => (
    <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Gift size={40} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invite Friends, Earn Rewards</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Share the gift of wellbeing. Give your friends 20% off their first session, and earn $20 in credits when they book.</p>
            
            <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between max-w-md mx-auto mb-8">
                <span className="font-mono font-bold text-gray-800 tracking-wider">SARAH-2024</span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center text-sm">
                    <Copy size={16} className="mr-1" /> Copy
                </button>
            </div>

            <div className="flex justify-center gap-4">
                <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-blue-600"><Facebook size={20}/></button>
                <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-sky-500"><Twitter size={20}/></button>
                <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-blue-700"><Linkedin size={20}/></button>
            </div>
        </Card>
    </div>
);

export const RefundPolicy: React.FC = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        <Card className="p-8 space-y-6">
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">General Policy</h2>
                <p className="text-gray-600">We understand that sometimes plans change. Our refund policy is designed to be fair to both our clients and our wellbeing experts.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Cancellations</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Cancellations made more than 24 hours before the session start time are eligible for a full refund.</li>
                    <li>Cancellations made within 24 hours of the session are eligible for a 50% refund.</li>
                    <li>No-shows are not eligible for a refund.</li>
                </ul>
            </section>
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Expert Cancellations</h2>
                <p className="text-gray-600">If an expert cancels a session, you will receive a full refund and a $10 credit towards your next booking.</p>
            </section>
        </Card>
    </div>
);

export const RateSession: React.FC = () => (
    <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate your session</h2>
            <p className="text-gray-500 mb-8">How was your mindfulness session with Dr. Anya?</p>
            
            <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={32} className={i <= 4 ? "text-yellow-400 fill-current" : "text-gray-200"} />
                ))}
            </div>

            <textarea 
                placeholder="Share your experience (optional)..." 
                className="w-full border border-gray-300 rounded-lg p-3 mb-6 h-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            ></textarea>

            <Button className="w-full">Submit Review</Button>
        </Card>
    </div>
);

// Settings Sub-pages
export const LanguageSettings: React.FC = () => (
    <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Language Preferences</h2>
        <Card className="p-6">
            <div className="space-y-4">
                {['English (US)', 'Spanish', 'French', 'German'].map(lang => (
                    <div key={lang} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-gray-700 font-medium">{lang}</span>
                        {lang === 'English (US)' && <Check className="text-emerald-500" size={20} />}
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

export const AccessibilitySettings: React.FC = () => (
    <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Accessibility</h2>
        <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">High Contrast Mode</p>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                </div>
                <input type="checkbox" className="toggle text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Large Text</p>
                    <p className="text-sm text-gray-500">Increase font size across the app</p>
                </div>
                <input type="checkbox" className="toggle text-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">Reduce Motion</p>
                    <p className="text-sm text-gray-500">Minimize animations</p>
                </div>
                <input type="checkbox" className="toggle text-emerald-500" />
            </div>
        </Card>
    </div>
);

const Check: React.FC<{size?: number, className?: string}> = ({size, className}) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);