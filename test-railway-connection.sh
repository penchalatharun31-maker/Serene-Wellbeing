#!/bin/bash

# Railway Backend Connection Test
# Tests if Railway backend is properly accessible

echo "🔍 TESTING RAILWAY BACKEND CONNECTION"
echo "======================================"
echo ""

# Get Railway URL from user
read -p "Enter your Railway backend URL (without /api/v1): " RAILWAY_URL

# Remove trailing slash if present
RAILWAY_URL=${RAILWAY_URL%/}

echo ""
echo "Testing: $RAILWAY_URL"
echo ""

# Test 1: Root endpoint
echo "📡 Test 1: Root Endpoint"
echo "========================"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL")
echo "URL: $RAILWAY_URL"
echo "Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
    echo "✅ Root endpoint responding"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ 403 Forbidden - Domain not public or networking issue"
    echo "   Fix: Check Railway Settings → Networking → Enable Public Networking"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Cannot connect - URL might be wrong"
else
    echo "⚠️  Status $HTTP_CODE - Unexpected response"
fi
echo ""

# Test 2: Health endpoint
echo "📡 Test 2: Health Endpoint"
echo "=========================="
HEALTH_RESPONSE=$(curl -s "$RAILWAY_URL/api/v1/health" -w "\n%{http_code}")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

echo "URL: $RAILWAY_URL/api/v1/health"
echo "Status: $HTTP_CODE"
echo "Response: $BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health endpoint working!"
else
    echo "❌ Health endpoint failed"
fi
echo ""

# Test 3: API version endpoint
echo "📡 Test 3: API Version Endpoint"
echo "==============================="
VERSION_RESPONSE=$(curl -s "$RAILWAY_URL/api/v1" -w "\n%{http_code}")
HTTP_CODE=$(echo "$VERSION_RESPONSE" | tail -n1)
BODY=$(echo "$VERSION_RESPONSE" | sed '$d')

echo "URL: $RAILWAY_URL/api/v1"
echo "Status: $HTTP_CODE"
echo "Response: $BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API endpoint working!"
else
    echo "❌ API endpoint failed"
fi
echo ""

# Test 4: CORS preflight
echo "📡 Test 4: CORS Configuration"
echo "============================="
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$RAILWAY_URL/api/v1/auth/login" \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: POST" | grep -i "access-control")

if [ -n "$CORS_RESPONSE" ]; then
    echo "✅ CORS headers found:"
    echo "$CORS_RESPONSE"
else
    echo "❌ No CORS headers - Frontend requests will be blocked"
    echo "   Fix: Add FRONTEND_URL and ALLOWED_ORIGINS to Railway variables"
fi
echo ""

# Summary
echo "======================================"
echo "SUMMARY"
echo "======================================"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Railway backend is accessible!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.production:"
    echo "   VITE_API_URL=$RAILWAY_URL/api/v1"
    echo ""
    echo "2. Redeploy frontend with this URL"
    echo "3. Test booking a session"
else
    echo "❌ Railway backend is NOT accessible"
    echo ""
    echo "Possible fixes:"
    echo "1. Check Railway domain in dashboard (Settings → Networking)"
    echo "2. Ensure Public Networking is enabled"
    echo "3. Verify backend deployment completed successfully"
    echo "4. Check Railway logs for errors"
fi
echo ""
