import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar, DashboardSidebar, Footer } from './components/Layout';
import { CrisisAlert } from './components/CrisisAlert';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import CompanyOnboarding from './pages/CompanyOnboarding';
import ExpertOnboarding from './pages/ExpertOnboarding';
import UnderReview from './pages/UnderReview';
import Browse from './pages/Browse';
import ExpertProfile from './pages/ExpertProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Resources from './pages/Resources';
import GroupSessions from './pages/GroupSessions';
import Messages from './pages/Messages';
import Invoice from './pages/Invoice';
import CommissionSplit from './pages/CommissionSplit';
import { Referrals, RefundPolicy, RateSession, LanguageSettings, AccessibilitySettings } from './pages/ExtraPages';
import { AdminOverview, ExpertApprovals, AdminCompanies, AdminBookings, Disputes, AdminSettings, CommissionTracking, PayoutsManagement, PromoManagement, CMSManagement } from './pages/AdminDashboard';
import {
    UserDashboard, UserSessions, UserSettings,
    ExpertDashboard, ExpertBookings, ExpertClients, ExpertEarnings, ExpertSettings, ExpertAvailability, ExpertCreateGroupSession,
    CompanyDashboard, CompanyEmployees, CompanyCredits, CompanySettings
} from './pages/Dashboards';
import AICompanion from './pages/AICompanion';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import WellnessChallenges from './pages/WellnessChallenges';
import ContentLibrary from './pages/ContentLibrary';
import FounderDashboard from './pages/FounderDashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { VideoSession } from './pages/VideoSession';
import Pricing from './frontend/src/pages/Pricing';

// Layout wrapper for dashboard pages to include Sidebar
const DashboardLayout: React.FC<{ type: 'user' | 'expert' | 'company' | 'super_admin' }> = ({ type }) => (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 gap-8">
            <DashboardSidebar type={type} />
            <main className="flex-1 pb-12 w-full overflow-hidden">
                <Outlet />
            </main>
        </div>
    </div>
);

// Layout for public pages
const PublicLayout: React.FC = () => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
            <Outlet />
        </div>
        <Footer />
    </div>
);

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <CrisisAlert />
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/company-onboarding" element={<CompanyOnboarding />} />
                    <Route path="/expert-onboarding" element={<ExpertOnboarding />} />
                    <Route path="/under-review" element={<UnderReview />} />

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/browse" element={<Browse />} />
                        <Route path="/expert/:id" element={<ExpertProfile />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/group-sessions" element={<GroupSessions />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/refund-policy" element={<RefundPolicy />} />
                        <Route path="/referrals" element={<Referrals />} />
                        <Route path="/rate-session" element={<RateSession />} />
                        <Route path="/commission-split" element={<CommissionSplit />} />
                        <Route path="/commission-split" element={<CommissionSplit />} />
                        <Route path="/invoice/:id" element={<Invoice />} />
                        <Route path="/session/:sessionId/video" element={<ProtectedRoute><VideoSession /></ProtectedRoute>} />
                    </Route>

                    {/* Protected User Dashboard Routes - Only accessible to 'user' role */}
                    <Route
                        path="/dashboard/user"
                        element={
                            <ProtectedRoute allowedRoles={['user']}>
                                <DashboardLayout type="user" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<UserDashboard />} />
                        <Route path="sessions" element={<UserSessions />} />
                        <Route path="settings" element={<UserSettings />} />
                    </Route>

                    {/* Protected Expert Dashboard Routes - Only accessible to 'expert' role */}
                    <Route
                        path="/dashboard/expert"
                        element={
                            <ProtectedRoute allowedRoles={['expert']}>
                                <DashboardLayout type="expert" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<ExpertDashboard />} />
                        <Route path="bookings" element={<ExpertBookings />} />
                        <Route path="availability" element={<ExpertAvailability />} />
                        <Route path="group-sessions" element={<ExpertCreateGroupSession />} />
                        <Route path="clients" element={<ExpertClients />} />
                        <Route path="earnings" element={<ExpertEarnings />} />
                        <Route path="profile" element={<ExpertSettings />} />
                    </Route>

                    {/* Protected Company Dashboard Routes - Only accessible to 'company' role */}
                    <Route
                        path="/dashboard/company"
                        element={
                            <ProtectedRoute allowedRoles={['company']}>
                                <DashboardLayout type="company" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<CompanyDashboard />} />
                        <Route path="employees" element={<CompanyEmployees />} />
                        <Route path="credits" element={<CompanyCredits />} />
                        <Route path="settings" element={<CompanySettings />} />
                    </Route>

                    {/* Protected Super Admin Dashboard Routes - Only accessible to 'super_admin' role */}
                    <Route
                        path="/dashboard/admin"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <DashboardLayout type="super_admin" />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminOverview />} />
                        <Route path="founder" element={<FounderDashboard />} />
                        <Route path="experts" element={<ExpertApprovals />} />
                        <Route path="companies" element={<AdminCompanies />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="revenue" element={<AdminOverview />} />
                        <Route path="commissions" element={<CommissionTracking />} />
                        <Route path="payouts" element={<PayoutsManagement />} />
                        <Route path="disputes" element={<Disputes />} />
                        <Route path="promos" element={<PromoManagement />} />
                        <Route path="cms" element={<CMSManagement />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Protected Shared Routes */}
                    <Route element={
                        <div className="min-h-screen bg-gray-50">
                            <Navbar />
                            <div className="pt-6 px-4 sm:px-6 lg:px-8">
                                <Outlet />
                            </div>
                        </div>
                    }>
                        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                        <Route path="/ai-companion" element={<ProtectedRoute><AICompanion /></ProtectedRoute>} />
                        <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
                        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                        <Route path="/challenges" element={<ProtectedRoute><WellnessChallenges /></ProtectedRoute>} />
                        <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
                    </Route>

                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
