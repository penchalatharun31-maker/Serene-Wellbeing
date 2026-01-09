import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Google OAuth Callback Handler
 *
 * This page handles the redirect from Google after user authorizes the app
 * It extracts the tokens from URL and logs the user in
 */
const GoogleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      // Parse hash parameters (React Router HashRouter)
      const hashParams = new URLSearchParams(location.hash.replace('#/auth/google/callback', '').slice(1));

      // Check for error
      const errorParam = hashParams.get('error');
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Extract tokens
      const token = hashParams.get('token');
      const refreshToken = hashParams.get('refreshToken');
      const role = hashParams.get('role');

      if (!token || !refreshToken || !role) {
        setError('Authentication failed. Missing tokens.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user data
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUser(data.user);

            // Redirect to appropriate dashboard
            navigate(`/dashboard/${role}`, { replace: true });
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .catch(err => {
          console.error('Auth callback error:', err);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        });
    };

    handleCallback();
  }, [location, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we log you in</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
