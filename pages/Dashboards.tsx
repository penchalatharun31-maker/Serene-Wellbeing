import React, { useState } from 'react';
import { Card, Button, Badge, Input, ImageUpload } from '../components/UI';
import { UPCOMING_SESSIONS, PAST_SESSIONS, REVENUE_DATA, ENGAGEMENT_DATA } from '../data';
import { Activity, BadgeCheck, BarChart2, Calendar, CheckCircle, ChevronRight, Clock, CreditCard, DollarSign, Download, LayoutDashboard, Mail, MessageCircle, Plus, PlusCircle, Search, Settings, ShieldCheck, Star, TrendingUp, Trash, Users, Video, XCircle, ArrowRight, Briefcase, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { PaymentModal } from '../components/PaymentModal';
import { expertService } from '../services/expert.service';
import apiClient from '../services/api';

// --- Shared Components ---

const StatCard: React.FC<{ label: string; value: string; icon: any; trend?: string; color?: string }> = ({ label, value, icon: Icon, trend, color = 'emerald' }) => {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color] || colors.emerald}`}>
                    <Icon size={24} />
                </div>
                {trend && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </Card>
    );
};

const SessionRow: React.FC<{ session: any; isPast?: boolean }> = ({ session, isPast }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 transition-colors gap-4">
        <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl font-bold border flex-shrink-0 ${isPast ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                <span className="text-xs uppercase">{session.date.split(' ')[0]}</span>
                <span className="text-lg">{session.date.split(' ')[1].replace(',', '')}</span>
            </div>
            <div>
                <h4 className="font-bold text-gray-900">{session.type}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                    with {session.expertName} • {session.time}
                </p>
            </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            {isPast ? (
                <Button size="sm" variant="ghost" className="w-full sm:w-auto">View Notes</Button>
            ) : (
                <>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">Reschedule</Button>
                    <Link to={`/session/${session.id}/video`}>
                        <Button size="sm" className="w-full sm:w-auto text-white bg-emerald-600 hover:bg-emerald-700">Join Video</Button>
                    </Link>
                </>
            )}
        </div>
    </div>
);

// --- USER DASHBOARD VIEWS ---

export const UserDashboard: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleTopUpSuccess = (credits: number) => {
        if (user) {
            updateUser({ credits: (user.credits || 0) + credits });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                    <p className="text-gray-500">Here's your personalized wellbeing overview.</p>
                </div>
                <Button onClick={() => navigate('/browse')}>Book New Session</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
                        <Link to="/dashboard/user/sessions" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {UPCOMING_SESSIONS.map(s => <SessionRow key={s.id} session={s} />)}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
                        <div className="flex justify-between items-start mb-8">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <CreditCard className="text-emerald-400" size={24} />
                            </div>
                            <Badge color="emerald">Active</Badge>
                        </div>
                        <div className="mb-2">
                            <p className="text-gray-400 text-sm">Available Credits</p>
                            <h3 className="text-4xl font-bold">{user?.credits || 0}</h3>
                        </div>
                        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-400 border-none text-white mt-4" onClick={() => setIsPaymentModalOpen(true)}>Top Up Credits</Button>
                    </Card>

                    <PaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        onSuccess={handleTopUpSuccess}
                        currency={user?.currency}
                    />

                    <Card className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Recommended for you</h3>
                        <div className="flex items-center gap-3 mb-3">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">Stress Management</p>
                                <p className="text-xs text-gray-500 truncate">Workshop • Dr. Anya</p>
                            </div>
                            <Button size="sm" variant="ghost" className="p-2"><ChevronRight size={16} /></Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const UserSessions: React.FC = () => {
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Sessions</h1>

            <div className="flex border-b border-gray-200">
                <button
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${tab === 'upcoming' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${tab === 'past' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setTab('past')}
                >
                    Past History
                </button>
            </div>

            <div className="space-y-4">
                {tab === 'upcoming' ? (
                    UPCOMING_SESSIONS.length > 0 ? (
                        UPCOMING_SESSIONS.map(s => <SessionRow key={s.id} session={s} />)
                    ) : (
                        <p className="text-gray-500 text-center py-8">No upcoming sessions.</p>
                    )
                ) : (
                    PAST_SESSIONS.length > 0 ? (
                        PAST_SESSIONS.map(s => <SessionRow key={s.id} session={s} isPast />)
                    ) : (
                        <p className="text-gray-500 text-center py-8">No session history.</p>
                    )
                )}
            </div>
        </div>
    );
};

export const UserSettings: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" defaultValue="Sarah Johnson" />
                        <Input label="Email" defaultValue="sarah@example.com" />
                        <Input label="Phone Number" defaultValue="+1 (555) 000-0000" />
                        <Input label="Location" defaultValue="San Francisco, CA" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                <p className="text-xs text-gray-500">Receive updates about your sessions.</p>
                            </div>
                            <input type="checkbox" className="toggle text-emerald-500" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">SMS Reminders</p>
                                <p className="text-xs text-gray-500">Get text alerts 15 minutes before sessions.</p>
                            </div>
                            <input type="checkbox" className="toggle text-emerald-500" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
                    <ImageUpload />
                </Card>
            </div>
        </div>
    </div>
);

// --- EXPERT DASHBOARD VIEWS ---

export const ExpertDashboard: React.FC = () => {
    const { user } = useAuth();

    // Mock expert data for completeness calculation
    const mockExpert = {
        profilePhoto: user?.avatar,
        qualifications: ['MSc Psychology'],
        specializations: ['Mindfulness', 'Stress Management'],
        bio: 'Experienced mindfulness coach helping professionals find peace in their busy lives.',
        sessionRate: 1500,
        calLink: 'https://cal.com/expert',
        // Missing bank details, video intro, etc. to show partial completeness
    };

    const { percentage, message } = expertService.calculateProfileCompleteness(mockExpert);

    return (
        <div className="space-y-8">
            {/* Profile Completeness Alert */}
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BadgeCheck size={120} className="text-emerald-600" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">Profile Completeness</h2>
                            <Badge color={percentage > 80 ? 'emerald' : 'orange'}>{percentage}% Complete</Badge>
                        </div>
                        <p className="text-gray-600 font-medium">{message}</p>
                        <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden border border-emerald-100/50">
                            <div
                                className="bg-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200">
                        Complete Profile <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </Card>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:inline">Availability:</span>
                    <Badge color="emerald">Online</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value="$12,450" icon={DollarSign} trend="+12%" color="emerald" />
                <StatCard label="Total Sessions" value="145" icon={Calendar} trend="+5%" color="blue" />
                <StatCard label="Active Clients" value="48" icon={Users} trend="+8%" color="purple" />
                <StatCard label="Avg. Rating" value="4.9" icon={Activity} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Revenue Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} prefix="$" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Upcoming Bookings</h3>
                        <Button size="sm" variant="ghost">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="text-center min-w-[3rem]">
                                    <p className="text-xs text-gray-500 font-medium">10:00</p>
                                    <p className="text-xs text-gray-400">AM</p>
                                </div>
                                <div className="border-l-2 border-emerald-500 pl-4">
                                    <p className="text-sm font-bold text-gray-900">Sarah Johnson</p>
                                    <p className="text-xs text-gray-500">Mindfulness Session</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* B2B / Corporate Differentiators Section */}
                <Card className="p-6 border-indigo-100 bg-indigo-50/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Briefcase size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">Corporate Tier</h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Required for B2B Bookings</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-50 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    <span className="text-sm font-medium">Background Verification</span>
                                </div>
                                <Badge color="emerald">Verified</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-50 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-gray-400" />
                                    <span className="text-sm font-medium">Professional Insurance</span>
                                </div>
                                <Button size="xs" variant="outline" className="text-[10px] h-7 px-2">Upload Doc</Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-50 shadow-sm opacity-60">
                                <div className="flex items-center gap-3">
                                    <DollarSign size={18} className="text-gray-400" />
                                    <span className="text-sm font-medium">GST Registration</span>
                                </div>
                                <span className="text-[10px] text-gray-400 italic">Optional</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-indigo-100/50">
                            <Link to="/expert-b2b-setup" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group">
                                Manage Corporate Rate Card
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const ExpertBookings: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetch = async () => {
            try {
                const res = await apiClient.get('/sessions/expert/all');
                setBookings(res.data?.sessions || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await apiClient.put(`/sessions/${id}`, { status });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        } catch (e: any) {
            console.error('Failed to update session:', e.message);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4">All Bookings</h3>
                    {loading && <p className="text-sm text-gray-400">Loading bookings...</p>}
                    {!loading && bookings.length === 0 && <p className="text-sm text-gray-400">No bookings yet.</p>}
                    <div className="space-y-4">
                        {bookings.map((booking: any) => {
                            const userName = booking.userId?.name || 'Client';
                            return (
                                <div key={booking._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                            {userName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{userName}</h4>
                                            <p className="text-sm text-gray-500">{booking.duration}min • {booking.scheduledDate && formatDate(booking.scheduledDate)} {booking.scheduledTime || ''}</p>
                                        </div>
                                    </div>
                                    {booking.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(booking._id, 'confirmed')}><CheckCircle size={16} className="mr-1" /> Accept</Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleStatusChange(booking._id, 'cancelled')}><XCircle size={16} className="mr-1" /> Decline</Button>
                                        </div>
                                    ) : (
                                        <Badge color={booking.status === 'confirmed' ? 'emerald' : 'orange'}>{booking.status}</Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start"><Calendar size={16} className="mr-2" /> Sync Calendar</Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/expert/availability')}><Clock size={16} className="mr-2" /> Update Availability</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const ExpertAvailability: React.FC = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    const [selectedSlots, setSelectedSlots] = useState<string[]>(['Mon-9:00 AM', 'Mon-10:00 AM', 'Tue-10:00 AM']);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const toggleSlot = (day: string, hour: string) => {
        const key = `${day}-${hour}`;
        if (selectedSlots.includes(key)) {
            setSelectedSlots(selectedSlots.filter(s => s !== key));
        } else {
            setSelectedSlots([...selectedSlots, key]);
        }
    };

    const parse12to24 = (time12: string): string => {
        const [timePart, period] = time12.split(' ');
        let [h, m] = timePart.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            const dayMap: Record<string, string> = { Mon: 'monday', Tue: 'tuesday', Wed: 'wednesday', Thu: 'thursday', Fri: 'friday', Sat: 'saturday', Sun: 'sunday' };
            const availability: Record<string, Array<{ start: string; end: string }>> = {
                monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
            };
            selectedSlots.forEach(slot => {
                const [day, ...rest] = slot.split('-');
                const time12 = rest.join('-');
                const start = parse12to24(time12);
                const [h, m] = start.split(':').map(Number);
                const endH = h + 1;
                const end = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                const dayKey = dayMap[day];
                if (dayKey) availability[dayKey].push({ start, end });
            });
            await apiClient.put('/experts/my-availability', { availability });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (e) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Sync Google Calendar</Button>
                    <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Failed' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                <p className="text-sm text-gray-500 mb-6">Click on the slots below to mark your availability for recurring weekly sessions.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {days.map(day => (
                                    <th key={day} className="p-2 font-semibold text-gray-700">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map(hour => (
                                <tr key={hour}>
                                    <td className="p-2 font-medium text-gray-500 text-right pr-4">{hour}</td>
                                    {days.map(day => {
                                        const isSelected = selectedSlots.includes(`${day}-${hour}`);
                                        return (
                                            <td key={`${day}-${hour}`} className="p-1">
                                                <div
                                                    onClick={() => toggleSlot(day, hour)}
                                                    className={`h-10 rounded-md cursor-pointer transition-all border ${isSelected
                                                        ? 'bg-emerald-50 border-emerald-600 shadow-sm'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                ></div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const ExpertCreateGroupSession: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Group Session</h1>
            <Card className="p-8">
                <form className="space-y-6">
                    <Input label="Session Title" placeholder="e.g., Morning Mindfulness Workshop" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Date" type="date" />
                        <Input label="Time" type="time" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Price per person ($)" type="number" placeholder="20" />
                        <Input label="Max Attendees" type="number" placeholder="15" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border" rows={4} placeholder="What will participants learn?" />
                    </div>

                    <ImageUpload label="Cover Image" />

                    <div className="flex justify-end pt-4">
                        <Button size="lg">Publish Session</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export const ExpertClients: React.FC = () => {
    const clients = [
        { id: 1, name: "Sarah Johnson", sessions: 12, lastSeen: "2 days ago", next: "Aug 12" },
        { id: 2, name: "Michael Brown", sessions: 5, lastSeen: "1 week ago", next: "Aug 15" },
        { id: 3, name: "Emily Davis", sessions: 3, lastSeen: "3 weeks ago", next: "Pending" },
        { id: 4, name: "Jessica Wilson", sessions: 20, lastSeen: "Yesterday", next: "Aug 10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search clients..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Total Sessions</th>
                                <th className="px-6 py-3 font-medium">Last Seen</th>
                                <th className="px-6 py-3 font-medium">Next Session</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{client.sessions}</td>
                                    <td className="px-6 py-4 text-gray-600">{client.lastSeen}</td>
                                    <td className="px-6 py-4 text-gray-600">{client.next}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="sm" variant="ghost">Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const ExpertEarnings: React.FC = () => {
    const [earnings, setEarnings] = useState<any>(null);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [payoutModalOpen, setPayoutModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [upiId, setUpiId] = useState('');
    const [bankDetails, setBankDetails] = useState({ accountHolderName: '', accountNumber: '', ifscCode: '' });
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        fetchEarnings();
        fetchPayouts();
    }, []);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/payouts/earnings');
            setEarnings(response.data.data);
        } catch (err: any) {
            console.error('Error fetching earnings:', err);
            setError(err.message || 'Failed to load earnings');
        } finally {
            setLoading(false);
        }
    };

    const fetchPayouts = async () => {
        try {
            const response = await apiClient.get('/payouts/my-payouts');
            setPayouts(response.data.data || []);
        } catch (err: any) {
            console.error('Error fetching payouts:', err);
        }
    };

    const handleRequestPayout = async () => {
        try {
            setRequesting(true);
            const amount = parseFloat(payoutAmount);

            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            const paymentDetails: any = {};
            if (paymentMethod === 'upi') {
                if (!upiId) {
                    alert('Please enter UPI ID');
                    return;
                }
                paymentDetails.upiId = upiId;
            } else if (paymentMethod === 'bank_transfer') {
                if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
                    alert('Please fill all bank details');
                    return;
                }
                paymentDetails.accountHolderName = bankDetails.accountHolderName;
                paymentDetails.accountNumber = bankDetails.accountNumber;
                paymentDetails.ifscCode = bankDetails.ifscCode;
            }

            await apiClient.post('/payouts', {
                amount,
                paymentMethod,
                paymentDetails,
            });

            setPayoutModalOpen(false);
            setPayoutAmount('');
            setUpiId('');
            setBankDetails({ accountHolderName: '', accountNumber: '', ifscCode: '' });
            await fetchEarnings();
            await fetchPayouts();
            alert('Payout request submitted successfully!');
        } catch (err: any) {
            console.error('Error requesting payout:', err);
            alert(err.message || 'Failed to request payout');
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
                <span className="ml-3 text-gray-600">Loading earnings...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchEarnings} variant="outline">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Available for Payout"
                    value={`${earnings?.currency || 'INR'} ${earnings?.availableBalance?.toFixed(2) || '0.00'}`}
                    icon={DollarSign}
                    color="emerald"
                />
                <StatCard
                    label="Pending Payouts"
                    value={`${earnings?.currency || 'INR'} ${earnings?.pendingPayouts?.toFixed(2) || '0.00'}`}
                    icon={Clock}
                    color="orange"
                />
                <Card className="p-6 flex flex-col justify-center items-center text-center">
                    <Button
                        className="w-full mb-2"
                        onClick={() => setPayoutModalOpen(true)}
                        disabled={(earnings?.availableBalance || 0) <= 0}
                    >
                        Request Payout
                    </Button>
                    <p className="text-xs text-gray-500">Payouts processed within 3-5 business days</p>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-6">Payout History</h3>
                {payouts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No payout requests yet</p>
                ) : (
                    <div className="space-y-4">
                        {payouts.map(payout => (
                            <div key={payout._id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-bold text-gray-900">
                                        Payout Request ({payout.paymentMethod.replace('_', ' ')})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(payout.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">-{payout.currency} {payout.amount.toFixed(2)}</p>
                                    <span className={`text-xs ${
                                        payout.status === 'pending' ? 'text-orange-500' :
                                        payout.status === 'approved' ? 'text-blue-500' :
                                        payout.status === 'completed' ? 'text-emerald-500' :
                                        'text-red-500'
                                    }`}>
                                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Payout Request Modal */}
            {payoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Payout</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount ({earnings?.currency || 'INR'})
                                </label>
                                <input
                                    type="number"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="0.00"
                                    max={earnings?.availableBalance || 0}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Available: {earnings?.currency || 'INR'} {earnings?.availableBalance?.toFixed(2) || '0.00'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            {paymentMethod === 'upi' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="yourname@upi"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountHolderName}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.ifscCode}
                                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setPayoutModalOpen(false)}
                                disabled={requesting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRequestPayout}
                                disabled={requesting}
                            >
                                {requesting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export const ExpertSettings: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Public Profile</h3>
                    <div className="space-y-4">
                        <Input label="Display Name" defaultValue="Dr. Anya Sharma" />
                        <Input label="Professional Title" defaultValue="Clinical Psychologist" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border" rows={4} defaultValue="Specializing in cognitive behavioral therapy..." />
                        </div>
                        <Input label="Hourly Rate ($)" type="number" defaultValue="180" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button>Save Profile</Button>
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Photo</h3>
                    <ImageUpload />
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                    <p className="text-sm text-gray-500 mb-4">Set your weekly schedule to allow clients to book sessions.</p>
                    <Link to="/dashboard/expert/availability">
                        <Button variant="outline" className="w-full">Manage Schedule</Button>
                    </Link>
                </Card>
            </div>
        </div>
    </div>
);

// --- COMPANY DASHBOARD VIEWS ---
import { InviteEmployeeModal } from '../components/InviteEmployeeModal';
import { AddAdminModal } from '../components/AddAdminModal';

export const CompanyDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Acme Co. Wellbeing</h1>
                    <p className="text-gray-500 mt-2">Manage your company's credits and engagement.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="text-center sm:text-right">
                        <p className="text-sm text-gray-500">Corporate Balance</p>
                        <p className="text-2xl font-bold text-emerald-600">5,000 Credits</p>
                    </div>
                    <Button size="lg" onClick={() => window.location.hash = '#/dashboard/company/billing'}>Buy Credits</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Employee Engagement</h3>
                        <Badge color="emerald">+15% vs last month</Badge>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ENGAGEMENT_DATA}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Credit Usage by Department</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Engineering', val: 75 },
                            { name: 'Marketing', val: 45 },
                            { name: 'Sales', val: 60 },
                            { name: 'HR', val: 30 }
                        ].map(dept => (
                            <div key={dept.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{dept.name}</span>
                                    <span className="text-gray-500">{dept.val}% Used</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${dept.val}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const CompanyEmployees: React.FC = () => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [employees, setEmployees] = useState([
        { id: 1, name: "Alice Freeman", email: "alice@acme.com", department: "Engineering", status: "Active" },
        { id: 2, name: "Bob Smith", email: "bob@acme.com", department: "Sales", status: "Active" },
        { id: 3, name: "Charlie Davis", email: "charlie@acme.com", department: "Marketing", status: "Invited" },
    ]);

    const handleInvite = (email: string, name: string, department: string) => {
        setEmployees([...employees, { id: Date.now(), name, email, department, status: 'Invited' }]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                <Button onClick={() => setIsInviteModalOpen(true)}><Plus size={18} className="mr-2" /> Invite Employee</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Department</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                                    <td className="px-6 py-4">
                                        <Badge color={emp.status === 'Active' ? 'emerald' : 'gray'}>{emp.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="sm" variant="ghost" onClick={() => alert(`Manage ${emp.name}`)}>Manage</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <InviteEmployeeModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />
        </div>
    );
};

export const CompanyCredits: React.FC = () => {
    // Reusing user payment modal for simplicity, but in real app this would be corporate billing
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Credits & Billing</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { credits: 1000, price: 900, discount: "10%" },
                    { credits: 5000, price: 4000, discount: "20%" },
                    { credits: 10000, price: 7500, discount: "25%" },
                ].map((pkg, idx) => (
                    <Card key={idx} className="p-6 text-center border hover:border-emerald-300 transition-colors cursor-pointer">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.credits} Credits</h3>
                        <p className="text-3xl font-bold text-emerald-600 mb-2">${pkg.price}</p>
                        <Badge color="blue">Save {pkg.discount}</Badge>
                        <Button className="w-full mt-6" onClick={() => setIsPaymentModalOpen(true)}>Purchase</Button>
                    </Card>
                ))}
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Purchase History</h3>
                    <Button size="sm" variant="outline" onClick={() => {
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,Invoice%20Export';
                        link.download = 'invoice.txt';
                        link.click();
                    }}><Download size={16} className="mr-2" /> Export Invoice</Button>
                </div>
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                            <div>
                                <p className="font-medium text-gray-900">5000 Credits Pack</p>
                                <p className="text-xs text-gray-500">Invoice #INV-2024-00{i} • Oct 20, 2024</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">$4,000.00</p>
                                    <span className="text-xs text-emerald-600">Paid</span>
                                </div>
                                <Link to={`/invoice/${i}`}>
                                    <Button size="sm" variant="ghost">View</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={() => alert('Corporate purchase successful (Simulation)')}
                currency="USD"
            />
        </div>
    );
};

export const CompanySettings: React.FC = () => {
    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Company Name" defaultValue="Acme Co." />
                    <Input label="Industry" defaultValue="Technology" />
                    <Input label="Billing Email" defaultValue="billing@acme.com" />
                    <Input label="Address" defaultValue="123 Tech Blvd, San Francisco, CA" />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </Card>
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Users</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">A</div>
                            <div>
                                <p className="font-medium text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">admin@acme.com</p>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost">Remove</Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddAdminOpen(true)}>
                        <Plus size={16} className="mr-2" /> Add Admin
                    </Button>
                </div>
            </Card>

            <AddAdminModal
                isOpen={isAddAdminOpen}
                onClose={() => setIsAddAdminOpen(false)}
                onAdd={(email, name) => console.log('Admin added', email, name)}
            />
        </div>
    );
};
