# ✅ Deployment Checklist - Serene Wellbeing Hub

**Pre-Deployment & Testing Checklist for Developers**

---

## 📋 Pre-Deployment Setup

### Step 1: Environment Preparation

#### Backend Environment Variables
```bash
cd backend
cp .env.example .env.production
```

Edit `.env.production` and configure:

- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=<your-production-mongodb-url>`
- [ ] `JWT_SECRET=<generate: openssl rand -base64 32>`
- [ ] `JWT_REFRESH_SECRET=<generate: openssl rand -base64 32>`
- [ ] `GEMINI_API_KEY=<your-production-gemini-key>`
- [ ] `RAZORPAY_KEY_ID=<live-key>`
- [ ] `RAZORPAY_KEY_SECRET=<live-secret>`
- [ ] `STRIPE_SECRET_KEY=sk_live_<your-live-key>`
- [ ] `STRIPE_PUBLISHABLE_KEY=pk_live_<your-live-key>`
- [ ] `EMAIL_HOST=smtp.gmail.com` (or your email provider)
- [ ] `EMAIL_USER=<your-email>`
- [ ] `EMAIL_PASSWORD=<app-specific-password>`
- [ ] `FRONTEND_URL=<your-production-frontend-url>`

#### Frontend Environment Variables
```bash
cd frontend
cp .env.example .env.production
```

Edit `.env.production` and configure:

- [ ] `VITE_API_URL=<your-production-backend-url>`
- [ ] `VITE_RAZORPAY_KEY_ID=rzp_live_<your-key>`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_<your-key>`
- [ ] `VITE_APP_NAME=Serene Wellbeing Hub`

---

## 🧪 Testing Phase

### Step 2: Local Testing

#### Backend Tests
```bash
cd backend

# Install dependencies
npm install

# Run all tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# Build check
npm run build
```

**Expected Results:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Build completes successfully

#### Frontend Tests
```bash
cd frontend

# Install dependencies
npm install

# Run unit tests
npm test

# Run linter
npm run lint

# Build check
npm run build
```

**Expected Results:**
- [ ] All unit tests pass
- [ ] No linting errors
- [ ] Build completes successfully
- [ ] No build warnings

### Step 3: Integration Testing

Start both services locally and test:

- [ ] User registration works
- [ ] User login works
- [ ] Expert browsing loads correctly
- [ ] Session booking creates database record
- [ ] Payment flow works (test mode)
- [ ] Email notifications are sent
- [ ] Real-time messaging works
- [ ] AI companion responds correctly
- [ ] File upload works
- [ ] All API endpoints return correct status codes

---

## 🚀 Deployment Phase

### Step 4: Database Setup

#### MongoDB Atlas (Recommended)

1. Create Production Cluster
   - [ ] Go to https://cloud.mongodb.com
   - [ ] Create new project: "Serene Wellbeing Production"
   - [ ] Create cluster (M10+ recommended for production)
   - [ ] Choose region close to your backend server

2. Configure Security
   - [ ] Create database user with strong password
   - [ ] Network Access → Add IP: `0.0.0.0/0` (or specific IPs)
   - [ ] Save connection string to `.env.production`

3. Test Connection
   ```bash
   mongosh "<your-connection-string>"
   ```

### Step 5: Third-Party Services Setup

#### Email Service
- [ ] Gmail: Enable 2FA and create app-specific password
- [ ] OR SendGrid: Create API key
- [ ] OR AWS SES: Configure and verify domain
- [ ] Test email sending

#### Payment Gateways

**Razorpay:**
- [ ] Switch to live mode in dashboard
- [ ] Get live API keys
- [ ] Configure webhook: `https://your-api.com/api/v1/payments/webhook/razorpay`
- [ ] Test a ₹1 transaction

**Stripe:**
- [ ] Switch to live mode
- [ ] Get live API keys
- [ ] Configure webhook: `https://your-api.com/api/v1/payments/webhook/stripe`
- [ ] Add webhook events: `payment_intent.succeeded`, `payment_intent.failed`
- [ ] Test a $0.50 transaction

