import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, Input } from '../components/UI';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Heart, Moon, Users, Briefcase, Activity, Calendar, Play } from 'lucide-react';
import { EXPERTS } from '../data';

// --- Sub-Components moved outside to fix focus bug ---

const Step1EmotionalEntry = ({ selections, setSelections, nextStep }: any) => (
    <div className="text-center space-y-12">
        <div className="space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Step 1: Your Journey Begins</h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">What brings you here today?</h1>
            <p className="text-gray-500 text-lg">Select the area you'd like to focus on first.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
                { id: 'stress', label: 'Stress & Anxiety', icon: Activity, color: 'bg-orange-50 text-orange-600' },
                { id: 'sleep', label: 'Better Sleep', icon: Moon, color: 'bg-blue-50 text-blue-600' },
                { id: 'relationships', label: 'Relationships', icon: Heart, color: 'bg-pink-50 text-pink-600' },
                { id: 'career', label: 'Career Growth', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600' },
                { id: 'physical', label: 'Physical Wellness', icon: Activity, color: 'bg-purple-50 text-purple-600' },
                { id: 'discovery', label: 'Self Discovery', icon: Sparkles, color: 'bg-yellow-50 text-yellow-600' },
                { id: 'grief', label: 'Grief & Loss', icon: Heart, color: 'bg-gray-100 text-gray-600' },
                { id: 'exploring', label: 'Just Exploring', icon: Play, color: 'bg-teal-50 text-teal-600' },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => { setSelections({ ...selections, reason: item.label }); nextStep(); }}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-4 group ${selections.reason === item.label ? 'border-emerald-500 bg-emerald-50' : 'border-white bg-white shadow-soft hover:shadow-xl hover:border-emerald-100'}`}
                >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <item.icon size={28} />
                    </div>
                    <span className="font-bold text-sm text-gray-900">{item.label}</span>
                </button>
            ))}
        </div>

        <p className="text-gray-400 text-sm">⚡ Need help now? <button className="text-emerald-600 font-bold hover:underline">Get crisis support</button></p>
    </div>
);

const Step2Assessment = ({ selections, setSelections, nextStep, prevStep }: any) => (
    <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-2">
            <Badge color="emerald">Step 2: Understanding You</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Let's refine your needs</h2>
        </div>

        <Card className="p-8 space-y-8">
            <div className="space-y-4">
                <p className="font-bold text-gray-900">How often do you feel overwhelmed or challenged in this area?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Rarely', 'Sometimes', 'Often', 'Daily'].map(freq => (
                        <button
                            key={freq}
                            onClick={() => setSelections({ ...selections, frequency: freq })}
                            className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${selections.frequency === freq ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200 text-gray-600'}`}
                        >
                            {freq}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <p className="font-bold text-gray-900">What type of support feels right for you?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Talk it through', 'Learn techniques', 'Both'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelections({ ...selections, supportType: type })}
                            className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${selections.supportType === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200 text-gray-600'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <p className="font-bold text-gray-900">Have you worked with a professional before?</p>
                <div className="grid grid-cols-1 gap-3">
                    {['Yes, currently', 'Yes, in the past', 'No, this is new'].map(exp => (
                        <button
                            key={exp}
                            onClick={() => setSelections({ ...selections, prevExperience: exp })}
                            className={`py-4 px-6 rounded-xl border-2 font-medium text-left transition-all flex items-center justify-between ${selections.prevExperience === exp ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200 text-gray-600'}`}
                        >
                            {exp}
                            {selections.prevExperience === exp && <CheckCircle size={18} />}
                        </button>
                    ))}
                </div>
            </div>
        </Card>

        <div className="flex justify-between items-center">
            <button onClick={prevStep} className="flex items-center text-gray-500 font-bold hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <Button size="lg" className="px-12" onClick={nextStep}>Continue <ArrowRight size={20} className="ml-2" /></Button>
        </div>
    </div>
);

