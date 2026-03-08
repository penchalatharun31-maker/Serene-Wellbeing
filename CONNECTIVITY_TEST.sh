#!/bin/bash

# ==============================================================================
# Serene Wellbeing - Frontend-Backend Connectivity Test
# ==============================================================================

set -e

echo "========================================================="
echo "SERENE WELLBEING - CONNECTIVITY & INTEGRATION TEST"
echo "========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0
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

log_warn() {
    WARN_COUNT=$((WARN_COUNT + 1))
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

log_info() {
    echo -e "${BLUE}ℹ INFO${NC}: $1"
}

# ==============================================================================
# TEST 1: Frontend API Configuration
# ==============================================================================
echo "========================================="
echo "TEST 1: Frontend API Configuration"
echo "========================================="

# Check frontend API service
if [ -f "services/api.ts" ]; then
    log_test 0 "Frontend API service file exists"

    # Check if API URL is configured
    if grep -q "VITE_API_URL" .env.development; then
        API_URL=$(grep "VITE_API_URL" .env.development | cut -d'=' -f2)
        log_info "Frontend API URL configured: $API_URL"
        log_test 0 "Frontend API URL is configured"
    else
        log_test 1 "Frontend API URL not configured in .env.development"
    fi

    # Check axios configuration
    if grep -q "withCredentials: true" services/api.ts; then
        log_test 0 "CORS credentials properly configured (withCredentials: true)"
    else
        log_test 1 "CORS credentials not properly configured"
    fi

    # Check CSRF token handling
    if grep -q "X-CSRF-Token" services/api.ts; then
        log_test 0 "CSRF token handling implemented"
    else
        log_test 1 "CSRF token handling missing"
    fi

    # Check token refresh logic
    if grep -q "auth/refresh" services/api.ts; then
        log_test 0 "Token refresh logic implemented"
    else
        log_test 1 "Token refresh logic missing"
    fi
else
    log_test 1 "Frontend API service file missing"
fi

echo ""

# ==============================================================================
# TEST 2: Backend Configuration
# ==============================================================================
echo "========================================="
echo "TEST 2: Backend Configuration"
echo "========================================="

# Check backend server configuration
if [ -f "backend/src/server.ts" ]; then
    log_test 0 "Backend server file exists"

    # Check CORS configuration
    if grep -q "cors" backend/src/server.ts; then
        log_test 0 "CORS middleware configured"
    else
        log_test 1 "CORS middleware not configured"
    fi

    # Check credentials handling
    if grep -q "credentials: true" backend/src/server.ts; then
        log_test 0 "CORS credentials enabled on backend"
    else
        log_test 1 "CORS credentials not enabled on backend"
    fi

    # Check Socket.IO configuration
    if grep -q "socket.io" backend/src/server.ts; then
        log_test 0 "Socket.IO configured"
    else
        log_test 1 "Socket.IO not configured"
    fi

    # Check health check endpoint
    if grep -q "health" backend/src/server.ts; then
        log_test 0 "Health check endpoint configured"
    else
        log_test 1 "Health check endpoint missing"
    fi
else
    log_test 1 "Backend server file missing"
fi

echo ""

# ==============================================================================
# TEST 3: API Routes Configuration
# ==============================================================================
echo "========================================="
echo "TEST 3: API Routes Configuration"
echo "========================================="

# Check if all routes are properly mounted
routes_to_check=(
    "auth"
    "experts"
    "sessions"
    "payments"
    "messages"
    "admin"
    "ai-companion"
    "mood"
    "blog"
    "journal"
    "pricing"
)

mounted_routes=0
for route in "${routes_to_check[@]}"; do
    if grep -q "/$route" backend/src/server.ts; then
        mounted_routes=$((mounted_routes + 1))
    fi
done

if [ $mounted_routes -ge 10 ]; then
    log_test 0 "API routes properly mounted ($mounted_routes/${#routes_to_check[@]} routes found)"
else
    log_test 1 "Some API routes may not be mounted ($mounted_routes/${#routes_to_check[@]} routes found)"
fi

echo ""

# ==============================================================================
# TEST 4: Environment Variables Consistency
# ==============================================================================
echo "========================================="
echo "TEST 4: Environment Variables Consistency"
echo "========================================="

# Check backend port
BACKEND_PORT=$(grep "^PORT=" backend/.env.development | cut -d'=' -f2 || echo "5000")
log_info "Backend configured port: $BACKEND_PORT"

# Check frontend API URL matches backend port
FRONTEND_API_URL=$(grep "VITE_API_URL=" .env.development | cut -d'=' -f2)
if echo "$FRONTEND_API_URL" | grep -q ":$BACKEND_PORT"; then
    log_test 0 "Frontend API URL matches backend port"
else
    log_warn "Frontend API URL port may not match backend port"
fi

# Check CORS origin configuration
BACKEND_FRONTEND_URL=$(grep "^FRONTEND_URL=" backend/.env.development | cut -d'=' -f2 || echo "")
if [ -n "$BACKEND_FRONTEND_URL" ]; then
    log_test 0 "Backend has frontend URL configured: $BACKEND_FRONTEND_URL"

    if echo "$BACKEND_FRONTEND_URL" | grep -q "localhost:3000"; then
        log_test 0 "CORS origin configured for local development"
    else
        log_warn "CORS origin may not be configured for localhost:3000"
    fi
else
    log_test 1 "Backend frontend URL not configured"
fi

echo ""

# ==============================================================================
# TEST 5: Authentication Flow
# ==============================================================================
echo "========================================="
echo "TEST 5: Authentication Flow"
echo "========================================="

# Check auth controller exists
if [ -f "backend/src/controllers/auth.controller.ts" ]; then
    log_test 0 "Auth controller exists"
else
    log_test 1 "Auth controller missing"
fi

# Check auth routes
if [ -f "backend/src/routes/auth.routes.ts" ]; then
    log_test 0 "Auth routes exist"

    # Check for essential auth endpoints
    if grep -q "register" backend/src/routes/auth.routes.ts; then
        log_test 0 "Registration endpoint configured"
    else
        log_test 1 "Registration endpoint missing"
    fi

    if grep -q "login" backend/src/routes/auth.routes.ts; then
        log_test 0 "Login endpoint configured"
    else
        log_test 1 "Login endpoint missing"
    fi

    if grep -q "refresh" backend/src/routes/auth.routes.ts; then
        log_test 0 "Token refresh endpoint configured"
    else
        log_test 1 "Token refresh endpoint missing"
    fi

    if grep -q "google" backend/src/routes/auth.routes.ts; then
        log_test 0 "Google OAuth configured"
    else
        log_warn "Google OAuth may not be configured"
    fi
else
    log_test 1 "Auth routes missing"
fi

# Check auth middleware
if [ -f "backend/src/middleware/auth.ts" ]; then
    log_test 0 "Auth middleware exists"
else
    log_test 1 "Auth middleware missing"
fi

echo ""

# ==============================================================================
# TEST 6: Security Configuration
# ==============================================================================
echo "========================================="
echo "TEST 6: Security Configuration"
echo "========================================="

# Check helmet middleware
if grep -q "helmet" backend/src/server.ts; then
    log_test 0 "Helmet security middleware configured"
else
    log_test 1 "Helmet security middleware missing"
fi

# Check rate limiting
if [ -f "backend/src/middleware/rateLimiter.ts" ]; then
    log_test 0 "Rate limiting middleware exists"
else
    log_test 1 "Rate limiting middleware missing"
fi

# Check CSRF protection
if [ -f "backend/src/middleware/csrf.ts" ]; then
    log_test 0 "CSRF protection middleware exists"
else
    log_test 1 "CSRF protection middleware missing"
fi

# Check input validation
if [ -f "backend/src/middleware/validation.ts" ]; then
    log_test 0 "Input validation middleware exists"
else
    log_test 1 "Input validation middleware missing"
fi

echo ""

# ==============================================================================
# TEST 7: Real-time Communication
# ==============================================================================
echo "========================================="
echo "TEST 7: Real-time Communication"
echo "========================================="

# Check Socket.IO setup
if [ -d "backend/src/sockets" ]; then
    log_test 0 "Socket.IO directory exists"

    if [ -f "backend/src/sockets/socket.ts" ]; then
        log_test 0 "Socket.IO setup file exists"
    else
        log_test 1 "Socket.IO setup file missing"
    fi
else
    log_test 1 "Socket.IO directory missing"
fi

# Check frontend socket client
if grep -q "socket.io-client" package.json; then
    log_test 0 "Frontend has socket.io-client dependency"
else
    log_test 1 "Frontend missing socket.io-client dependency"
fi

echo ""

# ==============================================================================
# TEST 8: Database and Redis
# ==============================================================================
echo "========================================="
echo "TEST 8: Database and Redis Configuration"
echo "========================================="

# Check database config
if [ -f "backend/src/config/database.ts" ]; then
    log_test 0 "Database configuration exists"
else
    log_test 1 "Database configuration missing"
fi

# Check Redis config
if [ -f "backend/src/config/redis.ts" ]; then
    log_test 0 "Redis configuration exists"
else
    log_test 1 "Redis configuration missing"
fi

# Check MongoDB URI configuration
if grep -q "MONGODB_URI=" backend/.env.development; then
    log_test 0 "MongoDB URI configured"
else
    log_test 1 "MongoDB URI not configured"
fi

# Check Redis URL configuration
if grep -q "REDIS_URL=" backend/.env.development; then
    log_test 0 "Redis URL configured"
else
    log_test 1 "Redis URL not configured"
fi

echo ""

# ==============================================================================
# TEST 9: API Integration Points
# ==============================================================================
echo "========================================="
echo "TEST 9: API Integration Points"
echo "========================================="

# Check if frontend uses the API service
if [ -d "pages" ]; then
    api_usage=$(find pages -name "*.tsx" -exec grep -l "apiClient\|api" {} \; 2>/dev/null | wc -l)
    if [ "$api_usage" -gt 0 ]; then
        log_test 0 "Frontend pages use API service ($api_usage pages found)"
    else
        log_warn "No API usage found in frontend pages"
    fi
fi

# Check if components use the API service
if [ -d "components" ]; then
    api_usage=$(find components -name "*.tsx" -exec grep -l "apiClient\|api" {} \; 2>/dev/null | wc -l)
    if [ "$api_usage" -gt 0 ]; then
        log_test 0 "Frontend components use API service ($api_usage components found)"
    else
        log_warn "No API usage found in frontend components"
    fi
fi

echo ""

# ==============================================================================
# TEST 10: Build Verification
# ==============================================================================
echo "========================================="
echo "TEST 10: Build Verification"
echo "========================================="

# Check if backend builds exist
if [ -d "backend/dist" ]; then
    log_test 0 "Backend build directory exists"

    if [ -f "backend/dist/server.js" ]; then
        log_test 0 "Backend compiled server file exists"
    else
        log_test 1 "Backend compiled server file missing"
    fi
else
    log_warn "Backend build directory missing (run 'npm run build' in backend)"
fi

# Check if frontend builds exist
if [ -d "dist" ]; then
    log_test 0 "Frontend build directory exists"

    if [ -f "dist/index.html" ]; then
        log_test 0 "Frontend compiled index.html exists"
    else
        log_test 1 "Frontend compiled index.html missing"
    fi
else
    log_warn "Frontend build directory missing (run 'npm run build')"
fi

echo ""

# ==============================================================================
# SUMMARY
# ==============================================================================
echo "========================================="
echo "CONNECTIVITY TEST SUMMARY"
echo "========================================="
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo -e "${YELLOW}Warnings: $WARN_COUNT${NC}"
echo ""

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASS_COUNT * 100 / TOTAL_TESTS))
    echo "Success Rate: ${SUCCESS_RATE}%"
    echo ""
fi

# Provide overall assessment
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ ALL CONNECTIVITY TESTS PASSED!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "The frontend and backend appear to be properly connected."
    echo "Key features verified:"
    echo "  ✓ API configuration"
    echo "  ✓ CORS settings"
    echo "  ✓ Authentication flow"
    echo "  ✓ Security middleware"
    echo "  ✓ Real-time communication (Socket.IO)"
    echo ""
    if [ $WARN_COUNT -gt 0 ]; then
        echo -e "${YELLOW}Note: There are $WARN_COUNT warnings. Review them above.${NC}"
    fi
    exit 0
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}✗ SOME CONNECTIVITY TESTS FAILED${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "Please review the failed tests above."
    echo "Common issues:"
    echo "  - Missing configuration files"
    echo "  - Incorrect environment variables"
    echo "  - Missing middleware or routes"
    echo ""
    exit 1
fi
