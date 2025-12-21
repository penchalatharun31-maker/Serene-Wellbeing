import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CheckCircle, Clock, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface CommissionData {
  commission: {
    expertPercentage: number;
    platformPercentage: number;
    sessionPrice: number;
    expertEarns: number;
    platformFee: number;
  };
  examples: Array<{
    planName: string;
    totalPrice: number;
    sessions: number;
    pricePerSession: number;
    expertEarnings: number;
    expertPerSession: number;
    platformFee: number;
  }>;
  features: string[];
  earningsPotential: {
    partTime: {
      sessionsPerWeek: number;
      weeklyEarnings: number;
      monthlyEarnings: number;
      yearlyEarnings: number;
    };
    fullTime: {
      sessionsPerWeek: number;
      weeklyEarnings: number;
      monthlyEarnings: number;
      yearlyEarnings: number;
    };
  };
}

const ExpertPricing = () => {
  const [commissionData, setCommissionData] = useState<CommissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customRate, setCustomRate] = useState(80);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async (rate?: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pricing/expert-commission${
          rate ? `?sessionPrice=${rate}` : ''
        }`
      );
      setCommissionData(response.data);
    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseInt(e.target.value);
    setCustomRate(newRate);
    if (newRate >= 10 && newRate <= 1000) {
      fetchCommissionData(newRate);
    }
  };

  if (loading || !commissionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Earn More. Keep More.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Industry-leading 80/20 commission split. You focus on therapy, we handle everything else.
            </p>
            <div className="inline-flex bg-white text-blue-600 rounded-full px-8 py-4 font-bold text-3xl shadow-2xl">
              You Keep 80%
            </div>
          </div>
        </div>
      </section>

      {/* Commission Breakdown */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Commission Structure
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. No surprises. You earn 80% of every session.
            </p>
          </div>

          {/* Visual Breakdown */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left: Your Earnings */}
              <div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">You Earn</h3>
                    <TrendingUp className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-6xl font-bold text-green-600 mb-4">
                    80%
                  </div>
                  <p className="text-gray-700 text-lg mb-4">
                    ${commissionData.commission.expertEarns.toFixed(2)} per ${customRate} session
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Highest in the industry</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Weekly automatic payouts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">No minimum payout threshold</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Platform Fee */}
              <div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Platform Fee</h3>
                    <Shield className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    20%
                  </div>
                  <p className="text-gray-700 text-lg mb-4">
                    ${commissionData.commission.platformFee.toFixed(2)} per ${customRate} session
                  </p>
                  <p className="text-gray-600 mb-4 font-semibold">
                    What we cover with our fee:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Payment processing (Stripe fees)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Client matching & discovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Scheduling & calendar management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Video conferencing platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Customer support (24/7)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">Marketing & client acquisition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Rate Calculator */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Calculate Your Earnings
            </h3>
            <div className="max-w-md mx-auto">
              <label className="block text-gray-700 font-semibold mb-2">
                Your Hourly Rate: ${customRate}
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={customRate}
                onChange={handleRateChange}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$10</span>
                <span>$300</span>
              </div>

              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">You earn per session</p>
                  <p className="text-5xl font-bold text-blue-600">
                    ${commissionData.commission.expertEarns.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Examples */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Earnings by Package
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {commissionData.examples.map((example, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">
                    {example.planName}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Price:</span>
                      <span className="font-semibold">${example.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sessions:</span>
                      <span className="font-semibold">{example.sessions}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">You Earn:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ${example.expertEarnings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Per session:</span>
                        <span>${example.expertPerSession.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Potential */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-12">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Your Earning Potential
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Part-time */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8" />
                  <h4 className="text-2xl font-bold">Part-Time</h4>
                </div>
                <p className="text-blue-100 mb-4">
                  {commissionData.earningsPotential.partTime.sessionsPerWeek} sessions per week
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-blue-100">Weekly:</span>
                    <span className="text-3xl font-bold">
                      ${commissionData.earningsPotential.partTime.weeklyEarnings.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-blue-100">Monthly:</span>
                    <span className="text-3xl font-bold">
                      ${commissionData.earningsPotential.partTime.monthlyEarnings.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-white/20 pt-3">
                    <span className="text-blue-100">Yearly:</span>
                    <span className="text-4xl font-bold">
                      ${commissionData.earningsPotential.partTime.yearlyEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full-time */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8" />
                  <h4 className="text-2xl font-bold">Full-Time</h4>
                </div>
                <p className="text-blue-100 mb-4">
                  {commissionData.earningsPotential.fullTime.sessionsPerWeek} sessions per week
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-blue-100">Weekly:</span>
                    <span className="text-3xl font-bold">
                      ${commissionData.earningsPotential.fullTime.weeklyEarnings.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-blue-100">Monthly:</span>
                    <span className="text-3xl font-bold">
                      ${commissionData.earningsPotential.fullTime.monthlyEarnings.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-white/20 pt-3">
                    <span className="text-blue-100">Yearly:</span>
                    <span className="text-4xl font-bold">
                      ${commissionData.earningsPotential.fullTime.yearlyEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-blue-100 mt-6 text-sm">
              * Based on ${customRate} per session rate. Actual earnings may vary.
            </p>
          </div>

          {/* No Hidden Fees */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What's Included (No Extra Fees)
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {commissionData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How We Compare
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4">Platform</th>
                    <th className="text-center py-4 px-4">Your Take</th>
                    <th className="text-center py-4 px-4">Platform Fee</th>
                    <th className="text-center py-4 px-4">Payment Processing</th>
                    <th className="text-center py-4 px-4">Hidden Fees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 bg-green-50">
                    <td className="py-4 px-4 font-bold text-blue-600">Serene Wellbeing</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-2xl font-bold text-green-600">80%</span>
                    </td>
                    <td className="text-center py-4 px-4">20%</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-green-600 font-semibold">None</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">BetterHelp</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-xl font-semibold">50-60%</span>
                    </td>
                    <td className="text-center py-4 px-4">40-50%</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-gray-400">✗</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-red-600">Yes</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Talkspace</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-xl font-semibold">55-70%</span>
                    </td>
                    <td className="text-center py-4 px-4">30-45%</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-gray-400">✗</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-red-600">Yes</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Private Practice</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-xl font-semibold">100%</span>
                    </td>
                    <td className="text-center py-4 px-4">0%</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-red-600 font-semibold">You pay</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-gray-600 text-sm">Overhead costs</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of therapists earning more while helping more people.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register?role=expert"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Apply as an Expert
            </Link>
            <Link
              to="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View User Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertPricing;
