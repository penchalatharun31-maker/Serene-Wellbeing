import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, BarChart3, Users, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { User } from '../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = (queryParams.get('role') as User['role']) || 'user';

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>(initialRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'password123'); // Simple mock login with email
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${role === 'company' ? 'lg:bg-white' : ''}`}>
      {/* Header with Logo - Back to Home */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
            <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <span className="text-2xl font-bold text-gray-900">Serene Wellbeing</span>
        </Link>
      </div>

      <div className={`w-full space-y-8 flex-1 flex items-center justify-center ${role === 'company' ? 'max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center' : 'max-w-md mx-auto'}`}>

        {role === 'company' && (
          <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Serene for Enterprise
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Tailored Wellbeing for <span className="text-indigo-600">Your Workforce</span>
            </h1>
            <p className="text-lg text-gray-600">
              Sign in to your corporate dashboard to manage employee credits, track engagement, and access organizational insights.
            </p>
            <div className="space-y-4">
              {[
                { icon: BarChart3, text: "Advanced Usage Analytics" },
                { icon: Users, text: "Team Credit Management" },
                { icon: Lock, text: "Enterprise-grade HIPAA Security" },
                { icon: CheckCircle, text: "Dedicated Account Support" }
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
                start your 14-day free trial
              </Link>
            </p>
          </div>

          <Card className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border"
                  value={role}
                  onChange={(e) => setRole(e.target.value as User['role'])}
                >
                  <option value="user">Individual</option>
                  <option value="expert">Wellbeing Expert</option>
                  <option value="company">Company Rep</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full h-12">
                Sign in
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
