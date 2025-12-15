#!/bin/bash

# Production Server Setup Script
# Run this script on a fresh server to set up the environment

set -e

echo "🔧 Setting up Production Server for Serene Wellbeing Hub..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y
print_success "System updated"

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
else
    print_warning "Docker already installed"
fi

# Install Docker Compose
echo "📦 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION="2.23.0"
    curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_warning "Docker Compose already installed"
fi

# Install Node.js and npm
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    print_success "Node.js installed"
else
    print_warning "Node.js already installed"
fi

# Install Git
echo "📦 Installing Git..."
apt-get install -y git
print_success "Git installed"

# Install Nginx (for reverse proxy)
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    print_success "Nginx installed"
else
    print_warning "Nginx already installed"
fi

# Install Certbot for SSL
echo "🔒 Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx
print_success "Certbot installed"

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/serene-wellbeing
mkdir -p /opt/backups/serene-wellbeing
print_success "Directories created"

# Set up firewall
echo "🔥 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
print_success "Firewall configured"

# Create deploy user
echo "👤 Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    print_success "Deploy user created"
else
    print_warning "Deploy user already exists"
fi

# Set up log rotation
echo "📝 Setting up log rotation..."
cat > /etc/logrotate.d/serene-wellbeing << EOF
/opt/serene-wellbeing/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 deploy deploy
    sharedscripts
    postrotate
        docker-compose -f /opt/serene-wellbeing/docker-compose.yml restart backend
    endscript
}
EOF
print_success "Log rotation configured"

# Set up Nginx reverse proxy
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/serene-wellbeing << 'EOF'
# Backend API
server {
    listen 80;
    server_name api.serene-wellbeing.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Frontend
server {
    listen 80;
    server_name serene-wellbeing.com www.serene-wellbeing.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/serene-wellbeing /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
print_success "Nginx configured"

# Set up monitoring (optional - install monitoring tools)
echo "📊 Installing monitoring tools..."
apt-get install -y htop iotop nethogs
print_success "Monitoring tools installed"

# Print completion message
echo ""
echo "═══════════════════════════════════════"
print_success "Server setup completed!"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /opt/serene-wellbeing"
echo "2. Set up environment variables in backend/.env"
echo "3. Set up SSL with: certbot --nginx -d yourdomain.com"
echo "4. Run docker-compose up -d"
echo ""
print_warning "Don't forget to:"
echo "  - Configure your DNS records"
echo "  - Set up database backups"
echo "  - Configure monitoring and alerting"
echo "  - Set up SSH keys for secure access"
echo ""
