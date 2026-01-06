#!/bin/bash

# 🧪 Authentication & MongoDB Atlas Testing Script
# Run this on your LOCAL MACHINE (not sandbox)

echo "🔍 Serene Wellbeing - Authentication Test Suite"
echo "==============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api/v1"

echo "📋 Prerequisites Check:"
echo "----------------------"

# Check if backend is running
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend server is running"
else
    echo -e "${RED}✗${NC} Backend server is NOT running"
    echo "   Start it with: cd backend && npm run dev"
    exit 1
fi

echo ""
echo "🧪 Test 1: Register User"
echo "------------------------"

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "role": "user"
  }')

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} User registration successful"
    USER_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
    echo "   Token: ${USER_TOKEN:0:20}..."
    echo "   User ID: $USER_ID"
else
    echo -e "${YELLOW}⚠${NC} User might already exist, trying login..."
fi

echo ""
echo "🧪 Test 2: Login User"
echo "---------------------"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} User login successful"
    USER_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    USER_ROLE=$(echo "$LOGIN_RESPONSE" | grep -o '"role":"[^"]*' | sed 's/"role":"//')
    echo "   Token: ${USER_TOKEN:0:20}..."
    echo "   Role: $USER_ROLE"

    # Verify role is 'user'
    if [ "$USER_ROLE" = "user" ]; then
        echo -e "${GREEN}✓${NC} Role is correctly set to 'user'"
    else
        echo -e "${RED}✗${NC} Role is '$USER_ROLE', expected 'user'"
    fi
else
    echo -e "${RED}✗${NC} User login failed"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "🧪 Test 3: Get User Profile"
echo "---------------------------"

PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} Get profile successful"
    echo "   User: $(echo "$PROFILE_RESPONSE" | grep -o '"name":"[^"]*' | sed 's/"name":"//')"
    echo "   Email: $(echo "$PROFILE_RESPONSE" | grep -o '"email":"[^"]*' | sed 's/"email":"//')"
else
    echo -e "${RED}✗${NC} Get profile failed"
fi

echo ""
echo "🧪 Test 4: Register Expert"
echo "--------------------------"

EXPERT_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Expert",
    "email": "testexpert@example.com",
    "password": "password123",
    "role": "expert"
  }')

if echo "$EXPERT_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} Expert registration successful"
    EXPERT_TOKEN=$(echo "$EXPERT_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "   Token: ${EXPERT_TOKEN:0:20}..."
elif echo "$EXPERT_RESPONSE" | grep -q "already registered"; then
    echo -e "${YELLOW}⚠${NC} Expert already exists, logging in..."

    EXPERT_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "testexpert@example.com",
        "password": "password123"
      }')

    EXPERT_TOKEN=$(echo "$EXPERT_LOGIN" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "   Token: ${EXPERT_TOKEN:0:20}..."
fi

echo ""
echo "🧪 Test 5: Role-Based Authorization"
echo "------------------------------------"

echo "Testing: User trying to access expert route..."
USER_ACCESS_EXPERT=$(curl -s -X GET "$API_URL/experts/dashboard" \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$USER_ACCESS_EXPERT" | grep -q "not authorized"; then
    echo -e "${GREEN}✓${NC} User correctly denied access to expert route (403)"
elif echo "$USER_ACCESS_EXPERT" | grep -q "Not found"; then
    echo -e "${YELLOW}⚠${NC} Route not found (might not exist yet)"
else
    echo -e "${RED}✗${NC} User incorrectly allowed access to expert route!"
    echo "   This is a SECURITY ISSUE!"
fi

echo ""
echo "🧪 Test 6: Payment Order Creation"
echo "----------------------------------"

PAYMENT_RESPONSE=$(curl -s -X POST "$API_URL/payments/create-razorpay-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "amount": 499,
    "currency": "INR"
  }')

if echo "$PAYMENT_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} Payment order creation successful"
    ORDER_ID=$(echo "$PAYMENT_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
    echo "   Order ID: $ORDER_ID"
else
    echo -e "${RED}✗${NC} Payment order creation failed"
    echo "   Note: This might fail if Razorpay keys are not configured"
    echo "   Response: $PAYMENT_RESPONSE"
fi

echo ""
echo "================================"
echo "📊 Test Summary"
echo "================================"
echo ""
echo "✅ If all tests passed, your setup is working correctly!"
echo ""
echo "🔍 Next Steps:"
echo "1. Check MongoDB Atlas dashboard for data"
echo "2. Test payment flow in browser"
echo "3. Test role-based routing in frontend"
echo ""
echo "📖 See MONGODB_ATLAS_VERIFICATION_GUIDE.md for detailed instructions"
echo ""
