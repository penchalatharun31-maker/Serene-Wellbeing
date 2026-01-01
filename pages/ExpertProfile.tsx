import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EXPERTS } from '../data';
import { Button, Card, Badge } from '../components/UI';
import { BookingModal } from '../components/BookingModal';
import { Star, MapPin, Calendar, Clock, Award, ShieldCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SignInRequiredModal } from '../components/SignInRequiredModal';

const ExpertProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const expert = EXPERTS.find(e => e.id === id) || EXPERTS[0];
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleBookClick = () => {
        if (isAuthenticated) {
            setIsBookingOpen(true);
        } else {
            setIsSignInModalOpen(true);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-6">
                    <Link to="/browse" className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors">
                        <ArrowLeft size={18} className="mr-2" /> Back to Browse
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <Card className="p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-100 to-teal-50 opacity-50"></div>
                            <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                                <img
                                    src={expert.image}
                                    alt={expert.name}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                                />
                                <div className="flex-1 pt-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                                            <p className="text-emerald-600 font-medium text-lg">{expert.title}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full">
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                            <span className="font-bold text-gray-900">{expert.rating}</span>
                                            <span className="text-gray-400 text-sm">({expert.reviews} reviews)</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {expert.tags.map(tag => <Badge key={tag} color="emerald">{tag}</Badge>)}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* About Section */}
                        <Card className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {expert.about}
                                <br /><br />
                                I believe in a holistic approach to wellbeing, integrating evidence-based practices with personalized care. My sessions are designed to be a safe space where we can work together to achieve your goals.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Award className="text-emerald-500 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Certified Professional</h4>
                                        <p className="text-xs text-gray-500">Verified credentials and background check.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                    <ShieldCheck className="text-emerald-500 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Secure & Confidential</h4>
                                        <p className="text-xs text-gray-500">Your privacy is our top priority.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Client Reviews</h2>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">Life changing experience</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            "Absolutely wonderful session. {expert.name.split(' ')[0]} is incredibly knowledgeable and empathetic. I felt heard and understood."
                                        </p>
                                        <p className="text-xs text-gray-400">Sarah J. • 2 days ago</p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-6">View all {expert.reviews} reviews</Button>
                        </Card>
                    </div>

                    {/* Right Column: Booking Widget (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card className="p-6 shadow-lg border-emerald-100">
                                <div className="flex justify-between items-baseline mb-6">
                                    <span className="text-3xl font-bold text-gray-900">₹{expert.price}</span>
                                    <span className="text-gray-500">per session</span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock size={20} />
                                        <span>60 minute session</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar size={20} />
                                        <span>Available today</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MessageSquare size={20} />
                                        <span>Chat included</span>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full mb-3" onClick={handleBookClick}>
                                    Book a Session
                                </Button>
                                <Button variant="outline" size="lg" className="w-full">
                                    Message
                                </Button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    100% Satisfaction Guaranteed
                                </p>
                            </Card>

                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3">
                                <div className="bg-white p-2 rounded-lg h-fit text-2xl">🎁</div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 text-sm">First Session Discount</h4>
                                    <p className="text-xs text-emerald-700 mt-1">Get 20% off your first booking with code <span className="font-mono font-bold">WELCOME20</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal expert={expert} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
            <SignInRequiredModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
        </div>
    );
};

export default ExpertProfile;
