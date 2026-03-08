#!/bin/bash

# ==============================================================================
# Serene Wellbeing - Comprehensive QA Testing Script
# ==============================================================================

set -e

echo "=================================="
echo "SERENE WELLBEING - QA TESTING"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_TESTS=0

# Function to log test results
log_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# ==============================================================================
# TEST 1: Environment Configuration
# ==============================================================================
echo "=================================="
echo "TEST 1: Environment Configuration"
echo "=================================="

# Check backend .env exists
if [ -f "backend/.env.development" ]; then
    log_test 0 "Backend .env.development file exists"
else
    log_test 1 "Backend .env.development file missing"
fi

# Check frontend .env exists
if [ -f ".env.development" ]; then
    log_test 0 "Frontend .env.development file exists"
else
    log_test 1 "Frontend .env.development file missing"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    log_test 0 "Node.js version >= 18 (found v$NODE_VERSION)"
else
    log_test 1 "Node.js version < 18 (found v$NODE_VERSION)"
fi

echo ""

# ==============================================================================
# TEST 2: Dependencies
# ==============================================================================
echo "=================================="
echo "TEST 2: Dependencies Check"
echo "=================================="

# Backend dependencies
if [ -d "backend/node_modules" ]; then
    log_test 0 "Backend dependencies installed"
else
    log_test 1 "Backend dependencies missing"
fi

# Frontend dependencies
if [ -d "node_modules" ]; then
    log_test 0 "Frontend dependencies installed"
else
    log_test 1 "Frontend dependencies missing"
fi

echo ""

# ==============================================================================
# TEST 3: Build Tests
# ==============================================================================
echo "=================================="
echo "TEST 3: Build Tests"
echo "=================================="

# Build backend
echo "Building backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    log_test 0 "Backend TypeScript compilation successful"
else
    log_test 1 "Backend TypeScript compilation failed"
fi
cd ..

# Build frontend
echo "Building frontend..."
if npm run build > /dev/null 2>&1; then
    log_test 0 "Frontend build successful"
else
    log_test 1 "Frontend build failed"
fi

echo ""

# ==============================================================================
# TEST 4: Code Structure
# ==============================================================================
echo "=================================="
echo "TEST 4: Code Structure"
echo "=================================="

# Check critical files exist
critical_files=(
    "backend/src/server.ts"
    "backend/src/config/database.ts"
    "backend/src/config/redis.ts"
    "backend/src/middleware/auth.ts"
    "backend/src/routes/auth.routes.ts"
    "backend/src/controllers/auth.controller.ts"
    "App.tsx"
    "index.tsx"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_test 0 "Critical file exists: $file"
    else
        log_test 1 "Critical file missing: $file"
    fi
done

echo ""

# ==============================================================================
# TEST 5: Database Models
# ==============================================================================
echo "=================================="
echo "TEST 5: Database Models"
echo "=================================="

models=(
    "User"
    "Expert"
    "Session"
    "Message"
    "BlogPost"
    "MoodEntry"
    "Journal"
    "WellnessChallenge"
    "Transaction"
    "Payout"
)

for model in "${models[@]}"; do
    if [ -f "backend/src/models/$model.ts" ]; then
        log_test 0 "Model exists: $model"
    else
        log_test 1 "Model missing: $model"
    fi
done

echo ""

# ==============================================================================
# TEST 6: API Routes
# ==============================================================================
echo "=================================="
echo "TEST 6: API Routes"
echo "=================================="

routes=(
    "auth.routes"
    "expert.routes"
    "session.routes"
    "payment.routes"
    "message.routes"
    "admin.routes"
    "aiCompanion.routes"
    "mood.routes"
    "blog.routes"
    "journal.routes"
)

for route in "${routes[@]}"; do
    if [ -f "backend/src/routes/$route.ts" ]; then
        log_test 0 "Route exists: $route"
    else
        log_test 1 "Route missing: $route"
    fi
done

echo ""

# ==============================================================================
# SUMMARY
# ==============================================================================
echo "=================================="
echo "TEST SUMMARY"
echo "=================================="
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review above.${NC}"
    exit 1
fi
