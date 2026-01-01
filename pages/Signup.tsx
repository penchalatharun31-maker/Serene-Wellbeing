import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, Users, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { User } from '../types';

const Signup: React.FC = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = (queryParams.get('role') as User['role']) || 'user';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>(initialRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password, role, true); // Use noNavigate
      if (role === 'company') {
        navigate('/company-onboarding');
      } else if (role === 'expert') {
        navigate('/expert-onboarding');
      } else {
        navigate(`/dashboard/${role}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login('guest@google.com', 'password123', true); // Use noNavigate
      if (role === 'company') {
        navigate('/company-onboarding');
      } else if (role === 'expert') {
        navigate('/expert-onboarding');
      } else {
        navigate(`/dashboard/${role}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${role === 'company' ? 'lg:bg-white' : ''}`}>
      <div className={`w-full space-y-8 ${role === 'company' ? 'max-w-5xl flex flex-col lg:flex-row gap-16 items-center' : 'max-w-md'}`}>

        {role === 'company' && (
          <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Serene for Enterprise
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Build a Happier, Healthier <span className="text-indigo-600">Organization</span>
            </h1>
            <p className="text-lg text-gray-600">
              Get started with Serene for Teams. Empower your employees with world-class wellbeing support and data-driven insights.
            </p>
            <div className="space-y-4">
              {[
                { icon: BarChart3, text: "Organizational Health Insights" },
                { icon: Users, text: "Scalable Credit System" },
                { icon: Lock, text: "Confidential & HIPAA Secure" },
                { icon: CheckCircle, text: "Bulk Employee Onboarding" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <item.icon size={20} className="text-indigo-500" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={role === 'company' ? 'lg:w-1/2 w-full max-w-md' : 'w-full'}>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-emerald-400 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in
              </Link>
            </p>
          </div>

          <Card className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I want to...</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border bg-gray-50"
                  value={role}
                  onChange={(e) => setRole(e.target.value as User['role'])}
                  disabled={!!queryParams.get('role')}
                >
                  {(!queryParams.get('role') || queryParams.get('role') === 'user') && <option value="user">Find wellbeing experts</option>}
                  {(!queryParams.get('role') || queryParams.get('role') === 'expert') && <option value="expert">Offer wellbeing services</option>}
                  {(!queryParams.get('role') || queryParams.get('role') === 'company') && <option value="company">Manage company wellness</option>}
                </select>
                {queryParams.get('role') && (
                  <p className="mt-2 text-xs text-indigo-600 font-medium italic">You are signing up for a specialized account.</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12">
                Get Started for Free
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400 uppercase tracking-widest font-bold">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full flex justify-center gap-3 py-6 rounded-xl border-gray-200 hover:border-emerald-200 transition-all font-bold" onClick={handleGoogleLogin}>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
              Sign up with Google
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
