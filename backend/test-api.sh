#!/bin/bash

# ========================================
# Serene Wellbeing Hub - API Test Script
# ========================================
# Tests all critical user flows and API endpoints
# Run with: chmod +x test-api.sh && ./test-api.sh
# ========================================

BASE_URL="${API_URL:-http://localhost:5000}/api/v1"
PASSED=0
FAILED=0
TOTAL=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
declare -a FAILED_TESTS=()

# Helper function to print test results
print_test() {
    local test_name=$1
    local status=$2
    local response=$3

    TOTAL=$((TOTAL + 1))

    if [ "$status" == "PASS" ]; then
        echo -e "${GREEN}✓${NC} Test $TOTAL: $test_name"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} Test $TOTAL: $test_name"
        echo -e "   ${YELLOW}Response:${NC} $response"
        FAILED=$((FAILED + 1))
        FAILED_TESTS+=("$test_name")
    fi
}

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Serene Wellbeing Hub - API Tests${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Testing API at: $BASE_URL\n"

# ========================================
# 1. HEALTH CHECK
# ========================================
echo -e "${YELLOW}1. Health & Infrastructure${NC}"

response=$(curl -s "$BASE_URL/../health")
if echo "$response" | grep -q '"success":true'; then
    print_test "Health endpoint" "PASS" "$response"
else
    print_test "Health endpoint" "FAIL" "$response"
fi

# ========================================
# 2. USER REGISTRATION & AUTHENTICATION
# ========================================
echo -e "\n${YELLOW}2. User Registration & Authentication${NC}"

# Generate unique email for testing
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@serene-test.com"
TEST_PASSWORD="TestPass123!"

# Test registration with valid data
response=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"phone\": \"+1234567890\",
        \"dateOfBirth\": \"1990-01-01\"
    }")

if echo "$response" | grep -q '"success":true'; then
    print_test "User registration (valid data)" "PASS" "$response"
    ACCESS_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$response" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
else
    print_test "User registration (valid data)" "FAIL" "$response"
fi

# Test registration with invalid email
response=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User\",
        \"email\": \"invalid-email\",
        \"password\": \"$TEST_PASSWORD\"
    }")

if echo "$response" | grep -q '"success":false'; then
    print_test "Email validation (invalid email)" "PASS" "$response"
else
    print_test "Email validation (invalid email)" "FAIL" "$response"
fi

# Test registration with weak password
response=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User\",
        \"email\": \"test2@example.com\",
        \"password\": \"weak\"
    }")

if echo "$response" | grep -q '"success":false'; then
    print_test "Password validation (weak password)" "PASS" "$response"
else
    print_test "Password validation (weak password)" "FAIL" "$response"
fi

# Test login with correct credentials
response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }")

if echo "$response" | grep -q '"success":true'; then
    print_test "User login (correct credentials)" "PASS" "$response"
    LOGIN_TOKEN=$(echo "$response" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
    print_test "User login (correct credentials)" "FAIL" "$response"
fi

# Test login with incorrect password
response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"WrongPassword123!\"
    }")

if echo "$response" | grep -q '"success":false'; then
    print_test "Login security (wrong password)" "PASS" "$response"
else
    print_test "Login security (wrong password)" "FAIL" "$response"
fi

# ========================================
# 3. PROTECTED ROUTES & AUTHORIZATION
# ========================================
echo -e "\n${YELLOW}3. Protected Routes & Authorization${NC}"

# Test accessing protected route without token
response=$(curl -s "$BASE_URL/users/me")

if echo "$response" | grep -q '"success":false'; then
    print_test "Protected route (no token)" "PASS" "$response"
else
    print_test "Protected route (no token)" "FAIL" "$response"
fi

# Test accessing protected route with valid token
if [ ! -z "$LOGIN_TOKEN" ]; then
    response=$(curl -s "$BASE_URL/users/me" \
        -H "Authorization: Bearer $LOGIN_TOKEN")

    if echo "$response" | grep -q '"email"'; then
        print_test "Protected route (valid token)" "PASS" "$response"
    else
        print_test "Protected route (valid token)" "FAIL" "$response"
    fi
