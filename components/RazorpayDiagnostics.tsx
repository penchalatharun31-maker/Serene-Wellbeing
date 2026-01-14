import React, { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Razorpay Diagnostic Component
 * Tests all aspects of Razorpay integration to identify issues
 */
export const RazorpayDiagnostics: React.FC = () => {
  const [tests, setTests] = useState<{ name: string; status: 'pending' | 'pass' | 'fail'; message: string }[]>([
    { name: 'Razorpay Script Loaded', status: 'pending', message: 'Checking...' },
    { name: 'Frontend Environment Variable', status: 'pending', message: 'Checking...' },
    { name: 'Backend Create Order API', status: 'pending', message: 'Checking...' },
    { name: 'Backend Verify API', status: 'pending', message: 'Checking...' },
    { name: 'Razorpay Key Format', status: 'pending', message: 'Checking...' },
  ]);

  const [running, setRunning] = useState(false);

  const updateTest = (name: string, status: 'pass' | 'fail', message: string) => {
    setTests(prev => prev.map(t => t.name === name ? { ...t, status, message } : t));
  };

  const runDiagnostics = async () => {
    setRunning(true);

    // Test 1: Check if Razorpay script is loaded
    try {
      if ((window as any).Razorpay) {
        updateTest('Razorpay Script Loaded', 'pass', '✅ Razorpay script loaded successfully');
      } else {
        updateTest('Razorpay Script Loaded', 'fail', '❌ Razorpay script not found in window object');
      }
    } catch (err) {
      updateTest('Razorpay Script Loaded', 'fail', `❌ Error: ${err}`);
    }

    // Test 2: Check frontend environment variable
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        updateTest('Frontend Environment Variable', 'fail', '❌ VITE_RAZORPAY_KEY_ID not set in .env.development');
      } else if (razorpayKey === 'rzp_test_your_key_id' || razorpayKey === 'rzp_test_1234567890') {
        updateTest('Frontend Environment Variable', 'fail', `❌ Using placeholder key: ${razorpayKey} - Replace with real test key`);
      } else if (razorpayKey.startsWith('rzp_test_')) {
        updateTest('Frontend Environment Variable', 'pass', `✅ Test key configured: ${razorpayKey.substring(0, 20)}...`);
      } else if (razorpayKey.startsWith('rzp_live_')) {
        updateTest('Frontend Environment Variable', 'pass', `✅ Live key configured: ${razorpayKey.substring(0, 20)}... (⚠️ Be careful in production)`);
      } else {
        updateTest('Frontend Environment Variable', 'fail', `❌ Invalid key format: ${razorpayKey.substring(0, 20)}...`);
      }
    } catch (err) {
      updateTest('Frontend Environment Variable', 'fail', `❌ Error: ${err}`);
    }

    // Test 3: Test backend create-order endpoint
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const token = localStorage.getItem('token');

      if (!token) {
        updateTest('Backend Create Order API', 'fail', '❌ No auth token - Please login first');
      } else {
        const response = await fetch(`${API_URL}/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 100, // Test amount: ₹100 or $100
            currency: 'INR',
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          updateTest('Backend Create Order API', 'pass', `✅ Order created: ${data.order?.id || 'ID received'}`);
        } else if (response.status === 401) {
          updateTest('Backend Create Order API', 'fail', '❌ Authentication failed - Token expired or invalid');
        } else if (response.status === 500) {
          updateTest('Backend Create Order API', 'fail', `❌ Server error: ${data.message || 'Check backend logs for Razorpay config'}`);
        } else {
          updateTest('Backend Create Order API', 'fail', `❌ Failed: ${data.message || response.statusText}`);
        }
      }
    } catch (err: any) {
      updateTest('Backend Create Order API', 'fail', `❌ Network error: ${err.message || 'Backend not reachable'}`);
    }

    // Test 4: Test backend verify endpoint
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const token = localStorage.getItem('token');

      if (!token) {
        updateTest('Backend Verify API', 'fail', '❌ No auth token - Please login first');
      } else {
        // Try with dummy data (will fail but shows if endpoint exists)
        const response = await fetch(`${API_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: 'test_order_id',
            razorpay_payment_id: 'test_payment_id',
            razorpay_signature: 'test_signature',
          }),
        });

        const data = await response.json();

        if (response.status === 400 && data.message?.includes('verification')) {
          updateTest('Backend Verify API', 'pass', '✅ Verify endpoint exists and responding');
        } else if (response.ok) {
          updateTest('Backend Verify API', 'pass', '✅ Verify endpoint works');
        } else if (response.status === 401) {
          updateTest('Backend Verify API', 'fail', '❌ Authentication failed');
        } else {
          updateTest('Backend Verify API', 'fail', `❌ Status ${response.status}: ${data.message}`);
        }
      }
    } catch (err: any) {
      updateTest('Backend Verify API', 'fail', `❌ Network error: ${err.message || 'Backend not reachable'}`);
    }

    // Test 5: Validate Razorpay key format
    try {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const keyRegex = /^rzp_(test|live)_[A-Za-z0-9]{14}$/;

      if (!razorpayKey) {
        updateTest('Razorpay Key Format', 'fail', '❌ No key provided');
      } else if (keyRegex.test(razorpayKey)) {
        updateTest('Razorpay Key Format', 'pass', '✅ Key format is valid');
      } else if (razorpayKey === 'rzp_test_1234567890' || razorpayKey === 'rzp_test_your_key_id') {
        updateTest('Razorpay Key Format', 'fail', '❌ Using placeholder key - Get real key from Razorpay dashboard');
      } else {
        updateTest('Razorpay Key Format', 'fail', '❌ Key format invalid - Should be rzp_test_XXXXXXXXXXXXX');
      }
    } catch (err) {
      updateTest('Razorpay Key Format', 'fail', `❌ Error: ${err}`);
    }

    setRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'fail':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Loader2 className="text-gray-400 animate-spin" size={20} />;
      default:
        return <AlertCircle className="text-yellow-600" size={20} />;
    }
  };

  const allPassed = tests.every(t => t.status === 'pass');
  const anyFailed = tests.some(t => t.status === 'fail');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🔍 Razorpay Integration Diagnostics</h2>
          <p className="text-gray-600">Testing all components of Razorpay payment integration</p>
        </div>

        <div className="space-y-4 mb-6">
          {tests.map((test) => (
            <div
              key={test.name}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                test.status === 'pass'
                  ? 'bg-green-50 border-green-200'
                  : test.status === 'fail'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {getStatusIcon(test.status)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{test.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={runDiagnostics} disabled={running} className="flex-1">
            {running ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Running Tests...
              </>
            ) : (
              'Re-run Diagnostics'
            )}
          </Button>
        </div>

        {allPassed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ All tests passed! Razorpay integration is properly configured.
            </p>
            <p className="text-green-700 text-sm mt-1">
              You can now proceed to test actual payments. Try booking a session.
            </p>
          </div>
        )}

        {anyFailed && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium mb-2">
              ❌ Some tests failed. Please fix the issues above.
            </p>
            <div className="text-red-700 text-sm space-y-2">
              <p><strong>Common Solutions:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Get real Razorpay test keys from: https://dashboard.razorpay.com/app/keys</li>
                <li>Add keys to both <code>.env.development</code> (frontend) and <code>backend/.env</code></li>
                <li>Restart both frontend and backend after adding keys</li>
                <li>Make sure backend is running on correct port (5000)</li>
                <li>Check browser console (F12) for JavaScript errors</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium mb-2">📝 Next Steps:</p>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>Ensure all tests above show ✅ green checkmarks</li>
            <li>Open browser console (F12) before testing payment</li>
            <li>Try to book a test session</li>
            <li>Watch console for any errors during Razorpay modal opening</li>
            <li>Report exact error messages if payment still fails</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default RazorpayDiagnostics;
