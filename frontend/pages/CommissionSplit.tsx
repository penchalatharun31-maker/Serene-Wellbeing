import React from 'react';
import { Card, Button } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, ShieldCheck, Globe, TrendingUp } from 'lucide-react';

const CommissionSplit: React.FC = () => {
    const navigate = useNavigate();
    const data = [
        { name: 'Your Share', value: 80, color: '#10B981' }, // Emerald-500
        { name: 'Platform Fee', value: 20, color: '#E5E7EB' }, // Gray-200
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Fair Commission Split</h1>
                    <p className="text-xl text-gray-500">We believe in a transparent and equitable partnership. Our model is designed to empower our wellbeing experts while sustaining a thriving platform for everyone.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="relative h-80 lg:h-96 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-5xl font-bold text-emerald-500">80%</span>
                            <span className="text-gray-500 font-medium mt-1">You Keep</span>
                        </div>
                    </div>
                    <div>
                        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">80% to You, the Expert</h3>
                            <p className="text-gray-600">Keep the vast majority of your earnings. You set your rates, and you reap the rewards of your expertise. We're here to support you, not to take from you.</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">20% to the Platform</h3>
                            <p className="text-gray-600">This fee helps us cover operational costs, invest in marketing to bring you more clients, and continuously improve the platform features and support.</p>
                        </div>
                    </div>
                </div>

                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What You Get for the 20%</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Secure Payments', icon: ShieldCheck, desc: 'Hassle-free payment processing and payouts.' },
                            { title: 'Global Reach', icon: Globe, desc: 'Exposure to clients from around the world.' },
                            { title: 'Scheduling Tools', icon: CheckCircle, desc: 'Integrated calendar and booking management.' },
                            { title: 'Marketing', icon: TrendingUp, desc: 'Targeted campaigns to drive traffic to your profile.' },
                        ].map((item, idx) => (
                            <Card key={idx} className="p-6 text-center hover:border-emerald-200 transition-colors">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="text-center bg-gray-50 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to start your wellbeing journey?</h2>
                    <Button size="lg" onClick={() => navigate('/signup?role=expert')}>Join as an Expert</Button>
                </div>
            </div>
        </div>
    );
};

export default CommissionSplit;
