import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { User } from '../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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

            <Button type="submit" className="w-full">
                Sign in
            </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;