#!/bin/bash

# Frontend-Backend Connection Test Script
# Tests if React frontend can connect to Node.js backend

echo "========================================"
echo "SERENE WELLBEING - CONNECTION TEST"
echo "========================================"
echo ""

# Get environment variables
FRONTEND_URL="http://localhost:5173"
BACKEND_URL=$(grep VITE_API_URL .env.development 2>/dev/null | cut -d '=' -f2 || echo "http://localhost:5000/api/v1")

echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo ""

# Test 1: Check if backend is running
echo "📡 Test 1: Backend Health Check"
echo "================================"
if curl -s -f "$BACKEND_URL/../health" > /dev/null 2>&1; then
    echo "✅ Backend is RUNNING at $BACKEND_URL"
else
    echo "❌ Backend is NOT RUNNING"
    echo "   Start with: cd backend && npm run dev"
    BACKEND_DOWN=true
fi
echo ""

# Test 2: Check backend auth endpoint
echo "📡 Test 2: Auth Endpoint Test"
echo "================================"
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' 2>/dev/null)

HTTP_CODE=$(echo "$AUTH_RESPONSE" | tail -n1)
BODY=$(echo "$AUTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "404" ]; then
    echo "✅ Auth endpoint responding (Status: $HTTP_CODE)"
    echo "   Response: $BODY" | head -c 100
elif [ -z "$HTTP_CODE" ]; then
    echo "❌ Auth endpoint NOT responding"
else
    echo "⚠️  Unexpected response: $HTTP_CODE"
fi
echo ""

# Test 3: Check CORS configuration
echo "📡 Test 3: CORS Configuration"
echo "================================"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$BACKEND_URL/auth/login" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" 2>/dev/null | grep -i "access-control-allow-origin")

if [ -n "$CORS_RESPONSE" ]; then
    echo "✅ CORS is configured"
    echo "   $CORS_RESPONSE"
else
    echo "❌ CORS may not be configured properly"
    echo "   Frontend requests might be blocked"
fi
echo ""

# Test 4: Check if MongoDB is connected
echo "📡 Test 4: Database Connection"
echo "================================"
if [ -z "$BACKEND_DOWN" ]; then
    echo "⚠️  Cannot verify DB connection without backend health endpoint"
    echo "   Check backend logs for MongoDB connection status"
else
    echo "⏭️  Skipped (backend not running)"
fi
echo ""

# Test 5: Check Razorpay configuration
echo "📡 Test 5: Razorpay Configuration"
echo "================================"
if grep -q "VITE_RAZORPAY_KEY_ID=rzp_" .env.development 2>/dev/null; then
    KEY=$(grep VITE_RAZORPAY_KEY_ID .env.development | cut -d '=' -f2)
    if [ "$KEY" = "rzp_test_your_key_id" ] || [ -z "$KEY" ]; then
        echo "❌ Razorpay key NOT configured"
        echo "   Set VITE_RAZORPAY_KEY_ID in .env.development"
    else
        echo "✅ Razorpay key configured: ${KEY:0:15}..."
    fi
else
    echo "❌ Razorpay key NOT found in .env.development"
fi
echo ""

# Summary
echo "========================================"
echo "SUMMARY"
echo "========================================"
if [ -z "$BACKEND_DOWN" ]; then
    echo "✅ Frontend-Backend connection: WORKING"
    echo ""
    echo "Next steps:"
    echo "1. Start frontend: npm run dev"
    echo "2. Open browser: $FRONTEND_URL"
    echo "3. Test B2C flow: Signup → Browse → Book Session"
else
    echo "❌ Frontend-Backend connection: BROKEN"
    echo ""
    echo "To fix:"
    echo "1. Start backend:"
    echo "   cd backend && npm run dev"
    echo ""
    echo "2. Check backend .env file has:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - RAZORPAY_KEY_ID"
    echo "   - RAZORPAY_KEY_SECRET"
    echo ""
    echo "3. Verify MongoDB is running"
    echo "4. Run this test again"
fi
echo ""
