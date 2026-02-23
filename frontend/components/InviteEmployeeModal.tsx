import React, { useState } from 'react';
import { Button, Input } from './UI';
import { X, Mail, User, Briefcase, CheckCircle } from 'lucide-react';

interface InviteEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, name: string, department: string) => void;
}

import { companyService } from '../services/company.service';

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({ isOpen, onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('Engineering');
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await companyService.inviteEmployee(email, name, department);
            onInvite(email, name, department);
            setIsSent(true);
        } catch (error) {
            console.error(error);
            alert('Failed to invite employee');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSent(false);
        setEmail('');
        setName('');
        setDepartment('Engineering');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Invite Employee</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            icon={<User size={18} />}
                        />
                        <Input
                            label="Work Email"
                            type="email"
                            placeholder="john@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Mail size={18} />}
                        />
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <div className="relative">
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-lg border"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option>Engineering</option>
                                    <option>Sales</option>
                                    <option>Marketing</option>
                                    <option>HR</option>
                                    <option>Product</option>
                                    <option>Design</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Invitation'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Invitation Sent!</h4>
                        <p className="text-gray-500">
                            We've sent an email to <span className="font-medium text-gray-900">{email}</span> with instructions to join your company workspace.
                        </p>
                        <Button onClick={handleClose} className="w-full mt-6">Done</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