const Step3Preferences = ({ selections, setSelections, nextStep, prevStep }: any) => (
    <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-2">
            <Badge color="emerald">Step 3: Finding Your Match</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Tell us what matters to you</h2>
        </div>

        <Card className="p-8 space-y-10">
            <div className="space-y-6">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-emerald-600">Warm & Supportive</span>
                    <span className="text-indigo-600">Direct & Solution-focused</span>
                </div>
                <input
                    type="range"
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={selections.commStyle}
                    onChange={(e) => setSelections({ ...selections, commStyle: parseInt(e.target.value) })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Format</label>
                    <div className="space-y-2">
                        {['Video Call', 'Audio Call', 'Chat/Text', 'No preference'].map(f => (
                            <button
                                key={f}
                                onClick={() => setSelections({ ...selections, format: f })}
                                className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${selections.format === f ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Language</label>
                    <div className="space-y-2">
                        {['English', 'Hindi', 'Tamil', 'Multi-lingual'].map(l => (
                            <button
                                key={l}
                                onClick={() => setSelections({ ...selections, language: l })}
                                className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${selections.language === l ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Expert Country</label>
                    <div className="space-y-2">
                        {['India', 'USA', 'UK', 'Singapore', 'No preference'].map(c => (
                            <button
                                key={c}
                                onClick={() => setSelections({ ...selections, countryPref: c })}
                                className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${selections.countryPref === c ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget per session</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['₹500-1000', '₹1000-2000', '₹2000+', 'Show all'].map(b => (
                        <button
                            key={b}
                            onClick={() => setSelections({ ...selections, budget: b })}
                            className={`py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all ${selections.budget === b ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100'}`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>
        </Card>

        <div className="flex justify-between items-center">
            <button onClick={prevStep} className="flex items-center text-gray-500 font-bold hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <Button size="lg" className="px-12" onClick={nextStep}>Find My Matches <ArrowRight size={20} className="ml-2" /></Button>
        </div>
    </div>
);

const Step4Results = ({ selections, nextStep, prevStep }: any) => {
    const navigate = useNavigate();
    // Basic Matching Algorithm
    const getMatchScore = (expert: any) => {
        let score = 70;
        if (expert.tags.some((tag: string) => selections.reason?.includes(tag))) score += 20;
        const styleMatch = Math.abs(selections.commStyle - 50) < 30;
        if (styleMatch) score += 10;
        if (selections.budget === 'Show all' || expert.price <= 1500) score += 10;
        if (selections.language === 'English') score += 5;
        if (selections.countryPref && selections.countryPref !== 'No preference' && expert.country === selections.countryPref) score += 15;
        score += (expert.rating / 5) * 5;
        return Math.min(Math.round(score), 99);
    };

    const matchedExperts = [...EXPERTS]
        .map(e => ({ ...e, matchScore: getMatchScore(e) }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

    const getCurrencySymbol = (country?: string) => {
        switch (country) {
            case 'USA': return '$';
            case 'UK': return '£';
            case 'UAE': return 'AED ';
            case 'Singapore': return 'S$';
            default: return '₹';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} /> The "Aha" Moment
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900">Your Perfect Matches</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Based on your preferences, these experts are best suited to help you with {selections.reason}.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {matchedExperts.map((expert, idx) => (
                    <Card key={expert.id} className={`p-8 hover:shadow-2xl transition-all border-2 ${idx === 0 ? 'border-emerald-500 shadow-xl relative' : 'border-transparent'}`}>
                        {idx === 0 && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-1 rounded-full text-xs font-bold shadow-lg">
                                {expert.matchScore}% MATCH • BEST FIT
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <img src={expert.image} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-50" alt={expert.name} />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{expert.name}</h3>
                                        <p className="text-emerald-600 font-medium">{expert.title} • {expert.experience || 'Experienced'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900">{getCurrencySymbol(expert.country)}{expert.price}</p>
                                        <p className="text-xs text-gray-500">per session</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 line-clamp-2 italic">"{expert.about}"</p>
                                <div className="flex gap-4 pt-2">
                                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-lg">
                                        <Activity size={16} /> {expert.rating} ({expert.reviews} reviews)
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                        <Calendar size={16} /> Next: Today, 6:00 PM
                                    </div>
                                    {idx > 0 && <Badge color="gray">{expert.matchScore}% Match</Badge>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-50">
                            <Button size="lg" className="flex-1 shadow-lg shadow-emerald-200" onClick={nextStep}>Book Free Consultation</Button>
                            <Button size="lg" variant="outline" className="flex-1" onClick={() => navigate(`/expert/${expert.id}`)}>View Full Profile</Button>
                            <button className="p-3 text-gray-400 hover:text-emerald-600 transition-colors">
                                <Heart size={24} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button onClick={prevStep} className="flex items-center text-gray-500 font-bold hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Preferences
                </button>
                <button onClick={() => navigate('/browse')} className="text-gray-500 font-bold hover:text-emerald-600 transition-colors underline underline-offset-4 tracking-tight">Browse More Experts</button>
            </div>
        </div>
    );
};

const Step5Account = ({ handleGoogleLogin, login, nextStep, prevStep }: any) => (
    <div className="max-md mx-auto space-y-10">
        <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-900">Save Your Progress</h2>
            <p className="text-gray-500">Create an account to book your consultation and save your expert matches.</p>
        </div>

        <Card className="p-8 space-y-6">
            <div className="space-y-4">
                <Button variant="outline" className="w-full flex justify-center gap-3 py-6 rounded-2xl border-gray-200 hover:border-emerald-200 transition-all" onClick={handleGoogleLogin}>
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
                    Continue with Google
                </Button>
                <Button variant="outline" className="w-full py-6 rounded-2xl border-gray-200 hover:border-emerald-200">
                    Continue with Phone
                </Button>
            </div>

            <div className="relative py-2 text-center">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100"></div>
                <span className="relative z-10 bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
            </div>

            <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                try {
                    await login('guest@google.com', 'password123', true);
                    nextStep();
                } catch (err) {
                    console.error(err);
                }
            }}>
                <Input label="Email address" placeholder="you@example.com" type="email" required />
                <Button type="submit" className="w-full py-4 text-lg">Create Account</Button>
            </form>

            <div className="flex justify-center pt-6">
                <button onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-gray-600 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Change Expert
                </button>
            </div>
        </Card>
    </div>
);

const Step6Booking = ({ navigate }: any) => (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="text-center space-y-3">
            <Badge color="emerald">Step 6: Confirm Consultation</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Expert Availability</h2>
            <p className="text-gray-500">Select a time for your 15-minute free discovery call.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg text-gray-900">December 2025</h3>
                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ArrowLeft size={16} /></button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ArrowRight size={16} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, i) => (
                        <button
                            key={i}
                            className={`h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${i + 1 === 23 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' : i + 1 > 20 ? 'hover:bg-emerald-50 text-gray-700' : 'text-gray-300 cursor-not-allowed'}`}
                            disabled={i + 1 <= 20}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </Card>

            <div className="space-y-6">
                <Card className="p-6 space-y-6">
                    <h3 className="font-bold text-gray-900">Available slots for Dec 23</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM', '7:15 PM'].map(time => (
                            <button
                                key={time}
                                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${time === '6:00 PM' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-emerald-200 text-gray-600'}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </Card>

                <Button size="lg" className="w-full h-16 text-xl shadow-xl shadow-emerald-200" onClick={() => navigate('/dashboard/user')}>
                    Confirm Booking
                </Button>
                <p className="text-center text-xs text-gray-500">No payment required for discovery calls. Confirmation sent via WhatsApp.</p>
            </div>
        </div>
    </div>
);

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentStep = parseInt(searchParams.get('step') || '1');
    const [selections, setSelections] = useState<any>({
        reason: null,
        frequency: 'Sometimes',
        supportType: 'Both',
        prevExperience: 'No',
        commStyle: 50,
        format: 'Video Call',
        gender: 'No preference',
        language: 'English',
        budget: 'Show all'
    });

    const totalSteps = 6;

    const setStep = (s: number) => {
        setSearchParams({ step: s.toString() });
    };

    const nextStep = () => setStep(Math.min(currentStep + 1, totalSteps));
    const prevStep = () => setStep(Math.max(currentStep - 1, 1));

    const handleGoogleLogin = async () => {
        try {
            await login('guest@serene.com', 'password123', true);
            nextStep();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Progress Bar Header */}
            <div className="fixed top-0 inset-x-0 h-2 bg-white flex z-50">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-full transition-all duration-700 ${i + 1 <= currentStep ? 'bg-emerald-500' : 'bg-gray-100'}`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-20 px-6">
                {currentStep === 1 && <Step1EmotionalEntry selections={selections} setSelections={setSelections} nextStep={nextStep} />}
                {currentStep === 2 && <Step2Assessment selections={selections} setSelections={setSelections} nextStep={nextStep} prevStep={prevStep} />}
                {currentStep === 3 && <Step3Preferences selections={selections} setSelections={setSelections} nextStep={nextStep} prevStep={prevStep} />}
                {currentStep === 4 && <Step4Results selections={selections} nextStep={nextStep} prevStep={prevStep} />}
                {currentStep === 5 && <Step5Account handleGoogleLogin={handleGoogleLogin} login={login} nextStep={nextStep} prevStep={prevStep} />}
                {currentStep === 6 && <Step6Booking navigate={navigate} />}
            </div>

            {/* Trust Footer */}
            <div className="py-6 border-t border-gray-100 bg-white flex justify-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><Lock size={14} /> HIPAA Compliant</div>
                <div className="flex items-center gap-2"><CheckCircle size={14} /> 100% Confidential</div>
                <div className="flex items-center gap-2"><Users size={14} /> 50k+ Happy Users on Serene</div>
            </div>
        </div>
    );
};

// Simple Lock component for footer
const Lock = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default Onboarding;
