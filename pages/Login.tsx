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
  const showCompanyBranding = queryParams.get('type') === 'company';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // AuthContext handles automatic redirect based on user's role from backend
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      // AuthContext handles automatic redirect based on user's role from backend
      await login('guest@google.com', 'password123');
    } catch (e: any) {
      setError(e.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${showCompanyBranding ? 'lg:bg-white' : ''}`}>
      <div className={`w-full space-y-8 ${showCompanyBranding ? 'max-w-5xl flex flex-col lg:flex-row gap-16 items-center' : 'max-w-md'}`}>

        {showCompanyBranding && (
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

        <div className={showCompanyBranding ? 'lg:w-1/2 w-full max-w-md' : 'w-full'}>
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
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
                  disabled={loading}
                />
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

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
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

            <Button variant="outline" className="w-full flex justify-center gap-3 py-6 rounded-xl border-gray-200 hover:border-emerald-200 transition-all font-bold" onClick={handleGoogleLogin} disabled={loading}>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
