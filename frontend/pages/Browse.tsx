import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Star, Filter, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignInRequiredModal } from '../components/SignInRequiredModal';
import { Expert } from '../types';
import apiClient from '../services/api';

const Browse: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const { isAuthenticated } = useAuth();
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch real experts from backend
    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const { data } = await apiClient.get('/experts');
                // Map backend _id to frontend id
                const mappedExperts = (data.experts || []).map((exp: any) => ({
                    ...exp,
                    id: exp._id,
                    image: exp.profilePhoto || exp.image,
                    rating: exp.stats?.avgRating || 0,
                    reviews: exp.stats?.totalReviews || 0,
                    price: exp.hourlyRate || 0,
                    tags: exp.specializations || [],
                    about: exp.bio || '',
                }));
                setExperts(mappedExperts);
            } catch (err) {
                console.error('Failed to fetch experts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    const handleBookClick = (expertId: string) => {
        if (isAuthenticated) {
            navigate(`/expert/${expertId}`);
        } else {
            setSelectedExpertId(expertId);
            setIsSignInModalOpen(true);
        }
    };

    const [countryFilter, setCountryFilter] = useState('All');
    const categories = ['All', 'Psychologist', 'Life Coach', 'Yoga Instructor', 'Nutritionist', 'POSH Trainer'];
    const countries = ['All', 'India', 'USA', 'UK', 'UAE', 'Singapore'];

    const filteredExperts = experts.filter(e => {
        const categoryMatch = filter === 'All' || e.tags.some(t => t.includes(filter)) || e.title.includes(filter) || e.category?.includes(filter);
        const countryMatch = countryFilter === 'All' || (e as any).country === countryFilter;
        return categoryMatch && countryMatch;
    });

    const getCurrencySymbol = (country?: string) => {
        switch (country) {
            case 'USA': return '$';
            case 'UK': return '£';
            case 'UAE': return 'AED ';
            case 'Singapore': return 'S$';
            default: return '₹';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Find your wellbeing expert</h1>
                    <p className="text-gray-500 max-w-2xl">Connect with certified professionals to support your mental, physical, and emotional health.</p>

                    <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                            >
                                {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'Everywhere' : c}</option>)}
                            </select>
                            <div className="relative flex-1 md:w-64">
                                <input placeholder="Search..." className="w-full pl-4 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExperts.map(expert => (
                        <Card key={expert.id} className="hover:border-emerald-200 transition-colors duration-200 flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate(`/expert/${expert.id}`)}>
                                        <img src={expert.image} alt={expert.name} className="w-16 h-16 rounded-full object-cover border border-gray-100 group-hover:scale-105 transition-transform" />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{expert.name}</h3>
                                            <p className="text-emerald-600 text-sm font-medium">{expert.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-sm font-bold text-gray-700">{expert.rating}</span>
                                        <span className="text-xs text-gray-400">({expert.reviews})</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                    {expert.about}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {expert.tags.map(tag => (
                                        <Badge key={tag} color="gray">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-50 bg-gray-50/50 rounded-b-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Starting at</p>
                                    <p className="text-lg font-bold text-gray-900">{getCurrencySymbol((expert as any).country)}{expert.price}<span className="text-sm font-normal text-gray-500">/hr</span></p>
                                </div>
                                <Button onClick={() => handleBookClick(expert.id)}>Book Session</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <SignInRequiredModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
        </div>
    );
};

export default Browse;
