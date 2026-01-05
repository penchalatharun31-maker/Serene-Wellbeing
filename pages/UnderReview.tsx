import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/UI';
import { Clock, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const UnderReview: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [expertStatus, setExpertStatus] = useState<{
        approvalStatus: 'pending' | 'approved' | 'rejected';
        rejectionReason?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkExpertStatus();
    }, []);

    const checkExpertStatus = async () => {
        if (!user?._id) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get(`/experts/user/${user._id}`);
            const expert = response.data.data;

            setExpertStatus({
                approvalStatus: expert.approvalStatus || 'pending',
                rejectionReason: expert.rejectionReason,
            });

            // Redirect if approved
            if (expert.approvalStatus === 'approved' && expert.isApproved) {
                navigate('/dashboard/expert');
            }
        } catch (err: any) {
            console.error('Error checking expert status:', err);
            // If expert profile doesn't exist, redirect to onboarding
            if (err.status === 404) {
                navigate('/expert-onboarding');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Clock className="animate-spin mx-auto text-emerald-600 mb-4" size={48} />
                    <p className="text-gray-600">Checking your application status...</p>
                </div>
            </div>
        );
    }

    if (expertStatus?.approvalStatus === 'rejected') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <Card className="p-8 md:p-12 text-center">
                        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="text-red-600" size={40} />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Application Not Approved
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Unfortunately, your expert application was not approved at this time.
                        </p>

                        {expertStatus.rejectionReason && (
                            <Card className="p-4 bg-red-50 border border-red-200 mb-6">
                                <p className="text-sm font-medium text-gray-900 mb-2">Reason:</p>
                                <p className="text-sm text-gray-700">{expertStatus.rejectionReason}</p>
                            </Card>
                        )}

                        <div className="space-y-3">
                            <p className="text-gray-600">
                                You can reapply after addressing the feedback above, or contact our support team for more information.
                            </p>
                            <div className="flex gap-3 justify-center mt-6">
                                <button
                                    onClick={() => navigate('/expert-onboarding')}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Reapply
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard/user')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <Card className="p-8 md:p-12 text-center">
                    <div className="bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Clock className="text-emerald-600" size={40} />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Application Under Review
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for applying to become an expert on Serene Wellbeing!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                                <CheckCircle className="text-emerald-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Application Submitted</h3>
                            <p className="text-sm text-gray-500">Your profile is complete</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                                <Clock className="text-blue-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Under Review</h3>
                            <p className="text-sm text-gray-500">Our team is reviewing</p>
                        </div>

                        <div className="flex flex-col items-center opacity-50">
                            <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                                <Mail className="text-gray-400" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Notification</h3>
                            <p className="text-sm text-gray-500">You'll receive an email</p>
                        </div>
                    </div>

                    <Card className="p-6 bg-blue-50 border border-blue-200 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li>• Our team will review your credentials and experience</li>
                            <li>• This process typically takes 1-3 business days</li>
                            <li>• You'll receive an email notification once your application is processed</li>
                            <li>• If approved, you'll gain access to your expert dashboard</li>
                        </ul>
                    </Card>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/dashboard/user')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={checkExpertStatus}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Refresh Status
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        Questions? Contact us at <a href="mailto:support@serenewellbeing.com" className="text-emerald-600 hover:underline">support@serenewellbeing.com</a>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default UnderReview;