fi

# ========================================
# 4. BLOG ENDPOINTS
# ========================================
echo -e "\n${YELLOW}4. Blog System${NC}"

# Test getting all blog posts
response=$(curl -s "$BASE_URL/blog")

if echo "$response" | grep -q '"success":true\|"data"'; then
    print_test "Get all blog posts" "PASS" "OK"
else
    print_test "Get all blog posts" "FAIL" "$response"
fi

# Test getting categories
response=$(curl -s "$BASE_URL/blog/categories")

if echo "$response" | grep -q '"success":true\|"data"'; then
    print_test "Get blog categories" "PASS" "OK"
else
    print_test "Get blog categories" "FAIL" "$response"
fi

# Test getting popular posts
response=$(curl -s "$BASE_URL/blog/popular")

if echo "$response" | grep -q '"success":true\|"data"'; then
    print_test "Get popular blog posts" "PASS" "OK"
else
    print_test "Get popular blog posts" "FAIL" "$response"
fi

# ========================================
# 5. EXPERT ENDPOINTS
# ========================================
echo -e "\n${YELLOW}5. Expert Management${NC}"

# Test browsing experts
response=$(curl -s "$BASE_URL/experts")

if echo "$response" | grep -q '"success":true\|"data"'; then
    print_test "Browse experts" "PASS" "OK"
else
    print_test "Browse experts" "FAIL" "$response"
fi

# ========================================
# 6. SESSION ENDPOINTS
# ========================================
echo -e "\n${YELLOW}6. Session Management${NC}"

# Test getting sessions (requires auth)
if [ ! -z "$LOGIN_TOKEN" ]; then
    response=$(curl -s "$BASE_URL/sessions" \
        -H "Authorization: Bearer $LOGIN_TOKEN")

    if echo "$response" | grep -q '"success":true\|"data"'; then
        print_test "Get user sessions" "PASS" "OK"
    else
        print_test "Get user sessions" "FAIL" "$response"
    fi
fi

# ========================================
# 7. VALIDATION & ERROR HANDLING
# ========================================
echo -e "\n${YELLOW}7. Validation & Error Handling${NC}"

# Test 404 handling
response=$(curl -s "$BASE_URL/nonexistent-endpoint")

if echo "$response" | grep -q '404\|"success":false'; then
    print_test "404 error handling" "PASS" "OK"
else
    print_test "404 error handling" "FAIL" "$response"
fi

# Test invalid JSON
response=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "invalid json")

if echo "$response" | grep -q '"success":false\|error'; then
    print_test "Invalid JSON handling" "PASS" "OK"
else
    print_test "Invalid JSON handling" "FAIL" "$response"
fi

# ========================================
# 8. RATE LIMITING
# ========================================
echo -e "\n${YELLOW}8. Security & Rate Limiting${NC}"

# Test rate limiting (send 10 rapid requests)
rate_limited=false
for i in {1..10}; do
    response=$(curl -s "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test@test.com\",\"password\":\"wrong\"}")

    if echo "$response" | grep -q '429\|"Too many requests"'; then
        rate_limited=true
        break
    fi
done

if [ "$rate_limited" = true ]; then
    print_test "Rate limiting (10 rapid requests)" "PASS" "Rate limit triggered"
else
    print_test "Rate limiting (10 rapid requests)" "WARN" "Rate limit not triggered (may need adjustment)"
fi

# ========================================
# RESULTS SUMMARY
# ========================================
echo -e "\n${BLUE}======================================${NC}"
echo -e "${BLUE}  Test Results Summary${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "\n${RED}Failed Tests:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "  ${RED}✗${NC} $test"
    done
    echo -e "\n${YELLOW}Note: Some failures may be expected without MongoDB connection${NC}"
    exit 1
else
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
fi
