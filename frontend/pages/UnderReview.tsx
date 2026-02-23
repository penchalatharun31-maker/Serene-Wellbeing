import React from 'react';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

const UnderReview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-amber-600" size={40} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Under Review</h1>
        <p className="text-gray-600 mb-6">
          Your profile has been submitted and is currently being reviewed by our team.
          You will be notified once the review is complete.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <Mail className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-600">
              A confirmation has been sent to your registered email address.
              Please check your inbox for updates.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="outline" className="flex items-center justify-center gap-2" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnderReview;
