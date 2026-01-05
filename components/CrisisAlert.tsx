import React, { useEffect, useState } from 'react';
import { socketService } from '../services/socket.service';
import { ShieldAlert, X, Phone, MessageSquare } from 'lucide-react';

interface CrisisResource {
    name: string;
    contact: string;
}

interface CrisisData {
    message: string;
    resources: CrisisResource[];
}

export const CrisisAlert: React.FC = () => {
    const [alert, setAlert] = useState<CrisisData | null>(null);

    useEffect(() => {
        socketService.onCrisisAlert((data: CrisisData) => {
            setAlert(data);
        });
    }, []);

    if (!alert) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-full shrink-0">
                        <ShieldAlert className="text-red-600" size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">We're here for you</h3>
                        <p className="text-gray-600 mt-1 text-sm">{alert.message}</p>
                    </div>
                    <button onClick={() => setAlert(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">Immediate Help Resources</p>
                    <div className="space-y-3">
                        {alert.resources.map((res, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
                                <span className="font-semibold text-gray-900">{res.name}</span>
                                <a
                                    href={res.contact.includes('Text') ? `sms:${res.contact.split(' ').pop()}` : `tel:${res.contact}`}
                                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-emerald-600 shadow-sm hover:shadow-md transition-all"
                                >
                                    {res.contact.includes('Text') ? <MessageSquare size={14} /> : <Phone size={14} />}
                                    {res.contact}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">You are not alone. Our team has been notified to assist you.</p>
                </div>
            </div>
        </div>
    );
};
