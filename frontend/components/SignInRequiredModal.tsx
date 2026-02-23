import React from 'react';
import { X, LogIn, UserPlus, ShieldAlert } from 'lucide-react';
import { Button } from './UI';
import { useNavigate } from 'react-router-dom';

interface SignInRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SignInRequiredModal: React.FC<SignInRequiredModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-emerald-100">
                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 mb-6 group">
                            <ShieldAlert className="h-10 w-10 text-emerald-600 transition-transform group-hover:scale-110" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign in Required</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                To book a session and manage your appointments, you need to be signed in to your account.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                className="w-full flex items-center justify-center gap-2 py-6 text-lg font-bold"
                                onClick={() => {
                                    onClose();
                                    navigate('/login');
                                }}
                            >
                                <LogIn size={20} />
                                Sign In Now
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-100"></span>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-400">New to Serene?</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 py-3 font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                onClick={() => {
                                    onClose();
                                    navigate('/signup');
                                }}
                            >
                                <UserPlus size={20} />
                                Create a Free Account
                            </Button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                            <p className="text-xs text-gray-400">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
