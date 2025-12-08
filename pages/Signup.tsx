import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { User } from '../types';

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
                    placeholder="••••••••" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I want to...</label>
                <select 
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border"
                    value={role}
                    onChange={(e) => setRole(e.target.value as User['role'])}
                >
                    <option value="user">Find wellbeing experts</option>
                    <option value="expert">Offer wellbeing services</option>
                    <option value="company">Manage company wellness</option>
                </select>
            </div>

            <Button type="submit" className="w-full">
                Sign up
            </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;