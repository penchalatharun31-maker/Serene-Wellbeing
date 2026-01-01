import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Input } from '../components/UI';
import {
    Sparkles, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck,
    Video, Star, Briefcase, FileText,
    Target, Heart, Users, ShieldAlert, Award, MessageCircle,
    Smartphone, Activity, Search, Languages, HelpCircle, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Sub-Components moved outside to fix focus bug ---

const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
        case 'USD': return '$';
        case 'GBP': return '£';
        case 'AED': return 'AED ';
        case 'SGD': return 'S$';
        default: return '₹';
    }
};

const Step1Basic = ({ formData, setFormData, nextStep }: any) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <Badge color="blue">Step 1: Basics</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Let's get you set up</h2>
            <p className="text-gray-500">How should we introduce you to your future clients?</p>
        </div>
        <Card className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="Dr. Sarah Johnson" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <Input label="Email address" type="email" placeholder="sarah@experts.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Phone (WhatsApp preferred)" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
                    <select
                        className="w-full h-12 rounded-xl border-gray-100 border text-sm px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.country || 'India'}
                        onChange={e => setFormData({ ...formData, country: e.target.value, currency: e.target.value === 'India' ? 'INR' : 'USD' })}
                    >
                        <option value="India">India (INR)</option>
                        <option value="USA">USA (USD)</option>
                        <option value="UK">UK (GBP)</option>
                        <option value="UAE">UAE (AED)</option>
                        <option value="Singapore">Singapore (SGD)</option>
                        <option value="Other">Other (USD)</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="City" placeholder="Mumbai, India" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                <Input label="Hourly Rate" type="number" placeholder="500" value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Primary Category</label>
                <select
                    className="w-full h-12 rounded-xl border-gray-100 border text-sm px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                    <optgroup label="Mental Health">
                        <option>Psychologist</option>
                        <option>Psychiatrist</option>
                        <option>Clinical Psychologist</option>
                        <option>Therapist</option>
                        <option>Marriage & Family Therapist</option>
                        <option>Art/Music Therapist</option>
                        <option>Psychiatric Nurse</option>
                    </optgroup>
                    <optgroup label="Coaching">
                        <option>Life Coach</option>
                        <option>Career Coach</option>
                        <option>Executive Coach</option>
                        <option>Leadership Coach</option>
                        <option>Business Coach</option>
                        <option>Relationship Coach</option>
                        <option>Parenting Coach</option>
                        <option>Financial Wellness Coach</option>
                    </optgroup>
                    <optgroup label="Holistic Wellness">
                        <option>Yoga Instructor</option>
                        <option>Meditation Guide</option>
                        <option>Breathwork Coach</option>
                        <option>Sound Healer</option>
                        <option>Ayurveda Expert</option>
                        <option>Reiki Master</option>
                        <option>Wellness Coach</option>
                    </optgroup>
                    <optgroup label="Physical Wellness">
                        <option>Fitness Coach</option>
                        <option>Personal Trainer</option>
                        <option>Physiotherapist</option>
                        <option>Sports Psychologist</option>
                        <option>Sleep Specialist</option>
                    </optgroup>
                    <optgroup label="Nutrition">
                        <option>Nutritionist</option>
                        <option>Dietitian</option>
                        <option>Holistic Nutritionist</option>
                        <option>Gut Health Expert</option>
                    </optgroup>
                    <optgroup label="Corporate/B2B">
                        <option>POSH Trainer</option>
                        <option>DEI Facilitator</option>
                        <option>EAP Counselor</option>
                        <option>Stress Workshop Expert</option>
                        <option>Team Building Facilitator</option>
                    </optgroup>
                </select>
            </div>
            <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg shadow-xl shadow-blue-100" onClick={nextStep}>
                Create Profile <ArrowRight className="ml-2" />
            </Button>
        </Card>
    </div>
);

const Step2Verification = ({ formData, setFormData, nextStep, prevStep }: any) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <Badge color="emerald">Step 2: Verification</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Credibility & Trust</h2>
            <p className="text-gray-500">Upload your documents for a verified Expert badge.</p>
        </div>
        <Card className="p-8 space-y-6">
            <div className="space-y-4">
                <Input label="Years of Experience" type="number" placeholder="5" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                <Input label="License Number (if applicable)" placeholder="RCI-XXX-XXX" value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })} />
            </div>
            <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                    <Award size={20} />
                    <span className="font-bold">Degrees & Certificates</span>
                </div>
                <p className="text-sm text-gray-400">PDFs or high-res images of your primary qualifications.</p>
                <Button variant="outline" className="w-full h-12 border-emerald-100 text-emerald-600 hover:bg-emerald-50">Upload Documents</Button>
            </div>
            <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl" onClick={nextStep}>Continue</Button>
            </div>
        </Card>
    </div>
);

