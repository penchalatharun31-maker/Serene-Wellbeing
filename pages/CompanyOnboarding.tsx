import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Input } from '../components/UI';
import { ShieldCheck, CheckCircle, ArrowRight, ArrowLeft, Building2, Users, CreditCard, LayoutDashboard, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CompanyOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        workEmail: '',
        teamSize: '10-50',
        objective: 'Employee Mental Health'
    });

    const nextStep = () => setStep(s => Math.min(s + 3, 3)); // For simplicity, 3 steps
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleFinish = async () => {
        try {
            await login(formData.workEmail || 'hr@company.com', 'password123', true);
            navigate('/dashboard/company');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="py-6 px-10 border-b border-gray-100 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold italic">S</div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Serene for Business</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <ShieldCheck size={16} className="text-emerald-500" /> Enterprise Secure
                    </div>
                    <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">Exit</button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

                    {/* Left Info Panel */}
                    <div className="lg:col-span-2 space-y-8 py-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Welcome to the future of <span className="text-indigo-600">Employee Wellness</span>.</h1>
                            <p className="text-gray-500 leading-relaxed text-lg">Join forward-thinking HR leaders who prioritize mental health and professional growth.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Company-wide SSO</h4>
                                    <p className="text-sm text-gray-500">Secure access for all shared employees.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Expert Matching</h4>
                                    <p className="text-sm text-gray-500">Tailored support based on department needs.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 italic text-sm text-gray-400">
                            "Serene has reduced our employee turnover by 14% in just six months." — HR Director, TechGlobal
                        </div>
                    </div>

                    {/* Right Onboarding Form */}
                    <div className="lg:col-span-3">
                        {step === 1 && (
                            <Card className="p-10 shadow-2xl border-none animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="mb-8">
                                    <Badge color="indigo">Step 1: Identity</Badge>
                                    <h2 className="text-2xl font-bold text-gray-900 mt-2">Let's verify your workspace</h2>
                                </div>
                                <div className="space-y-6">
                                    <Button variant="outline" className="w-full h-14 flex justify-center gap-3 py-4 rounded-xl border-gray-200 hover:border-indigo-200" onClick={() => setStep(2)}>
                                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
                                        Single Sign-On with Google
                                    </Button>
                                    <Button variant="outline" className="w-full h-14 flex justify-center gap-3 py-4 rounded-xl border-gray-200 hover:border-indigo-200">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-5 h-5" alt="" />
                                        Microsoft Azure / Office 365
                                    </Button>
                                    <div className="relative py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100"></div>
                                        <span className="relative z-10 bg-white px-4">OR</span>
                                    </div>
                                    <div className="space-y-4">
                                        <Input label="Work Email Address" placeholder="alex@company.com" type="email" value={formData.workEmail} onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })} />
                                        <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700" onClick={() => setStep(2)}>Verify via OTP</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="p-10 shadow-2xl border-none animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="mb-8">
                                    <Badge color="indigo">Step 2: Company Bio</Badge>
                                    <h2 className="text-2xl font-bold text-gray-900 mt-2">Tell us about your team</h2>
                                </div>
                                <div className="space-y-6">
                                    <Input label="Company Legal Name" placeholder="Acme Corp India Pvt Ltd" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Team Size</label>
                                            <select className="w-full h-12 rounded-xl border-gray-100 border text-sm px-4 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.teamSize} onChange={e => setFormData({ ...formData, teamSize: e.target.value })}>
                                                <option>1-10 Employees</option>
                                                <option>10-50 Employees</option>
                                                <option>50-250 Employees</option>
                                                <option>250+ Employees</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Primary Goal</label>
                                            <select className="w-full h-12 rounded-xl border-gray-100 border text-sm px-4 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.objective} onChange={e => setFormData({ ...formData, objective: e.target.value })}>
                                                <option>Mental Health Support</option>
                                                <option>Productivity Boost</option>
                                                <option>Leadership Coaching</option>
                                                <option>Crisis Management</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button variant="ghost" className="flex-1" onClick={prevStep}>Back</Button>
                                        <Button className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100" onClick={() => setStep(3)}>Continue to Dashboard</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="p-10 shadow-2xl border-none animate-in zoom-in duration-500 text-center space-y-8">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={48} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-900">Setting up {formData.companyName}...</h2>
                                    <p className="text-gray-500 mt-2">Your dedicated B2B environment is being provisioned.</p>
                                </div>

                                <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <LayoutDashboard size={18} className="text-indigo-500" /> Organizational Insights Dashboard
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <CreditCard size={18} className="text-emerald-500" /> Centralized Credit Wallet (100 Free Credits Added)
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                        <Mail size={18} className="text-indigo-500" /> Bulk Employee Invites Enabled
                                    </div>
                                </div>

                                <Button size="lg" className="w-full h-16 text-xl bg-gray-900 hover:bg-black shadow-2xl" onClick={handleFinish}>
                                    Launch B2B Dashboard <ArrowRight className="ml-3" />
                                </Button>
                            </Card>
                        )}
                    </div>

                </div>
            </main>

            {/* Trust Banner */}
            <div className="py-6 border-t border-gray-100 flex justify-center gap-12 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white">
                <div className="flex items-center gap-2"><Lock size={14} /> SOC2 Compliant</div>
                <div className="flex items-center gap-2"><CheckCircle size={14} /> GDPR Ready</div>
                <div className="flex items-center gap-2"><ShieldCheck size={14} /> HIPAA Secure</div>
            </div>
        </div>
    );
};

export default CompanyOnboarding;