#### Google Gemini AI
- [ ] Verify API key works
- [ ] Check quota limits
- [ ] Enable billing if needed

---

## 🌐 Deployment Options

### Option A: Railway.app (Easiest)

#### Deploy Backend
```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables (through dashboard)
# Go to dashboard → Variables → Bulk Import
# Paste contents of .env.production

# Deploy
railway up

# Get URL
railway domain
# Save this URL for frontend config
```

**Verification:**
- [ ] Backend URL is accessible
- [ ] Health check works: `curl https://your-backend.railway.app/api/v1/health`
- [ ] Database connects (check logs)

#### Deploy Frontend
```bash
cd frontend

# Update .env.production with backend Railway URL
echo "VITE_API_URL=https://your-backend.railway.app" >> .env.production

# Initialize Railway project
railway init

# Add environment variables

# Deploy
railway up

# Get URL
railway domain
```

**Verification:**
- [ ] Frontend URL is accessible
- [ ] Can register a user
- [ ] Can login
- [ ] Can browse experts

### Option B: Docker on VPS

#### Setup VPS
```bash
# SSH into VPS
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Create directory
sudo mkdir -p /var/www/serene-wellbeing
cd /var/www/serene-wellbeing
```

#### Deploy Application
```bash
# Clone repository
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git .

# Configure environment
cp .env.docker .env
nano .env
# Add all production variables

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**Verification:**
- [ ] All containers running
- [ ] No error logs
- [ ] Can access frontend on VPS IP
- [ ] Can access backend API

#### Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/serene-wellbeing
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }

    # WebSocket for real-time features
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/serene-wellbeing /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**Verification:**
- [ ] Can access site via domain
- [ ] Nginx config is valid
- [ ] No Nginx errors in logs

#### Setup SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

**Verification:**
- [ ] HTTPS works
- [ ] Certificate is valid
- [ ] Auto-renewal is configured

---

## ✅ Post-Deployment Verification

### Step 6: Production Testing

#### Backend API Tests
```bash
# Health check
curl https://your-api.com/api/v1/health

# Register user (use real email)
curl -X POST https://your-api.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@#",
    "role": "user"
  }'

# Login
curl -X POST https://your-api.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Save the token from response
export TOKEN="<your-token>"

# Get current user
curl https://your-api.com/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Get experts
curl https://your-api.com/api/v1/experts
```

**Expected Results:**
- [ ] Health check returns 200 OK
- [ ] Registration works and sends email
- [ ] Login returns JWT token
- [ ] Protected endpoints require auth
- [ ] Public endpoints work without auth

#### Frontend Tests
Visit your production URL and test:

**User Flow:**
- [ ] Homepage loads correctly
- [ ] Sign up page works
- [ ] Email verification received (check spam)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Browse experts page loads
- [ ] Expert profiles load
- [ ] Session booking modal opens
- [ ] Payment modal opens

**Expert Flow:**
- [ ] Expert registration works
- [ ] Profile creation works
- [ ] Availability setting works
- [ ] Expert dashboard loads

**Payment Flow:**
- [ ] Can initiate payment
- [ ] Razorpay/Stripe modal opens
- [ ] Test payment succeeds (use test cards)
- [ ] Payment confirmation received
- [ ] Receipt email sent

**Real-time Features:**
- [ ] Messaging works
- [ ] Notifications appear
- [ ] Online status updates

**AI Features:**
- [ ] AI companion responds
- [ ] Responses are relevant
- [ ] Conversation history saves

#### Performance Tests
- [ ] Homepage loads in < 3 seconds
- [ ] API responses in < 500ms
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive works

---

## 🔍 Monitoring Setup

### Step 7: Production Monitoring

#### Application Logs

**Railway:**
- [ ] Enable log persistence in dashboard
- [ ] Set up log drains (optional)

**Docker/VPS:**
```bash
# View logs
docker-compose logs -f

