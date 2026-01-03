import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, ImageUpload } from '../components/UI';
import { Users, DollarSign, AlertTriangle, TrendingUp, MoreHorizontal, Check, X, Briefcase, Calendar, Settings, Tag, Edit, CreditCard, FileText, Loader2 } from 'lucide-react';
import apiClient from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { REVENUE_DATA } from '../data';
import { LanguageSettings, AccessibilitySettings } from './ExtraPages';

// --- SUB-COMPONENTS ---

const AdminOverview: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'bg-blue-50 text-blue-600' },
                { label: 'Total Revenue', value: '$1.23M', change: '+8%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Active Disputes', value: '23', change: '-2%', icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
                { label: 'Growth Rate', value: '15%', change: '+1.2%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
            ].map((stat, idx) => (
                <Card key={idx} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
                <h3 className="font-bold text-gray-900 mb-6">Revenue Trends</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">User registration: Sophia B.</span>
                            <span className="text-gray-400 text-xs">2m ago</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
);

const ExpertApprovals: React.FC = () => {
    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingExperts();
    }, []);

    const fetchPendingExperts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get('/admin/experts/pending');
            setExperts(response.data.data || []);
        } catch (err: any) {
            console.error('Error fetching pending experts:', err);
            setError(err.message || 'Failed to load expert applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (expertId: string) => {
        try {
            setProcessingId(expertId);
            await apiClient.put(`/admin/experts/${expertId}/approve`);
            // Refresh the list after approval
            await fetchPendingExperts();
        } catch (err: any) {
            console.error('Error approving expert:', err);
            alert(err.message || 'Failed to approve expert. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (expertId: string) => {
        if (!confirm('Are you sure you want to reject this expert application?')) {
            return;
        }

        try {
            setProcessingId(expertId);
            await apiClient.put(`/admin/experts/${expertId}/reject`);
            // Refresh the list after rejection
            await fetchPendingExperts();
        } catch (err: any) {
            console.error('Error rejecting expert:', err);
            alert(err.message || 'Failed to reject expert. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Expert Applications</h1>
                {!loading && (
                    <button
                        onClick={fetchPendingExperts}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Refresh
                    </button>
                )}
            </div>

            <Card>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                        <span className="ml-3 text-gray-600">Loading expert applications...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchPendingExperts} variant="outline">
                            Try Again
                        </Button>
                    </div>
                ) : experts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No pending expert applications</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Specialty</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Applied</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {experts.map(expert => (
                                <tr key={expert._id}>
                                    <td className="px-6 py-4 font-medium">{expert.fullName || expert.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{expert.specialty || expert.specialties?.[0] || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500">{expert.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{formatDate(expert.createdAt)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleApprove(expert._id)}
                                            disabled={processingId === expert._id}
                                            className="text-emerald-600 hover:bg-emerald-50 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Approve expert"
                                        >
                                            {processingId === expert._id ? (
                                                <Loader2 className="animate-spin" size={18} />
                                            ) : (
                                                <Check size={18} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReject(expert._id)}
                                            disabled={processingId === expert._id}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Reject expert"
                                        >
                                            <X size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};

const AdminCompanies: React.FC = () => {
    const companies = [
        { id: 1, name: 'Acme Corp', employees: 120, plan: 'Enterprise', status: 'Active' },
        { id: 2, name: 'TechStart Inc', employees: 45, plan: 'Growth', status: 'Active' },
        { id: 3, name: 'Wellness Ltd', employees: 200, plan: 'Enterprise', status: 'Active' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Registered Companies</h1>
                <Button size="sm"><Briefcase size={16} className="mr-2" /> Add Company</Button>
            </div>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Company Name</th>
                            <th className="px-6 py-3 font-medium">Employees</th>
                            <th className="px-6 py-3 font-medium">Plan</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {companies.map(comp => (
                            <tr key={comp.id}>
                                <td className="px-6 py-4 font-medium">{comp.name}</td>
                                <td className="px-6 py-4">{comp.employees}</td>
                                <td className="px-6 py-4"><Badge color="purple">{comp.plan}</Badge></td>
                                <td className="px-6 py-4"><Badge color="emerald">{comp.status}</Badge></td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost">Manage</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const AdminBookings: React.FC = () => {
    const bookings = [
        { id: 'B-501', expert: 'Dr. Anya Sharma', user: 'Sarah Johnson', date: 'Jul 12, 10:00 AM', amount: '$180' },
        { id: 'B-502', expert: 'Ethan Carter', user: 'Mike Brown', date: 'Jul 12, 2:00 PM', amount: '$95' },
        { id: 'B-503', expert: 'Liam Foster', user: 'Emily Davis', date: 'Jul 13, 11:00 AM', amount: '$110' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Platform Bookings</h1>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Booking ID</th>
                            <th className="px-6 py-3 font-medium">Expert</th>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Date/Time</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map(b => (
                            <tr key={b.id}>
                                <td className="px-6 py-4 font-medium text-gray-500">{b.id}</td>
                                <td className="px-6 py-4 font-medium">{b.expert}</td>
                                <td className="px-6 py-4">{b.user}</td>
                                <td className="px-6 py-4">{b.date}</td>
                                <td className="px-6 py-4 font-bold text-emerald-600">{b.amount}</td>
                                <td className="px-6 py-4 text-right"><Badge color="emerald">Confirmed</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const CommissionTracking: React.FC = () => {
    const commissions = [
        { id: 'C-001', date: '2024-07-12', amount: '$180.00', platform: '$36.00', expert: '$144.00' },
        { id: 'C-002', date: '2024-07-12', amount: '$95.00', platform: '$19.00', expert: '$76.00' },
        { id: 'C-003', date: '2024-07-11', amount: '$120.00', platform: '$24.00', expert: '$96.00' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Commission Tracking</h1>
                <Badge color="blue">Platform Rate: 20%</Badge>
            </div>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Transaction ID</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Total Amount</th>
                            <th className="px-6 py-3 font-medium text-emerald-600">Platform Share</th>
                            <th className="px-6 py-3 font-medium text-blue-600">Expert Share</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {commissions.map(c => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 font-medium text-gray-600">{c.id}</td>
                                <td className="px-6 py-4 text-gray-500">{c.date}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{c.amount}</td>
                                <td className="px-6 py-4 font-bold text-emerald-600">{c.platform}</td>
                                <td className="px-6 py-4 font-bold text-blue-600">{c.expert}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const PayoutsManagement: React.FC = () => {
    const payouts = [
        { expert: 'Dr. Anya Sharma', balance: '$1,240.00', nextPayout: 'Fri, Jul 19', status: 'Processing' },
        { expert: 'Ethan Carter', balance: '$580.00', nextPayout: 'Fri, Jul 19', status: 'Pending' },
        { expert: 'Liam Foster', balance: '$890.00', nextPayout: 'Fri, Jul 19', status: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Expert</th>
                            <th className="px-6 py-3 font-medium">Pending Balance</th>
                            <th className="px-6 py-3 font-medium">Next Payout</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payouts.map((p, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 font-medium">{p.expert}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{p.balance}</td>
                                <td className="px-6 py-4 text-gray-500">{p.nextPayout}</td>
                                <td className="px-6 py-4"><Badge color={p.status === 'Processing' ? 'blue' : 'gray'}>{p.status}</Badge></td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="outline">Process</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const PromoManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
                <Button size="sm"><Tag size={16} className="mr-2" /> Create Code</Button>
            </div>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Code</th>
                            <th className="px-6 py-3 font-medium">Discount</th>
                            <th className="px-6 py-3 font-medium">Usage</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { code: 'WELCOME20', discount: '20%', usage: '145/500', status: 'Active' },
                            { code: 'SUMMER15', discount: '15%', usage: '89/200', status: 'Active' },
                            { code: 'EXPIRED10', discount: '10%', usage: '500/500', status: 'Expired' },
                        ].map((promo, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 font-mono font-bold text-gray-900">{promo.code}</td>
                                <td className="px-6 py-4 text-emerald-600 font-medium">{promo.discount}</td>
                                <td className="px-6 py-4 text-gray-500">{promo.usage}</td>
                                <td className="px-6 py-4"><Badge color={promo.status === 'Active' ? 'emerald' : 'red'}>{promo.status}</Badge></td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const CMSManagement: React.FC = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Homepage CMS</h1>
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hero Section</h3>
            <div className="space-y-4">
                <Input label="Main Headline" defaultValue="How can we help?" />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtext</label>
                    <textarea className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border" rows={3} defaultValue="Find answers, tips, and resources to help you on your wellbeing journey." />
                </div>
                <ImageUpload label="Background Image" />
            </div>
        </Card>
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Experts</h3>
            <p className="text-sm text-gray-500 mb-4">Select which experts appear on the landing page.</p>
            <div className="space-y-2">
                {['Dr. Anya Sharma', 'Ethan Carter', 'Olivia Bennett', 'Liam Foster'].map(name => (
                    <div key={name} className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                        <label className="ml-2 text-sm text-gray-900">{name}</label>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const Disputes: React.FC = () => {
    const disputes = [
        { id: 'D-101', user: 'Emily Carter', expert: 'Dr. Sarah Jones', issue: 'No-show', status: 'Open' },
        { id: 'D-102', user: 'David Lee', expert: 'Mark Thompson', issue: 'Quality Issue', status: 'Investigating' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution</h1>
            <Card>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Case ID</th>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Expert</th>
                            <th className="px-6 py-3 font-medium">Issue</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {disputes.map(d => (
                            <tr key={d.id}>
                                <td className="px-6 py-4 font-medium">{d.id}</td>
                                <td className="px-6 py-4">{d.user}</td>
                                <td className="px-6 py-4">{d.expert}</td>
                                <td className="px-6 py-4 text-red-600">{d.issue}</td>
                                <td className="px-6 py-4"><Badge color="blue">{d.status}</Badge></td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost">View Case</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const AdminSettings: React.FC = () => (
    <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Commission</h3>
                <div className="space-y-4">
                    <Input label="Standard Commission Rate (%)" defaultValue="20" type="number" />
                    <Input label="B2B Commission Rate (%)" defaultValue="15" type="number" />
                    <div className="flex justify-end">
                        <Button>Update Rates</Button>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                <LanguageSettings />
                <AccessibilitySettings />
            </div>
        </div>
    </div>
);

// --- MAIN ADMIN DASHBOARD COMPONENT ---

export { AdminOverview, ExpertApprovals, AdminCompanies, AdminBookings, CommissionTracking, PayoutsManagement, Disputes, PromoManagement, CMSManagement, AdminSettings };
