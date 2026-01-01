import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle, Flower2, Clock, Heart, ArrowRight, Sparkles, MessageCircle, BarChart2, CreditCard, BookOpen, Users, Calendar, Briefcase, TrendingUp, Star, ClipboardList, Wallet, BarChart3, ShieldCheck as ShieldIcon, Globe, PieChart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${searchTerm}`);
  };

  return (
    <div className="font-display">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCk0feXimzsBmebsODyyKMdQKV7Z8g9SN6yp2mTZGCPVexWbNh6p_uZZeunoAQmQZoFyDs288kvvpCGyx5rNzUD0BVmdywAr5m4fn7RUaTvA-ZK0gDNW9_iHAJmWe8_fO1wXAqxYJloQtVLTfLSadkFlQj6PNAoViIr6uTxWbIxqfWwFmJATIdwGejFqdEGl6hhW2ABwsYqVMBKwkFReNhzSktTVkPnzrwBtBCkAJKwervW1spDWzNe-reqtOHBp0NsBkhV7OjFXeNb")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Find your wellbeing expert today
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-medium">
            Connect with certified professionals to enhance your personal and professional wellbeing.
          </p>

          <div className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="w-full sm:w-auto px-12 py-8 text-xl h-auto shadow-2xl shadow-emerald-200" onClick={() => navigate('/onboarding')}>
              Match with an Expert <ArrowRight size={24} className="ml-3" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-8 text-xl h-auto bg-white/50 backdrop-blur-sm" onClick={() => navigate('/browse')}>
              Browse All Experts
            </Button>
          </div>

          <div className="mt-8 flex justify-center items-center gap-x-8 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <CheckCircle className="h-5 w-5 text-primary fill-current bg-white rounded-full" /> Verified Experts
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <ShieldCheck className="h-5 w-5 text-primary fill-current bg-white rounded-full" /> Secure Payments
            </div>
          </div>
        </div>
      </section>

      {/* Explore Wellbeing Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Wellbeing</h2>
            <p className="mt-2 text-lg text-gray-600">Discover trending topics and popular categories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Trending Topics */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Trending Topics</h3>
              <div className="space-y-4">
                <div onClick={() => navigate('/browse?filter=Mindfulness')} className="flex items-center bg-pastel-green/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="w-16 h-16 bg-pastel-green rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Flower2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Mindfulness</h4>
                    <p className="text-gray-600">Stay present and reduce stress.</p>
                  </div>
                </div>

                <div onClick={() => navigate('/browse?filter=Productivity')} className="flex items-center bg-lavender/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-indigo-200">
                  <div className="w-16 h-16 bg-lavender rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Time Management</h4>
                    <p className="text-gray-600">Boost your productivity and focus.</p>
                  </div>
                </div>

                <div onClick={() => navigate('/browse?filter=Emotional')} className="flex items-center bg-pastel-green/30 p-4 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="w-16 h-16 bg-pastel-green rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Emotional Health</h4>
                    <p className="text-gray-600">Navigate your feelings with support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Stress & Anxiety', 'Career Coaching', 'Relationships', 'Nutrition', 'Fitness', 'Sleep'].map((cat) => (
                  <div
                    key={cat}
                    onClick={() => navigate(`/browse?filter=${cat}`)}
                    className="bg-white p-6 rounded-xl shadow-soft text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100 hover:-translate-y-1"
                  >
                    <h4 className="font-bold text-lg text-gray-900">{cat}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Individual Users Section */}
      <section className="py-20 bg-gray-50/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Individual Users</h2>
              <h3 className="text-4xl font-extrabold text-gray-900 leading-tight">Everything you need for your mental health journey</h3>
            </div>
            <div className="hidden md:block">
              <Button onClick={() => navigate('/browse')} variant="outline" className="rounded-full px-8 py-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Explore Platform <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Expert Matching",
                desc: "Find the perfect mental health expert using AI, tailored to your specific needs and preferences.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: Calendar,
                title: "Smart Booking System",
                desc: "Schedule sessions with conflict detection and automated reminders to keep your journey on track.",
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                icon: MessageCircle,
                title: "Real-time Chat",
                desc: "Secure messaging with experts for immediate support between sessions.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: BarChart2,
                title: "Progress Tracking",
                desc: "Monitor your mental health journey with personalized analytics and insightful progress reports.",
                color: "bg-orange-50 text-orange-600"
              },
              {
                icon: CreditCard,
                title: "Secure Payments",
                desc: "Global payment integration with a transparent credit system and pricing for worry-free transactions.",
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                icon: BookOpen,
                title: "Resource Library",
                desc: "Access curated articles, videos, and wellness content designed by top mental health professionals.",
                color: "bg-pink-50 text-pink-600"
              },
              {
                icon: Users,
                title: "Group Sessions",
                desc: "Join community workshops, classes, and webinars. Join group therapy sessions and workshops.",
                color: "bg-teal-50 text-teal-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start group hover:-translate-y-1">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}

            {/* Join CTA Card */}
            <div className="bg-emerald-600 p-8 rounded-2xl shadow-xl flex flex-col justify-between text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div>
                <h4 className="text-2xl font-bold mb-4 z-10 relative">Ready to begin?</h4>
                <p className="text-emerald-50 text-sm opacity-90 z-10 relative">Start your personalized journey to better wellbeing today.</p>
              </div>
              <button onClick={() => navigate('/onboarding')} className="mt-8 bg-white text-emerald-700 font-bold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-colors inline-flex items-center justify-center z-10 relative">
                Match Me Now <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "I found the perfect expert to help me manage stress and improve my work-life balance.",
                name: "Sarah L.",
                role: "Individual User",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
              },
              {
                text: "The platform is easy to use, and the experts are highly qualified. A game-changer for our team's wellbeing.",
                name: "Emily R.",
                role: "HR Manager",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
              },
              {
                text: "I've seen significant improvements in my focus and productivity. Highly recommend.",
                name: "Mark C.",
                role: "Individual User",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-primary/10">
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-cover bg-center mr-4 shadow-sm" style={{ backgroundImage: `url("${testimonial.img}")` }}></div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Experts Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
              <Users size={14} /> Join Our Community
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Empower others with your expertise</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We provide the tools. You provide the care. Join a global network of wellbeing professionals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Calendar Management",
                desc: "Manage availability and bookings effortlessly with our smart scheduling engine.",
                badge: "calendar"
              },
              {
                icon: Wallet,
                title: "Automated Payouts",
                desc: "Weekly payouts with transparent commission tracking and instant earning withdrawals.",
                badge: "money"
              },
              {
                icon: TrendingUp,
                title: "Performance Analytics",
                desc: "Track earnings, ratings, and session statistics with detailed growth reports.",
                badge: "growth"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Insights",
                desc: "Get profile optimization suggestions to increase your booking rate.",
                badge: "ai"
              },
              {
                icon: Star,
                title: "Review System",
                desc: "Build reputation through client feedback and verified rating badges.",
                badge: "reviews"
              },
              {
                icon: ClipboardList,
                title: "Session Notes",
                desc: "Secure note-taking with automated summaries and patient history tracking.",
                badge: "notes"
              }
            ].map((feature, idx) => (
              <Card key={idx} className="p-8 hover:shadow-2xl transition-all duration-300 border-none group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl shadow-2xl" onClick={() => navigate('/signup?role=expert')}>
              Apply as an Expert <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Corporate / B2B Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
                <Briefcase size={14} /> For Organizations
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Empower your workforce with <span className="text-emerald-600">Serene for Teams</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Provide your employees with instant access to world-class wellbeing experts, mental health support, and specialized corporate wellness sessions. Reduce burnout and boost engagement effortlessly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Corporate Wellness", desc: "Bulk employee access with custom tiered pricing.", icon: Globe },
                  { title: "Usage Analytics", desc: "Monitor employee engagement and sessions utilization.", icon: PieChart },
                  { title: "Credit Management", desc: "Flexible credit allocation system for all departments.", icon: Wallet },
                  { title: "HIPAA Compliant", desc: "Enterprise-grade security, privacy and encryption.", icon: Lock }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1 flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100" onClick={() => navigate('/company-onboarding')}>
                  Setup Team Dashboard
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/signup?role=company')}>
                  View B2B Features
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full"></div>
              <Card className="relative p-2 rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
                <img src="https://images.unsplash.com/photo-1522071823991-b1ae5e6a3048?auto=format&fit=crop&q=80&w=1200" className="rounded-[2rem] w-full" alt="Team wellbeing" />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>)}
                    </div>
                    <span className="text-sm font-bold text-gray-900">12+ People joined the wellness session </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Happening Now: "Mindful Leadership Workshop"</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate CTA moved to bottom as a final reminder */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="bg-emerald-600 rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
            </div>
            <div className="text-center md:text-left max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join 500+ forward-thinking companies</h2>
              <p className="mt-4 text-lg text-emerald-50">Invest in your people. Start your corporate wellbeing journey today with a 30-day free consultation.</p>
            </div>
            <div className="flex-shrink-0 relative z-10">
              <button onClick={() => navigate('/company-onboarding')} className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-white text-emerald-700 text-lg font-bold hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                <span className="truncate">Talk to an Expert</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