const Step3Matching = ({ nextStep, prevStep }: any) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <Badge color="emerald">Step 3: Matching Intelligence</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Your "Vibe" & Style</h2>
            <p className="text-gray-500">These help us match you with the <i>right</i> clients, not just <i>any</i> clients.</p>
        </div>
        <Card className="p-8 space-y-8">
            <div className="space-y-6">
                <h3 className="font-bold text-gray-900">Personality Sliders</h3>
                <div className="space-y-8">
                    {[
                        { label: 'Communication Style', left: 'Warm/Nurturing', right: 'Direct/Solution-focused' },
                        { label: 'Session Structure', left: 'Free-flowing', right: 'Highly Structured' },
                        { label: 'Approach Focus', left: 'Past/Root Causes', right: 'Present/Future Goals' },
                    ].map((item, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>{item.left}</span>
                                <span>{item.right}</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-emerald-500" />
                            <p className="text-center text-xs font-medium text-gray-500">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-4 pt-6">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100" onClick={nextStep}>Next: Your Story</Button>
            </div>
        </Card>
    </div>
);

const Step4Story = ({ formData, setFormData, nextStep, prevStep }: any) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <Badge color="emerald">Step 4: Your Story</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Build Human Connection</h2>
            <p className="text-gray-500">Tell clients <i>why</i> you do what you do. Lived experience builds trust.</p>
        </div>
        <Card className="p-8 space-y-6">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Professional Bio (min 200 chars)</label>
                <textarea
                    className="w-full rounded-2xl border-gray-100 border p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                    placeholder="Share your professional journey and approach..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">"Why I do this" (Personal Story)</label>
                <textarea
                    className="w-full rounded-2xl border-gray-100 border p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                    placeholder="What lived experience led you to this path?"
                    value={formData.personalStory}
                    onChange={e => setFormData({ ...formData, personalStory: e.target.value })}
                />
            </div>
            <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl" onClick={nextStep}>Step 5: Intro Video</Button>
            </div>
        </Card>
    </div>
);

const Step5Video = ({ nextStep }: any) => (
    <div className="text-center space-y-12">
        <div className="text-center space-y-4">
            <Badge color="emerald">Step 5: Human Touch</Badge>
            <h2 className="text-4xl font-black text-gray-900">Show, Don't Just Tell</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Experts with video intros get <b>3x more bookings</b>. Clients want to see your smile and hear your voice.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card className="p-8 bg-emerald-50 border-emerald-100 space-y-6">
                <h4 className="font-bold flex items-center gap-2 text-emerald-700">
                    <Video size={20} /> Script Prompts
                </h4>
                <ul className="space-y-4 text-sm text-emerald-900/70">
                    <li className="flex gap-3">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                        <span><b>0-10s</b>: Warm greeting ("Hi, I'm Dr. Sarah...")</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                        <span><b>10-40s</b>: Who you help and what sessions feel like.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                        <span><b>40-60s</b>: A personal touch/Call to action.</span>
                    </li>
                </ul>
                <div className="pt-4 border-t border-emerald-100">
                    <p className="text-xs text-emerald-500 italic">Landscape orientation • Good lighting • Quiet background</p>
                </div>
            </Card>
            <div className="space-y-4">
                <div className="h-64 bg-gray-100 rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 group hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer">
                    <Video size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Record or Upload Video</span>
                </div>
                <Button variant="ghost" className="w-full text-emerald-600 font-bold" onClick={nextStep}>Skip for now (get fewer bookings)</Button>
                <Button className="w-full h-14 bg-gray-900 hover:bg-black font-bold" onClick={nextStep}>Save & Continue</Button>
            </div>
        </div>
    </div>
);

const Step6Logistics = ({ formData, setFormData, nextStep, prevStep }: any) => (
    <div className="space-y-8">
        <div className="space-y-2">
            <Badge color="emerald">Step 6: Logistics</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Setting Shop</h2>
            <p className="text-gray-500">How would you like to get paid and scheduled?</p>
        </div>
        <Card className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Session Rate (₹)" type="number" placeholder="1500" value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} />
                <Input label="Cal.com / Calendly Link" placeholder="cal.com/dr-sarah" value={formData.calLink} onChange={e => setFormData({ ...formData, calLink: e.target.value })} />
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Payout Details</p>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Enter PAN Number" value={formData.pan} onChange={e => setFormData({ ...formData, pan: e.target.value })} />
                    <Input placeholder="IFSC Code" />
                </div>
                <Input placeholder="Bank Account Number" />
            </div>
            <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>Back</Button>
                <Button className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl" onClick={nextStep}>Review Profile</Button>
            </div>
        </Card>
    </div>
);

const Step7Review = ({ formData, nextStep, prevStep }: any) => (
    <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-2">
            <Badge color="emerald">Step 7: Final Look</Badge>
            <h2 className="text-3xl font-extrabold text-gray-900">Looking Great!</h2>
            <p className="text-gray-500">Here's how your profile will appear to clients.</p>
        </div>

        <Card className="p-0 overflow-hidden shadow-2xl relative">
            <div className="h-40 bg-gradient-to-r from-emerald-600 to-teal-700"></div>
            <div className="px-10 pb-10">
                <div className="flex items-end gap-6 -mt-16 mb-6">
                    <div className="h-32 w-32 rounded-3xl bg-white p-1 shadow-xl">
                        <div className="w-full h-full rounded-[1.25rem] bg-gray-100 flex items-center justify-center text-gray-300">
                            <Users size={48} />
                        </div>
                    </div>
                    <div className="pb-4">
                        <h3 className="text-3xl font-black text-white md:text-gray-900 drop-shadow-sm">{formData.name || 'Your Name'}</h3>
                        <p className="text-emerald-500 font-bold">{formData.category} • {formData.experience || '0'} Years Exp.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">About Me</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">{formData.bio || 'Your professional bio will appear here...'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase">Communication</h5>
                                <p className="text-xs font-bold text-gray-700">Warm & Nurturing</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase">Languages</h5>
                                <p className="text-xs font-bold text-gray-700">English, Hindi</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-emerald-700 font-bold">Standard Session</span>
                                <span className="text-2xl font-black text-emerald-800">{getCurrencySymbol(formData.currency)}{formData.rate || '0'}</span>
                            </div>
                            <Button className="w-full bg-emerald-600">Proceed to Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={prevStep}>Make Changes</Button>
            <Button size="lg" className="px-12 bg-gray-900" onClick={nextStep}>Submit for Approval <CheckCircle size={20} className="ml-2" /></Button>
        </div>
    </div>
);

const Step8Approval = ({ handleFinish }: any) => (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-12">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
            <ShieldCheck size={48} />
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900">Application Submitted!</h1>
            <p className="text-gray-500 text-lg leading-relaxed px-10">Our clinical team is reviewing your profile. We take validation seriously to ensure the highest quality of care on Serene.</p>
        </div>

        <Card className="p-8 bg-white border-none shadow-soft max-w-md mx-auto">
            <div className="space-y-6">
                <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Clock size={20} /></div>
                    <div>
                        <h4 className="font-bold text-gray-900">Review Timeline</h4>
                        <p className="text-xs text-gray-400">Expect an update within 48 hours.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><HelpCircle size={20} /></div>
                    <div>
                        <h4 className="font-bold text-gray-900">Need Help?</h4>
                        <p className="text-xs text-gray-400">Reach out at experts@serene.com</p>
                    </div>
                </div>
            </div>
        </Card>

        <Button size="lg" className="px-16" onClick={handleFinish}>Go to Expert Area</Button>
    </div>
);

const ExpertOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({
        // Step 1
        name: '', email: '', phone: '', city: '', category: 'Life Coach', country: 'India', currency: 'INR',
        // Step 2
        experience: '', qualifications: [], license: '',
        // Step 3
        specializations: [], populations: [], approaches: [], languages: [],
        // Step 4
        bio: '', personalStory: '', signatureApproach: '', firstSession: '',
        // Step 5 (Video intro - URL)
        videoUrl: '',
        // Step 6 (Logistics)
        rate: '', calLink: '', bankDetails: { name: '', acc: '', ifsc: '' }, pan: ''
    });

    const totalSteps = 8;
    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleFinish = async () => {
        try {
            await signup(formData.name || 'New Expert', formData.email || 'expert@serene.com', 'password123', 'expert', formData.country, formData.currency);
            navigate('/dashboard/expert');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Nav Header */}
            <header className="py-6 px-10 border-b border-white bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Award size={24} />
                    </div>
                    <div>
                        <span className="text-xl font-black text-gray-900 tracking-tighter">Serene</span>
                        <span className="text-[10px] block font-bold text-emerald-500 uppercase tracking-widest -mt-1">For Experts</span>
                    </div>
                </div>
                {step < 8 && (
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-1">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === step ? 'w-8 bg-emerald-600' : 'w-3 bg-emerald-100'}`} />
                            ))}
                        </div>
                        <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-400 hover:text-gray-900">Exit Setup</button>
                    </div>
                )}
            </header>

            <main className="flex-1 container mx-auto px-6 py-20 flex justify-center items-start">
                <div className="w-full max-w-4xl">
                    {step === 1 && <Step1Basic formData={formData} setFormData={setFormData} nextStep={nextStep} />}
                    {step === 2 && <Step2Verification formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
                    {step === 3 && <Step3Matching nextStep={nextStep} prevStep={prevStep} />}
                    {step === 4 && <Step4Story formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
                    {step === 5 && <Step5Video nextStep={nextStep} />}
                    {step === 6 && <Step6Logistics formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
                    {step === 7 && <Step7Review formData={formData} nextStep={nextStep} prevStep={prevStep} />}
                    {step === 8 && <Step8Approval handleFinish={handleFinish} />}
                </div>
            </main>

            {/* Footer Trust Bar */}
            {step < 8 && (
                <div className="py-6 border-t border-gray-100 bg-white flex justify-center gap-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted</div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Clinical Review</div>
                    <div className="flex items-center gap-2"><Smartphone size={14} className="text-emerald-500" /> Dashboard Ready</div>
                </div>
            )}
        </div>
    );
};

export default ExpertOnboarding;
