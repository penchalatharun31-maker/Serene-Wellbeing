import { useState, useEffect } from 'react';
import { Check, Sparkles, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface PricingPlan {
  _id: string;
  name: string;
  type: string;
  category: string;
  price: number;
  sessions: number;
  pricePerSession: number;
  discount: number;
  savings: number;
  duration?: number;
  features: string[];
  popular: boolean;
  bestValue: boolean;
  description: string;
  shortDescription: string;
  minEmployees?: number;
  maxEmployees?: number;
}

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'corporate'>('individual');
  const [individualPlans, setIndividualPlans] = useState<PricingPlan[]>([]);
  const [corporatePlans, setCorporatePlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      const [individualRes, corporateRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/pricing/individual`),
        axios.get(`${import.meta.env.VITE_API_URL}/pricing/corporate`),
      ]);

      setIndividualPlans(individualRes.data.plans || []);
      setCorporatePlans(corporateRes.data.plans || []);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transparent, Affordable Mental Health Care
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Evidence-based pricing designed for lasting change. No hidden fees, no surprises.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <p className="text-sm font-medium">80% Goes to Therapists</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <p className="text-sm font-medium">Research-Backed Packages</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <p className="text-sm font-medium">Flexible Payment Options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-xl shadow-lg p-2">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                activeTab === 'individual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setActiveTab('corporate')}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                activeTab === 'corporate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Companies
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pricing plans...</p>
          </div>
        ) : (
          <>
            {/* Individual Pricing */}
            {activeTab === 'individual' && (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Therapy Journey
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Research shows that 8 sessions of therapy provide the most lasting change.
                    Start where you're comfortable and upgrade anytime.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {individualPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        plan.popular ? 'ring-4 ring-blue-500' : ''
                      } ${plan.bestValue ? 'ring-4 ring-purple-500' : ''}`}
                    >
                      {/* Badge */}
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-bl-xl font-semibold text-sm flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          Most Popular
                        </div>
                      )}
                      {plan.bestValue && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-2 rounded-bl-xl font-semibold text-sm flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Best Value
                        </div>
                      )}

                      <div className="p-8">
                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 h-12">
                          {plan.shortDescription}
                        </p>

                        {/* Pricing */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            {plan.sessions > 0 && (
                              <span className="text-gray-500">
                                / {plan.sessions} {plan.sessions === 1 ? 'session' : 'sessions'}
                              </span>
                            )}
                          </div>
                          {plan.pricePerSession > 0 && (
                            <p className="text-lg text-gray-600 mt-2">
                              ${plan.pricePerSession}/session
                            </p>
                          )}
                          {plan.discount > 0 && (
                            <div className="mt-3 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Save ${plan.savings} ({plan.discount}% off)
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Link
                          to="/register"
                          className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                            plan.popular || plan.bestValue
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          Get Started
                          <ArrowRight className="w-5 h-5 inline-block ml-2" />
                        </Link>

                        {/* Features */}
                        <div className="mt-8 space-y-4">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
                      <p className="text-gray-600">Goes to Therapists</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Industry-leading commission
                      </p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
                      <p className="text-gray-600">Sessions Recommended</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Research-backed effectiveness
                      </p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
                      <p className="text-gray-600">Maximum Savings</p>
                      <p className="text-sm text-gray-500 mt-1">
                        On 12-session package
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Pricing */}
            {activeTab === 'corporate' && (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Invest in Your Team's Wellbeing
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Research-backed ROI: Every $1 spent saves $3.27 in medical costs and $2.73 in
                    absenteeism. That's 600% ROI.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {corporatePlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        plan.popular ? 'ring-4 ring-blue-500 scale-105' : ''
                      } ${plan.bestValue ? 'ring-4 ring-purple-500' : ''}`}
                    >
                      {/* Badge */}
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-bl-xl font-semibold text-sm">
                          Most Popular
                        </div>
                      )}
                      {plan.bestValue && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-2 rounded-bl-xl font-semibold text-sm">
                          Best Value
                        </div>
                      )}

                      <div className="p-8">
                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {plan.name.split('(')[0]}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {plan.minEmployees}
                          {plan.maxEmployees ? `-${plan.maxEmployees}` : '+'} employees
                        </p>
                        <p className="text-gray-600 text-sm mb-6 h-12">
                          {plan.shortDescription}
                        </p>

                        {/* Pricing */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-gray-500">/employee</span>
                          </div>
                          <p className="text-lg text-gray-600 mt-2">
                            ${(plan.price / 12).toFixed(2)}/month per employee
                          </p>
                          {plan.discount > 0 && (
                            <div className="mt-3 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Save {plan.discount.toFixed(1)}% vs. Starter
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Link
                          to="/contact"
                          className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                            plan.popular || plan.bestValue
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          Request Demo
                          <ArrowRight className="w-5 h-5 inline-block ml-2" />
                        </Link>

                        {/* Features */}
                        <div className="mt-8 space-y-4">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ROI Calculator */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <Shield className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold mb-2">
                        Proven Return on Investment
                      </h3>
                      <p className="text-blue-100 text-lg">
                        Based on peer-reviewed research and industry data
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-4xl font-bold mb-2">$3.27</div>
                        <p className="text-blue-100">Medical Cost Savings</p>
                        <p className="text-sm text-blue-200 mt-2">Per $1 invested</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-4xl font-bold mb-2">$2.73</div>
                        <p className="text-blue-100">Absenteeism Reduction</p>
                        <p className="text-sm text-blue-200 mt-2">Per $1 invested</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="text-4xl font-bold mb-2">25-30%</div>
                        <p className="text-blue-100">Less Absenteeism</p>
                        <p className="text-sm text-blue-200 mt-2">After implementation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
                <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center">
                  Why are session packages more affordable?
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Session packages encourage commitment, which leads to better outcomes. Research
                  shows that completing 8 sessions provides lasting change, so we incentivize
                  longer-term engagement with savings of up to 25%.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
                <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center">
                  How much do therapists actually earn?
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Therapists receive 80% of every session fee. For an $80 session, they earn $64.
                  This is significantly higher than competitors like BetterHelp (50-70%). We also
                  cover all payment processing fees.{' '}
                  <Link to="/expert-pricing" className="text-blue-600 hover:underline">
                    Learn more →
                  </Link>
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
                <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center">
                  Can I switch packages or get a refund?
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Yes! You can upgrade to a larger package anytime. If you're not satisfied after
                  your first session, we offer a full refund. Unused sessions in packages are
                  refundable within the validity period.
                </p>
              </details>

              <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
                <summary className="font-semibold text-lg text-gray-900 flex justify-between items-center">
                  Do corporate plans require contracts?
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Corporate plans are billed annually with flexible payment options (monthly or
                  upfront). There's no long-term contract—you can adjust or cancel with 30 days
                  notice. We're confident the ROI will speak for itself.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands who have found support, healing, and growth through evidence-based
            therapy.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="/experts"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Browse Therapists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
