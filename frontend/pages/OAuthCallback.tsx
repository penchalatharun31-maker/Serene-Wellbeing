import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const role = searchParams.get('role');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(getErrorMessage(errorParam));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!token || !role) {
          setError('Invalid OAuth callback. Missing token or role.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Fetch user data
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        // Update auth context
        setUser(data.user);
        setIsAuthenticated(true);

        // Redirect based on role
        if (role === 'company') {
          navigate('/dashboard/company');
        } else if (role === 'expert') {
          // Check if expert profile is complete
          const expertResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/experts/user/${data.user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (expertResponse.ok) {
            const expertData = await expertResponse.json();
            if (!expertData.expert || !expertData.expert.isApproved) {
              navigate('/expert-onboarding');
            } else {
              navigate('/dashboard/expert');
            }
          } else {
            navigate('/expert-onboarding');
          }
        } else {
          navigate('/dashboard/user');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser, setIsAuthenticated]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'authentication_failed':
        return 'Authentication failed. Please try again.';
      case 'oauth_callback_failed':
        return 'OAuth callback failed. Please try again.';
      case 'oauth_failed':
        return 'Google authentication failed. Please try again.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin text-emerald-600 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
