#!/bin/bash

# Production Deployment Script for Serene Wellbeing Hub
# This script should be run on the production server

set -e # Exit on any error

echo "🚀 Starting Production Deployment..."

# Configuration
APP_DIR="/opt/serene-wellbeing"
BACKUP_DIR="/opt/backups/serene-wellbeing"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo or as root"
    exit 1
fi

# Navigate to application directory
cd "$APP_DIR" || exit 1

# Backup current deployment
echo "📦 Creating backup..."
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='*.log' \
    . || print_warning "Backup creation failed"
print_success "Backup created: backup_$TIMESTAMP.tar.gz"

# Pull latest changes
echo "📥 Pulling latest code..."
git fetch origin
git checkout main
git pull origin main
print_success "Code updated to latest version"

# Backend deployment
echo "🔧 Deploying Backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm ci --production=false
print_success "Backend dependencies installed"

# Run database migrations (if any)
if [ -f "dist/utils/migrate.js" ]; then
    echo "Running database migrations..."
    npm run migrate || print_warning "Migration skipped or failed"
fi

# Build backend
echo "Building backend..."
npm run build
print_success "Backend built successfully"

cd ..

# Frontend deployment
echo "🎨 Deploying Frontend..."

# Install dependencies
echo "Installing frontend dependencies..."
npm ci --production=false
print_success "Frontend dependencies installed"

# Build frontend
echo "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Docker deployment
echo "🐳 Deploying with Docker..."

# Pull latest images
docker-compose pull

# Restart services with zero-downtime
echo "Restarting services..."
docker-compose up -d --no-deps --build backend
sleep 10 # Wait for backend to be healthy

docker-compose up -d --no-deps --build frontend
sleep 5

print_success "Services restarted"

# Health checks
echo "🏥 Running health checks..."
sleep 15

# Check backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/v1/health)
if [ "$BACKEND_HEALTH" = "200" ]; then
    print_success "Backend is healthy"
else
    print_error "Backend health check failed (HTTP $BACKEND_HEALTH)"
    echo "Rolling back..."
    docker-compose down
    tar -xzf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$APP_DIR"
    docker-compose up -d
    exit 1
fi

# Check frontend health
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    print_success "Frontend is healthy"
else
    print_error "Frontend health check failed (HTTP $FRONTEND_HEALTH)"
    exit 1
fi

# Cleanup old Docker images and containers
echo "🧹 Cleaning up..."
docker system prune -f
print_success "Cleanup completed"

# Keep only last 7 backups
echo "📦 Managing backups..."
cd "$BACKUP_DIR"
ls -t | tail -n +8 | xargs -r rm
print_success "Old backups removed"

# Print deployment summary
echo ""
echo "═══════════════════════════════════════"
print_success "Deployment completed successfully!"
echo "═══════════════════════════════════════"
echo "Timestamp: $(date)"
echo "Backend Health: ✓"
echo "Frontend Health: ✓"
echo "Backup: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo "═══════════════════════════════════════"
echo ""
print_warning "Remember to:"
echo "  1. Test critical user flows"
echo "  2. Monitor error logs"
echo "  3. Check application metrics"
echo ""
