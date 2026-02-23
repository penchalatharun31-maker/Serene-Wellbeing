import React, { useState } from 'react';
import { Button, Input } from './UI';
import { X, Mail, User, ShieldCheck, CheckCircle } from 'lucide-react';

interface AddAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (email: string, name: string) => void;
}

import { companyService } from '../services/company.service';

export const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await companyService.addAdmin(email, name);
            onAdd(email, name);
            setIsSent(true);
        } catch (error) {
            console.error(error);
            alert('Failed to add admin');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSent(false);
        setEmail('');
        setName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add Administrator</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 flex gap-3">
                            <ShieldCheck className="text-indigo-600 flex-shrink-0" size={20} />
                            <p className="text-sm text-indigo-800">
                                Info: Admins have full access to company settings, billing, and employee management.
                            </p>
                        </div>

                        <Input
                            label="Admin Name"
                            placeholder="e.g. Sarah Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            icon={<User size={18} />}
                        />
                        <Input
                            label="Admin Email"
                            type="email"
                            placeholder="sarah.admin@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Mail size={18} />}
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                                {loading ? 'Granting Access...' : 'Grant Admin Access'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Admin Added!</h4>
                        <p className="text-gray-500">
                            <span className="font-medium text-gray-900">{name}</span> has been added as an administrator. They will receive an email confirmation shortly.
                        </p>
                        <Button onClick={handleClose} className="w-full mt-6">Done</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
