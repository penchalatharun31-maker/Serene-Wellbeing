#!/bin/bash

###############################################################################
# Railway Backend Deployment Setup Script
# This script helps you set up Railway deployment for the Serene Wellbeing backend
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Railway Backend Deployment Setup - Serene Wellbeing Hub  ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if Railway CLI is installed
print_status "Checking for Railway CLI..."
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI not found!"
    echo ""
    echo "Install Railway CLI:"
    echo "  npm install -g @railway/cli"
    echo "  OR"
    echo "  brew install railway"
    echo ""
    exit 1
fi
print_success "Railway CLI found"

# Check if logged in to Railway
print_status "Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    print_error "Not logged in to Railway!"
    echo ""
    echo "Please login first:"
    echo "  railway login"
    echo ""
    exit 1
fi
print_success "Authenticated with Railway"

# Check backend directory
print_status "Checking backend directory..."
if [ ! -d "backend" ]; then
    print_error "backend directory not found! Are you in the project root?"
    exit 1
fi
print_success "Backend directory found"

# Check required files
print_status "Checking required files..."
REQUIRED_FILES=(
    "backend/package.json"
    "backend/Dockerfile"
    "backend/railway.json"
    "backend/tsconfig.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done
print_success "All required files present"

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Railway Project Setup${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Ask if user wants to create a new project or use existing
echo "Do you want to:"
echo "  1) Link to an existing Railway project"
echo "  2) Create a new Railway project"
read -p "Enter choice (1 or 2): " project_choice

if [ "$project_choice" = "2" ]; then
    print_status "Creating new Railway project..."
    read -p "Enter project name (default: serene-wellbeing): " project_name
    project_name=${project_name:-serene-wellbeing}

    railway init -n "$project_name"
    print_success "Project created: $project_name"
elif [ "$project_choice" = "1" ]; then
    print_status "Link to existing project..."
    railway link
else
    print_error "Invalid choice"
    exit 1
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Service Configuration${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Set up backend service
print_status "Configuring backend service..."

# Change to backend directory for Railway commands
cd backend

# Set root directory for the service
print_status "Setting Railway root directory to /backend..."
railway service --name "backend" 2>/dev/null || railway up --service backend

echo ""
print_success "Backend service configured!"

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Environment Variables Setup${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

print_warning "IMPORTANT: You need to set environment variables in Railway Dashboard"
echo ""
echo "Required environment variables:"
echo ""
echo -e "${GREEN}1. MONGODB_URI${NC} - Your MongoDB connection string"
echo "   Example: mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing"
echo ""
echo -e "${GREEN}2. REDIS_URL${NC} - Redis connection URL"
echo "   Get this from Railway Redis addon or external Redis"
echo "   Example: redis://default:password@redis.railway.app:6379"
echo ""
echo -e "${GREEN}3. JWT_SECRET${NC} - Strong random secret (64+ characters)"
echo "   Generate: openssl rand -base64 64"
echo ""
echo -e "${GREEN}4. JWT_REFRESH_SECRET${NC} - Another strong random secret"
echo "   Generate: openssl rand -base64 64"
echo ""
echo -e "${GREEN}5. GEMINI_API_KEY${NC} - Google Gemini AI API key"
echo "   Get from: https://aistudio.google.com/app/apikey"
echo ""
echo -e "${GREEN}6. FRONTEND_URL${NC} - Your frontend Railway URL"
echo "   Example: https://your-frontend.up.railway.app"
echo ""
echo -e "${GREEN}7. NODE_ENV${NC} - Set to 'production'"
echo ""
echo -e "${GREEN}8. SESSION_SECRET${NC} - Another strong random secret"
echo ""

read -p "Do you want to open Railway Dashboard to set variables? (y/n): " open_dashboard

if [ "$open_dashboard" = "y" ]; then
    railway open
    print_status "Opening Railway Dashboard..."
    echo ""
    print_warning "Please set all required environment variables in the dashboard"
    echo "Press Enter when done..."
    read
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Add-ons Setup (Optional)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

read -p "Do you want to add Railway Redis? (y/n): " add_redis
if [ "$add_redis" = "y" ]; then
    print_status "Adding Redis addon..."
    railway add redis
    print_success "Redis addon added!"
    print_warning "Copy REDIS_URL from Railway dashboard and add it to backend environment variables"
fi

# Return to project root
cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║             Setup Complete!                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. ✓ Set all required environment variables in Railway Dashboard"
echo "2. Deploy backend:"
echo "   cd backend"
echo "   railway up"
echo ""
echo "3. Check deployment status:"
echo "   railway status"
echo ""
echo "4. View logs:"
echo "   railway logs"
echo ""
echo "5. Test backend health:"
echo "   curl https://YOUR-BACKEND-URL.up.railway.app/api/v1/health"
echo ""
echo "For detailed environment variables, see: railway-env-template.txt"
echo ""
print_success "Happy deploying!"
