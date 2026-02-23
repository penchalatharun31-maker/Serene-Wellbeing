import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import {
  Users, DollarSign, TrendingUp, Calendar, Activity,
  UserPlus, CreditCard, BarChart3, PieChart, Target,
  ArrowUp, ArrowDown, Minus, Clock, Star, Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data - Replace with real API calls
const mockMetrics = {
  // Core Metrics
  totalUsers: 12847,
  activeUsers: 8932,
  newUsersToday: 247,
  newUsersThisMonth: 3421,

  // Revenue Metrics
  totalRevenue: 487234,
  mrr: 42567,
  arr: 510804,
  arpu: 38,

  // Engagement Metrics
  dau: 3421,
  mau: 8932,
  wau: 5234,
  averageSessionTime: 18.5, // minutes

  // Session Metrics
  totalSessions: 45231,
  completedSessions: 42156,
  upcomingSessions: 1247,

  // Growth Metrics
  userGrowthRate: 23.4, // percentage
  revenueGrowthRate: 18.7,
  churnRate: 4.2,
  retentionRate: 87.3,

  // Conversion Metrics
  conversionRate: 12.4,
  avgTimeToConvert: 5.2, // days
};

const userGrowthData = [
  { month: 'Jan', users: 5420, revenue: 185000 },
  { month: 'Feb', users: 6234, revenue: 225000 },
  { month: 'Mar', users: 7122, revenue: 267000 },
  { month: 'Apr', users: 8456, revenue: 312000 },
  { month: 'May', users: 9834, revenue: 365000 },
  { month: 'Jun', users: 10932, revenue: 421000 },
  { month: 'Jul', users: 12847, revenue: 487234 },
];

const revenueBreakdown = [
  { name: 'Subscriptions', value: 245000, color: '#10b981' },
  { name: 'Sessions', value: 187000, color: '#3b82f6' },
  { name: 'Corporate', value: 42000, color: '#8b5cf6' },
  { name: 'Credits', value: 13234, color: '#f59e0b' },
];

const engagementData = [
  { day: 'Mon', dau: 3245, sessions: 8234 },
  { day: 'Tue', dau: 3421, sessions: 8756 },
  { day: 'Wed', dau: 3156, sessions: 8123 },
  { day: 'Thu', dau: 3589, sessions: 9245 },
  { day: 'Fri', dau: 3734, sessions: 9567 },
  { day: 'Sat', dau: 2987, sessions: 7234 },
  { day: 'Sun', dau: 2823, sessions: 6987 },
];

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: any;
  trend?: number;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon: Icon, trend, subtitle, color = 'emerald' }) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <ArrowUp size={14} className="text-emerald-600" />;
    if (trend < 0) return <ArrowDown size={14} className="text-red-600" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';
    if (trend > 0) return 'text-emerald-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
      </h3>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </Card>
  );
};

export const FounderDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Founder Dashboard</h1>
          <p className="text-gray-500">Complete business metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant={timeframe === '7d' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeframe('7d')}>
            7 Days
          </Button>
          <Button variant={timeframe === '30d' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeframe('30d')}>
            30 Days
          </Button>
          <Button variant={timeframe === '90d' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeframe('90d')}>
            90 Days
          </Button>
          <Button variant={timeframe === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setTimeframe('all')}>
            All Time
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={mockMetrics.totalUsers}
          icon={Users}
          trend={mockMetrics.userGrowthRate}
          subtitle={`+${mockMetrics.newUsersToday} today`}
          color="emerald"
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${(mockMetrics.mrr / 1000).toFixed(1)}K`}
          icon={DollarSign}
          trend={mockMetrics.revenueGrowthRate}
          subtitle={`ARR: $${(mockMetrics.arr / 1000).toFixed(0)}K`}
          color="blue"
        />
        <MetricCard
          title="Daily Active Users"
          value={mockMetrics.dau}
          icon={Activity}
          trend={15.2}
          subtitle={`MAU: ${mockMetrics.mau.toLocaleString()}`}
          color="purple"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(mockMetrics.totalRevenue / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          trend={mockMetrics.revenueGrowthRate}
          subtitle={`ARPU: $${mockMetrics.arpu}`}
          color="orange"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Weekly Active Users"
          value={mockMetrics.wau}
          icon={UserPlus}
          trend={8.3}
          color="emerald"
        />
        <MetricCard
          title="Completed Sessions"
          value={mockMetrics.completedSessions}
          icon={Calendar}
          trend={12.7}
          subtitle={`${mockMetrics.upcomingSessions} upcoming`}
          color="blue"
        />
        <MetricCard
          title="Retention Rate"
          value={`${mockMetrics.retentionRate}%`}
          icon={Target}
          trend={2.4}
          subtitle={`Churn: ${mockMetrics.churnRate}%`}
          color="purple"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${mockMetrics.conversionRate}%`}
          icon={Zap}
          trend={1.8}
          subtitle={`Avg: ${mockMetrics.avgTimeToConvert} days`}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">User Growth & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                fill="url(#colorUsers)"
                strokeWidth={2}
                name="Total Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            </RePieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Daily Active Users & Sessions (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Bar dataKey="dau" fill="#10b981" name="Daily Active Users" />
            <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Metrics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Metrics */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Growth Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">User Growth Rate</span>
              <span className="font-bold text-emerald-600">+{mockMetrics.userGrowthRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Revenue Growth Rate</span>
              <span className="font-bold text-emerald-600">+{mockMetrics.revenueGrowthRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">New Users (Month)</span>
              <span className="font-bold text-gray-900">{mockMetrics.newUsersThisMonth.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-bold text-gray-900">{mockMetrics.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Avg Session Time</span>
              <span className="font-bold text-gray-900">{mockMetrics.averageSessionTime} min</span>
            </div>
          </div>
        </Card>

        {/* Financial Metrics */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Financial Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">MRR</span>
              <span className="font-bold text-gray-900">${mockMetrics.mrr.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">ARR</span>
              <span className="font-bold text-gray-900">${mockMetrics.arr.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">ARPU</span>
              <span className="font-bold text-gray-900">${mockMetrics.arpu}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Churn Rate</span>
              <span className="font-bold text-red-600">{mockMetrics.churnRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="font-bold text-emerald-600">{mockMetrics.retentionRate}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">DAU/MAU Ratio</p>
          <p className="text-2xl font-bold text-emerald-600">
            {((mockMetrics.dau / mockMetrics.mau) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Session Completion</p>
          <p className="text-2xl font-bold text-blue-600">
            {((mockMetrics.completedSessions / mockMetrics.totalSessions) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Avg Revenue/User</p>
          <p className="text-2xl font-bold text-purple-600">
            ${(mockMetrics.totalRevenue / mockMetrics.totalUsers).toFixed(0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
          <p className="text-2xl font-bold text-orange-600">
            +{mockMetrics.userGrowthRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;
