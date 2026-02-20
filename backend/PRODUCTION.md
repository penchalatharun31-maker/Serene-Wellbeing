# Production Deployment Guide

## 🚀 Production Readiness Checklist

This guide covers everything you need to deploy the Serene Wellbeing Backend to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Security Configuration](#security-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Monitoring & Logging](#monitoring--logging)
7. [Scaling & Performance](#scaling--performance)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services

- ✅ **MongoDB Atlas** (or self-hosted MongoDB 7.0+)
- ✅ **Redis** (for session storage and caching)
- ✅ **SMTP Server** (for email notifications)
- ✅ **Google Gemini API Key** (for AI features)
- ✅ **Payment Gateway** (Stripe/Razorpay)
- ✅ **Node.js 18+** and **npm 9+**

### Recommended Services

- 🔹 **Sentry** - Error tracking and monitoring
- 🔹 **DataDog/New Relic** - Application performance monitoring
- 🔹 **CloudFlare** - CDN and DDoS protection
- 🔹 **AWS S3/CloudFlare R2** - File storage (instead of local uploads)

---

## Environment Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/serene-wellbeing.git
cd serene-wellbeing/backend

# Install dependencies
npm ci --only=production

# Build TypeScript
npm run build
```

### 2. Configure Environment Variables

```bash
# Copy production template
cp .env.production .env

# Edit with your production values
nano .env
```

**Critical Variables to Update:**

```bash
# Generate strong secrets (64+ characters)
openssl rand -base64 64  # For JWT_SECRET
openssl rand -base64 64  # For JWT_REFRESH_SECRET
openssl rand -base64 64  # For SESSION_SECRET

# Update in .env
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
SESSION_SECRET=<generated-secret-3>

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing

# Redis
REDIS_URL=redis://default:password@redis-host:6379

# Frontend
FRONTEND_URL=https://your-production-domain.com

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Validate Environment

```bash
# Test environment validation
npm run build
node dist/server.js --validate-only
```

---

## Security Configuration

### 1. SSL/TLS Setup

**Option A: Using Nginx (Recommended)**

```nginx
server {
    listen 443 ssl http2;
    server_name api.serene-wellbeing.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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
    }
}
```

**Option B: Let's Encrypt with Certbot**

```bash
sudo certbot --nginx -d api.serene-wellbeing.com
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (redirects to HTTPS)
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 3. Security Headers

Already configured in `production.config.ts`:
- ✅ Helmet with CSP
- ✅ HSTS
- ✅ Rate limiting
- ✅ CORS restrictions
- ✅ CSRF protection

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M10+ for production)
   - Choose region closest to your server

2. **Configure Access**
   ```bash
   # Add IP whitelist
   0.0.0.0/0  # Or specific IPs for better security

   # Create database user
   Username: serene_admin
   Password: <strong-password>
   Role: readWrite on serene-wellbeing
   ```

3. **Get Connection String**
   ```bash
   mongodb+srv://serene_admin:<password>@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority
   ```

4. **Enable Backups**
   - Enable automated backups
   - Set retention period: 7-30 days

### Redis Setup

**Option A: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy Redis
railway up redis
```

**Option B: Upstash (Serverless)**
- Go to [Upstash](https://upstash.com)
- Create Redis database
- Copy connection URL

**Option C: Self-hosted**
```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set password: requirepass your-strong-password

# Restart
sudo systemctl restart redis
```

---

## Deployment Options

### Option 1: PM2 (Recommended for VPS)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Setup auto-start on reboot
pm2 startup
pm2 save

# Useful commands
pm2 status          # View status
pm2 logs            # View logs
pm2 monit           # Monitor resources
pm2 restart all     # Restart
pm2 reload all      # Zero-downtime reload
pm2 stop all        # Stop
```

### Option 2: Docker

```bash
# Build image
docker build -t serene-backend:latest .

# Run with docker-compose
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f backend

# Scale instances
docker-compose up -d --scale backend=4
```

### Option 3: Cloud Platforms

#### **Render**
1. Connect GitHub repository
2. Select "Node.js" service
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables from `.env.production`

#### **Railway**
```bash
railway login
railway init
railway up
```

#### **AWS ECS/Fargate**
```bash
# Build and push to ECR
docker build -t serene-backend .
docker tag serene-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/serene-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/serene-backend:latest
```

#### **Google Cloud Run**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/serene-backend
gcloud run deploy --image gcr.io/PROJECT-ID/serene-backend --platform managed
```

---

## Monitoring & Logging

### 1. Application Logs

```bash
# PM2 logs
pm2 logs serene-backend --lines 100

# Docker logs
docker-compose logs -f --tail=100 backend

# System logs
journalctl -u serene-backend -f
```

### 2. Health Checks

```bash
# Basic health check
curl https://api.serene-wellbeing.com/api/v1/health

# Detailed health
curl https://api.serene-wellbeing.com/api/v1/health | jq

# Kubernetes probes
curl https://api.serene-wellbeing.com/api/v1/health/live
curl https://api.serene-wellbeing.com/api/v1/health/ready
```

### 3. Monitoring Setup

#### **Sentry (Error Tracking)**

```bash
npm install @sentry/node @sentry/tracing
```

Add to `server.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### **Uptime Monitoring**
- [UptimeRobot](https://uptimerobot.com/) - Free
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

---

## Scaling & Performance

### Horizontal Scaling (Multiple Instances)

**PM2 Cluster Mode:**
```bash
# Automatically use all CPU cores
pm2 start ecosystem.config.js --env production -i max
```

**Docker Swarm:**
```bash
docker service create --replicas 4 --name serene-backend serene-backend:latest
```

**Kubernetes:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: serene-backend
spec:
  replicas: 4
  template:
    spec:
      containers:
      - name: backend
        image: serene-backend:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Performance Optimization

1. **Enable Compression** ✅ Already enabled
2. **Database Indexing**
   ```javascript
   // Add indexes to frequently queried fields
   User.index({ email: 1 });
   Session.index({ userId: 1, status: 1 });
   ```

3. **Caching Strategy**
   - Use Redis for session storage ✅
   - Cache frequently accessed data
   - Implement cache invalidation

4. **CDN for Static Assets**
   - Use CloudFlare, AWS CloudFront, or Vercel Edge

---

## Backup & Recovery

### Database Backups

**MongoDB Atlas (Automated):**
- Backups run automatically
- Point-in-time recovery available
- Download via Atlas UI

**Manual Backup:**
```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing" --out=./backup-$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing" ./backup-20240101
```

### File Backups (Uploads)

```bash
# Backup uploads folder
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Upload to S3
aws s3 cp uploads-backup-*.tar.gz s3://serene-backups/
```

### Disaster Recovery Plan

1. **Regular backups** - Daily automated backups
2. **Offsite storage** - AWS S3, Google Cloud Storage
3. **Test restores** - Monthly restore tests
4. **Documentation** - Keep recovery procedures updated

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
pm2 logs serene-backend --err

# Validate environment
node -e "require('./dist/config/env.validation')"

# Check port availability
netstat -tulpn | grep 5000
```

#### 2. Database Connection Failed

```bash
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing"

# Check firewall rules
# Ensure server IP is whitelisted in MongoDB Atlas
```

#### 3. High Memory Usage

```bash
# Monitor memory
pm2 monit

# Restart with memory limit
pm2 restart serene-backend --max-memory-restart 1G
```

#### 4. Slow Performance

```bash
# Check system resources
htop

# Analyze slow queries
# Enable MongoDB slow query log

# Check rate limiting
# Review rate limit settings
```

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug pm2 restart serene-backend
```

---

## Post-Deployment Checklist

- [ ] SSL/TLS certificate installed and working
- [ ] All environment variables set correctly
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Health checks returning 200 OK
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] Email sending works
- [ ] Payment gateway tested
- [ ] AI features working
- [ ] Socket.IO connections stable
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

## Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor application logs
- Check error rates in Sentry
- Review uptime metrics

**Weekly:**
- Update dependencies (`npm audit`)
- Review database performance
- Check disk space

**Monthly:**
- Security updates
- Backup testing
- Performance review
- Cost optimization

### Emergency Contacts

- **DevOps Lead:** [email]
- **Database Admin:** [email]
- **Security Team:** [email]

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** $(date +%Y-%m-%d)
**Version:** 1.0.0
**Maintained by:** DevOps Team
