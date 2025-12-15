# 🚀 Deployment Guide - Serene Wellbeing Hub

Complete guide for deploying the Serene Wellbeing Hub to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Environment Configuration](#environment-configuration)
- [Deployment Methods](#deployment-methods)
- [Post-Deployment](#post-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Services

1. **Domain Names**
   - Main domain: `serene-wellbeing.com`
   - API subdomain: `api.serene-wellbeing.com`

2. **Third-Party Services**
   - MongoDB Atlas or self-hosted MongoDB
   - Redis instance
   - Google Gemini API key
   - Stripe account (production keys)
   - Email service (Gmail, SendGrid, etc.)
   - Docker Hub account (for Docker images)

3. **Server Requirements**
   - Ubuntu 20.04+ LTS
   - Minimum 2 CPU cores
   - 4GB RAM (8GB recommended)
   - 40GB SSD storage
   - Root or sudo access

## Server Setup

### Option 1: Automated Setup Script

```bash
# Download and run the setup script
curl -o setup-production-server.sh https://raw.githubusercontent.com/yourrepo/serene-wellbeing/main/scripts/setup-production-server.sh
chmod +x setup-production-server.sh
sudo ./setup-production-server.sh
```

### Option 2: Manual Setup

#### 1. Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

#### 2. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 4. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 5. Install Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
```

#### 6. Install Certbot (for SSL)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

#### 7. Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Environment Configuration

### 1. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourrepo/serene-wellbeing.git
cd serene-wellbeing
```

### 2. Backend Environment Variables

Create `/opt/serene-wellbeing/backend/.env`:

```bash
# Copy example and edit
cp backend/.env.example backend/.env
nano backend/.env
```

**Required Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing
REDIS_URL=redis://:password@your-redis-host:6379
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
GEMINI_API_KEY=<your-gemini-key>
STRIPE_SECRET_KEY=sk_live_<your-key>
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>
FRONTEND_URL=https://serene-wellbeing.com
```

**Generate Strong Secrets:**
```bash
# Generate JWT secrets
openssl rand -base64 48
openssl rand -base64 48
```

### 3. Frontend Environment Variables

Create `/opt/serene-wellbeing/.env.production`:

```bash
cp .env.example .env.production
nano .env.production
```

```env
VITE_API_URL=https://api.serene-wellbeing.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_<your-key>
```

## Deployment Methods

### Method 1: Docker Compose (Recommended)

#### 1. Build and Start Services

```bash
cd /opt/serene-wellbeing
docker-compose -f docker-compose.yml up -d --build
```

#### 2. Verify Services

```bash
docker-compose ps
docker-compose logs -f
```

#### 3. Health Checks

```bash
# Backend
curl http://localhost:5000/api/v1/health

# Frontend
curl http://localhost
```

### Method 2: GitHub Actions (CI/CD)

#### 1. Configure GitHub Secrets

Go to your repository → Settings → Secrets → Add the following secrets:

**Docker Hub:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

**Environment Variables:**
- `VITE_API_URL`
- `GEMINI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- All other production secrets

**SSH Deployment:**
- `PROD_HOST` - Server IP address
- `PROD_USERNAME` - SSH username
- `PROD_SSH_KEY` - Private SSH key
- `STAGING_HOST`, `STAGING_USERNAME`, `STAGING_SSH_KEY` (for staging)

#### 2. Push to Main Branch

```bash
git push origin main
```

The GitHub Actions workflow will automatically:
- Run tests
- Build Docker images
- Push to Docker Hub
- Deploy to production server
- Run health checks

### Method 3: Manual Deployment Script

```bash
cd /opt/serene-wellbeing
chmod +x scripts/deploy-production.sh
sudo ./scripts/deploy-production.sh
```

## SSL Certificate Setup

### Using Certbot (Free SSL)

```bash
# For main domain
sudo certbot --nginx -d serene-wellbeing.com -d www.serene-wellbeing.com

# For API subdomain
sudo certbot --nginx -d api.serene-wellbeing.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

Create `/etc/nginx/sites-available/serene-wellbeing`:

```nginx
# Backend API
server {
    listen 80;
    listen [::]:80;
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

        # WebSocket support
        proxy_read_timeout 86400;
    }
}

# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name serene-wellbeing.com www.serene-wellbeing.com;

    location / {
        proxy_pass http://localhost;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/serene-wellbeing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend

# Test endpoints
curl https://api.serene-wellbeing.com/api/v1/health
curl https://serene-wellbeing.com
```

### 2. Database Setup

```bash
# Run migrations (if any)
docker-compose exec backend npm run migrate

# Create admin user (optional)
docker-compose exec backend node dist/scripts/create-admin.js
```

### 3. Test Critical Flows

- [ ] User registration
- [ ] User login
- [ ] Expert search
- [ ] Session booking
- [ ] Payment processing
- [ ] Chat functionality
- [ ] Email notifications

### 4. Set Up Monitoring

#### Application Monitoring

```bash
# Check application logs
docker-compose logs -f --tail=100

# Monitor resource usage
docker stats
```

#### Set Up Error Tracking (Sentry)

1. Create Sentry account
2. Add Sentry DSN to environment variables
3. Restart services

#### Set Up Uptime Monitoring

Recommended services:
- UptimeRobot
- Pingdom
- StatusCake

### 5. Configure Backups

#### Database Backup Script

Create `/opt/scripts/backup-mongodb.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose exec -T mongodb mongodump \
  --uri="mongodb://admin:password@localhost:27017" \
  --out=/tmp/backup

docker cp serene-mongodb:/tmp/backup $BACKUP_DIR/backup_$TIMESTAMP

# Keep only last 7 backups
ls -t $BACKUP_DIR | tail -n +8 | xargs -r rm -rf

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP"
```

Add to crontab:

```bash
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/scripts/backup-mongodb.sh
```

## Monitoring and Maintenance

### Log Management

```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Export logs
docker-compose logs > logs_$(date +%Y%m%d).txt
```

### Performance Monitoring

```bash
# Container resource usage
docker stats

# Disk usage
df -h
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

### Updates and Patches

```bash
# Pull latest code
cd /opt/serene-wellbeing
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or use the deployment script
sudo ./scripts/deploy-production.sh
```

## Troubleshooting

### Services Not Starting

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec backend node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### High Memory Usage

```bash
# Check memory usage
free -h
docker stats

# Restart services to clear memory
docker-compose restart backend
```

### SSL Certificate Issues

```bash
# Renew certificates
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

## Rollback Procedure

If deployment fails:

```bash
# Stop current deployment
docker-compose down

# Restore from backup
cd /opt/backups/serene-wellbeing
tar -xzf backup_TIMESTAMP.tar.gz -C /opt/serene-wellbeing

# Restart previous version
cd /opt/serene-wellbeing
docker-compose up -d
```

## Security Checklist

- [ ] All environment variables are secure
- [ ] SSL certificates are installed and valid
- [ ] Firewall is configured correctly
- [ ] Database has authentication enabled
- [ ] JWT secrets are strong and unique
- [ ] Rate limiting is enabled
- [ ] CORS is configured correctly
- [ ] Helmet security headers are enabled
- [ ] File upload restrictions are in place
- [ ] Logs don't contain sensitive data

## Support

For issues or questions:
- Email: support@serene-wellbeing.com
- Documentation: https://docs.serene-wellbeing.com
- GitHub Issues: https://github.com/yourrepo/serene-wellbeing/issues