# Or for PM2
pm2 logs serene-backend
```

#### Health Monitoring

Setup monitoring for:
- [ ] Backend `/api/v1/health` endpoint (every 5 min)
- [ ] Frontend homepage (every 5 min)
- [ ] Database connectivity
- [ ] Disk space (if VPS)
- [ ] Memory usage (if VPS)

**Recommended Tools:**
- UptimeRobot (free)
- Pingdom
- Better Uptime
- Railway built-in monitoring

#### Error Tracking

Consider setting up:
- [ ] Sentry for error tracking
- [ ] LogRocket for session replay
- [ ] Google Analytics for usage

---

## 🔒 Security Checklist

### Step 8: Security Hardening

- [ ] All secrets are in environment variables (not code)
- [ ] JWT secrets are strong (32+ characters)
- [ ] CORS is configured to allow only your frontend domain
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Database has authentication enabled
- [ ] Database network access is restricted
- [ ] File upload size limits are set
- [ ] Input validation is enabled on all endpoints
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection headers enabled
- [ ] No sensitive data in logs
- [ ] Production dependencies only (no dev dependencies)

**Verify Security:**
```bash
# Check for security vulnerabilities
npm audit

# Fix if any found
npm audit fix
```

---

## 📊 Performance Optimization

### Step 9: Optimization

#### Backend
- [ ] Gzip compression enabled
- [ ] Database indexes created
- [ ] Response caching configured
- [ ] Image optimization for uploads
- [ ] Unnecessary logs disabled in production

#### Frontend
- [ ] Bundle size optimized
- [ ] Images lazy loaded
- [ ] Code splitting enabled
- [ ] PWA caching configured
- [ ] Analytics scripts async loaded

---

## 📝 Documentation

### Step 10: Update Documentation

- [ ] Update README.md with production URLs
- [ ] Document any configuration changes
- [ ] Update API documentation if changed
- [ ] Create runbook for common issues
- [ ] Document backup procedures

---

## 🔄 Backup Strategy

### Step 11: Setup Backups

#### Database Backups
**MongoDB Atlas:**
- [ ] Continuous backups enabled (enabled by default)
- [ ] Point-in-time recovery available
- [ ] Test restore procedure

**Self-hosted MongoDB:**
```bash
# Create backup script
mongodump --uri="<your-mongodb-uri>" --out=/backup/$(date +%Y%m%d)

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

#### Application Backups
- [ ] Git repository is up to date
- [ ] Environment files backed up securely
- [ ] SSL certificates backed up

---

## 🚨 Emergency Procedures

### Rollback Plan

**Railway:**
```bash
# Rollback to previous deployment
railway rollback
```

**Docker:**
```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d --build
```

**VPS with PM2:**
```bash
pm2 stop all
git checkout <previous-commit>
cd backend && npm run build
pm2 restart all
```

---

## ✅ Final Checklist

Before going live:

### Technical
- [ ] All tests pass
- [ ] No console errors
- [ ] No build warnings
- [ ] All features work
- [ ] Performance is acceptable
- [ ] Security scan passed
- [ ] Backups configured

### Business
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Payment gateways in live mode
- [ ] Email sending works
- [ ] Support email configured
- [ ] Terms of service page
- [ ] Privacy policy page

### Monitoring
- [ ] Uptime monitoring active
- [ ] Error tracking setup
- [ ] Log aggregation working
- [ ] Alerts configured
- [ ] Analytics tracking

### Documentation
- [ ] README updated
- [ ] API docs current
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created

---

## 🎉 Go Live!

Once all checklist items are complete:

1. **Final smoke test:** Test all critical features
2. **Announce:** Inform stakeholders
3. **Monitor:** Watch logs and metrics for first 24 hours
4. **Be ready:** Have rollback plan ready

---

## 📞 Support Contacts

- **Technical Issues:** <technical-team-email>
- **Deployment Issues:** <devops-team-email>
- **Emergency Contact:** <emergency-contact>

---

**Checklist Version:** 1.0.0
**Last Updated:** February 24, 2026

**Happy Deploying! 🚀**
