import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
            <Link to="/dashboard/company/credits" className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft size={18} className="mr-2" /> Back to Credits
            </Link>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}><Printer size={18} className="mr-2" /> Print</Button>
                <Button><Download size={18} className="mr-2" /> Download PDF</Button>
            </div>
        </div>

        <Card className="p-8 md:p-12 print:shadow-none print:border-none">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Serene</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        123 Wellness Way<br/>
                        San Francisco, CA 94105<br/>
                        billing@serene.com
                    </p>
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <p className="text-emerald-600 font-medium">#INV-2024-00{id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="text-gray-900 font-medium">Acme Co.</p>
                    <p className="text-gray-500 text-sm">123 Tech Blvd<br/>San Francisco, CA</p>
                </div>
                <div className="md:text-right">
                    <div className="space-y-2">
                        <div>
                            <span className="text-gray-500 text-sm mr-4">Invoice Date:</span>
                            <span className="text-gray-900 font-medium">Oct 20, 2024</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm mr-4">Due Date:</span>
                            <span className="text-gray-900 font-medium">Oct 20, 2024</span>
                        </div>
                    </div>
                </div>
            </div>

            <table className="w-full mb-12">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Qty</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="py-4 px-4 text-gray-900">5000 Wellbeing Credits Pack</td>
                        <td className="py-4 px-4 text-center text-gray-600">1</td>
                        <td className="py-4 px-4 text-right text-gray-900 font-medium">$4,000.00</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-end border-t border-gray-100 pt-8">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">$4,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (0%)</span>
                        <span className="text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                        <span className="text-gray-900">Total</span>
                        <span className="text-emerald-600">$4,000.00</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
                <p>Thank you for your business!</p>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;