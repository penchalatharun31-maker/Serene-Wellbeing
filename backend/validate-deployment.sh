#!/bin/bash

###############################################################################
# Railway Deployment Validation Script
# Run this before deploying to ensure everything is configured correctly
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Railway Deployment Validation                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}[✓]${NC} File exists: $1"
    else
        echo -e "${RED}[✗]${NC} Missing file: $1"
        ((ERRORS++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}[✓]${NC} Directory exists: $1"
    else
        echo -e "${RED}[✗]${NC} Missing directory: $1"
        ((ERRORS++))
    fi
}

# Function to check package.json script
check_script() {
    if grep -q "\"$1\"" package.json 2>/dev/null; then
        echo -e "${GREEN}[✓]${NC} Script exists: $1"
    else
        echo -e "${YELLOW}[!]${NC} Missing script: $1"
        ((WARNINGS++))
    fi
}

echo "Checking backend structure..."
echo ""

# Check required files
echo "📁 Required Files:"
check_file "package.json"
check_file "Dockerfile"
check_file "railway.json"
check_file "tsconfig.json"
echo ""

# Check source directory
echo "📁 Source Code:"
check_dir "src"
check_file "src/server.ts"
echo ""

# Check package.json scripts
echo "📝 Package.json Scripts:"
check_script "build"
check_script "start"
check_script "dev"
echo ""

# Validate Dockerfile
echo "🐳 Dockerfile Validation:"
if [ -f "Dockerfile" ]; then
    if grep -q "FROM node:" Dockerfile; then
        echo -e "${GREEN}[✓]${NC} Dockerfile has Node.js base image"
    else
        echo -e "${RED}[✗]${NC} Dockerfile missing Node.js base image"
        ((ERRORS++))
    fi

    if grep -q "EXPOSE" Dockerfile; then
        echo -e "${GREEN}[✓]${NC} Dockerfile exposes port"
    else
        echo -e "${YELLOW}[!]${NC} Dockerfile doesn't expose port"
        ((WARNINGS++))
    fi

    if grep -q "CMD" Dockerfile || grep -q "ENTRYPOINT" Dockerfile; then
        echo -e "${GREEN}[✓]${NC} Dockerfile has startup command"
    else
        echo -e "${RED}[✗]${NC} Dockerfile missing startup command"
        ((ERRORS++))
    fi
fi
echo ""

# Validate railway.json
echo "🚂 Railway Configuration:"
if [ -f "railway.json" ]; then
    if grep -q "DOCKERFILE" railway.json; then
        echo -e "${GREEN}[✓]${NC} Railway configured to use Dockerfile"
    else
        echo -e "${YELLOW}[!]${NC} Railway not using Dockerfile builder"
        ((WARNINGS++))
    fi

    if grep -q "healthcheckPath" railway.json; then
        echo -e "${GREEN}[✓]${NC} Health check configured"
    else
        echo -e "${YELLOW}[!]${NC} No health check configured"
        ((WARNINGS++))
    fi
fi
echo ""

# Check TypeScript configuration
echo "📘 TypeScript Configuration:"
if [ -f "tsconfig.json" ]; then
    if grep -q "\"outDir\"" tsconfig.json; then
        echo -e "${GREEN}[✓]${NC} TypeScript output directory configured"
    else
        echo -e "${YELLOW}[!]${NC} TypeScript outDir not specified"
        ((WARNINGS++))
    fi
fi
echo ""

# Check dependencies
echo "📦 Dependencies:"
if [ -f "package.json" ]; then
    if grep -q "express" package.json; then
        echo -e "${GREEN}[✓]${NC} Express.js found"
    else
        echo -e "${RED}[✗]${NC} Express.js missing"
        ((ERRORS++))
    fi

    if grep -q "mongoose" package.json; then
        echo -e "${GREEN}[✓]${NC} Mongoose found"
    else
        echo -e "${RED}[✗]${NC} Mongoose missing"
        ((ERRORS++))
    fi

    if grep -q "@google/generative-ai" package.json; then
        echo -e "${GREEN}[✓]${NC} Google Generative AI SDK found"
    else
        echo -e "${RED}[✗]${NC} Google Generative AI SDK missing"
        ((ERRORS++))
    fi
fi
echo ""

# Check for common issues
echo "🔍 Common Issues Check:"

if [ -f ".dockerignore" ]; then
    echo -e "${GREEN}[✓]${NC} .dockerignore exists"
else
    echo -e "${YELLOW}[!]${NC} No .dockerignore file (recommended)"
    ((WARNINGS++))
fi

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}[!]${NC} node_modules exists (should be in .dockerignore)"
    ((WARNINGS++))
else
    echo -e "${GREEN}[✓]${NC} node_modules not present"
fi

if [ -d "dist" ]; then
    echo -e "${YELLOW}[!]${NC} dist directory exists (will be rebuilt in Railway)"
else
    echo -e "${GREEN}[✓]${NC} No dist directory"
fi

echo ""

# Environment variables reminder
echo "⚠️  Environment Variables Reminder:"
echo ""
echo "Make sure these are set in Railway:"
echo "  - MONGODB_URI"
echo "  - REDIS_URL"
echo "  - JWT_SECRET"
echo "  - JWT_REFRESH_SECRET"
echo "  - SESSION_SECRET"
echo "  - GEMINI_API_KEY"
echo "  - GEMINI_MODEL"
echo "  - NODE_ENV=production"
echo "  - FRONTEND_URL"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Validation Summary                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found.${NC}"
    echo -e "${YELLOW}You can proceed, but review the warnings above.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found.${NC}"
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found.${NC}"
    echo ""
    echo -e "${RED}Please fix the errors before deploying.${NC}"
    exit 1
fi
