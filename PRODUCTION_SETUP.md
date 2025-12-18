# 🚀 Production Setup Guide - Serene Wellbeing Hub

**Complete guide to make this product production-ready and best-in-industry**

---

## ⚡ Quick Start (15 Minutes to Production)

### Step 1: MongoDB Atlas Setup (5 min)

1. **Create MongoDB Atlas Account** (if you don't have one)
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier (M0) - sufficient for MVP

2. **Create Cluster**
   ```
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select your nearest region
   - Cluster Name: serene-wellbeing-prod
   ```

3. **Create Database User**
   ```
   - Database Access → Add New Database User
   - Username: serene-admin
   - Password: [Generate secure password]
   - Database User Privileges: Read and write to any database
   ```

4. **Whitelist IP Addresses**
   ```
   - Network Access → Add IP Address
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's specific IP
   ```

5. **Get Connection String**
   ```
   - Databases → Connect → Drivers
   - Copy connection string:
   mongodb+srv://serene-admin:<password>@serene-wellbeing-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 2: Environment Variables Setup (3 min)

Create `/backend/.env.production`:

```bash
# ========================================
# CRITICAL - PRODUCTION CONFIGURATION
# ========================================

# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# ========================================
# DATABASE - MONGODB ATLAS
# ========================================
MONGODB_URI=mongodb+srv://serene-admin:YOUR_PASSWORD@serene-wellbeing-prod.xxxxx.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# ========================================
# JWT AUTHENTICATION - GENERATE NEW SECRETS!
# ========================================
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=GENERATE_64_CHAR_SECRET_HERE
JWT_REFRESH_SECRET=GENERATE_DIFFERENT_64_CHAR_SECRET_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ========================================
# GOOGLE GEMINI AI
# ========================================
# Get key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...your-actual-key
GEMINI_MODEL=gemini-2.0-flash-exp

# ========================================
# STRIPE PAYMENT
# ========================================
# Get keys from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_...your-live-key
STRIPE_PUBLISHABLE_KEY=pk_live_...your-live-key
STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret
STRIPE_API_VERSION=2023-10-16

# ========================================
# EMAIL CONFIGURATION
# ========================================
# Option 1: Gmail (easiest for MVP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Serene Wellbeing <noreply@serene-wellbeing.com>

# Option 2: SendGrid (recommended for production)
# EMAIL_HOST=smtp.sendgrid.net
# EMAIL_PORT=587
# EMAIL_USER=apikey
# EMAIL_PASSWORD=SG.your-sendgrid-api-key

# ========================================
# FRONTEND CONFIGURATION
# ========================================
FRONTEND_URL=https://your-domain.com
SOCKET_IO_CORS_ORIGIN=https://your-domain.com

# ========================================
# SECURITY & PERFORMANCE
# ========================================
BCRYPT_ROUNDS=12
SESSION_SECRET=GENERATE_64_CHAR_SECRET_HERE
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ========================================
# OPTIONAL BUT RECOMMENDED
# ========================================

# Error Monitoring (Sentry - Free tier available)
# Get DSN from: https://sentry.io/
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production

# File Storage (Use Cloudinary or AWS S3 for production)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Platform Settings
PLATFORM_COMMISSION_RATE=0.20
LOG_LEVEL=info
```

---

### Step 3: Generate Secure Secrets (2 min)

**Run these commands to generate production secrets:**

```bash
# Generate JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT Refresh Secret
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Generate Session Secret
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

**Copy the outputs to your `.env.production` file**

---

### Step 4: Service Configuration (5 min)

#### **Gemini AI API Key**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key to `GEMINI_API_KEY`

#### **Stripe Account**
1. Go to https://dashboard.stripe.com/register
2. Complete verification
3. Go to Developers → API Keys
4. Copy "Secret key" (starts with `sk_live_`)
5. Copy "Publishable key" (starts with `pk_live_`)

#### **Email Setup (Choose One)**

**Option A: Gmail (Quick MVP)**
1. Enable 2FA on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `EMAIL_PASSWORD`

**Option B: SendGrid (Production)**
1. Create account: https://signup.sendgrid.com/
2. Create API Key with "Mail Send" permissions
3. Use API key as `EMAIL_PASSWORD`

---

## 🧪 Testing Checklist (Before Launch)

### **Critical User Flows to Test Manually**

```bash
# 1. User Registration & Login
[ ] Register new user account
[ ] Verify email validation works
[ ] Login with credentials
[ ] Receive JWT tokens
[ ] Access protected routes

# 2. Expert Application
[ ] Register as expert
[ ] Fill expert profile
[ ] Upload certifications
[ ] Admin approves expert
[ ] Expert appears in browse page

# 3. Session Booking
[ ] Browse experts
[ ] Select time slot
[ ] Complete payment (Stripe test mode)
[ ] Receive confirmation email
[ ] Session appears in dashboard

# 4. Messaging
[ ] Send message to expert
[ ] Receive real-time notification (Socket.IO)
[ ] View message history
[ ] Mark messages as read

# 5. AI Companion
[ ] Start conversation
[ ] Receive AI response (Gemini)
[ ] Save conversation history
[ ] Detect crisis keywords

# 6. Blog System
[ ] Create blog post (as admin)
[ ] Publish post
[ ] View post on frontend
[ ] SEO meta tags present
[ ] Social sharing works

# 7. Payment & Refunds
[ ] Process test payment
[ ] Verify Stripe webhook
[ ] Request refund
[ ] Refund processed successfully

# 8. Admin Dashboard
[ ] View all users
[ ] Approve expert applications
[ ] View revenue analytics
[ ] Manage promo codes
[ ] Handle disputes
```

---

## 🔒 Security Hardening

### **Immediate Actions:**

1. **Environment Variables**
   ```bash
   # NEVER commit .env files
   echo ".env*" >> .gitignore
   echo "!.env.example" >> .gitignore
   ```

2. **Rate Limiting Verification**
   - Test with 100+ rapid requests
   - Verify 429 response after limit
   - Check IP-based blocking works

3. **Input Validation**
   - Test SQL injection attempts
   - Test XSS payloads
   - Test file upload exploits
   - Verify sanitization works

4. **Authentication Security**
   - Test expired token handling
   - Test refresh token rotation
   - Verify password hashing (bcrypt)
   - Test brute-force protection

---

## 📊 Monitoring & Error Tracking

### **Sentry Setup (Recommended)**

1. **Create Sentry Account**
   - Go to https://sentry.io/signup/
   - Free tier: 5,000 errors/month

2. **Create Project**
   - Select "Node.js" platform
   - Copy DSN to `SENTRY_DSN`

3. **Verify Error Tracking**
   ```bash
   # Trigger test error
   curl -X POST http://localhost:5000/api/v1/test-error
   # Check Sentry dashboard for error
   ```

---

## 🚀 Deployment Options

### **Option 1: Railway (Easiest - 1 Click Deploy)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

### **Option 2: Render (Free Tier Available)**
1. Connect GitHub repository
2. Create Web Service (backend)
3. Create Static Site (frontend)
4. Add environment variables
5. Deploy

### **Option 3: AWS/DigitalOcean (Full Control)**
- Use provided Dockerfile
- Set up CI/CD pipeline
- Configure load balancer
- Set up auto-scaling

---

## 📈 Performance Optimization

### **Database Indexes**
All critical indexes are already configured in models:
- User: email, role
- Expert: userId, rating
- Session: userId, expertId, date
- BlogPost: slug, category, tags, status

### **Caching Strategy**
```bash
# Add Redis for caching (optional but recommended)
# Free tier: Redis Labs (30MB)
REDIS_URL=redis://...
```

### **CDN for Static Assets**
- Use Cloudflare (free tier)
- Configure for frontend static files
- Enable minification and compression

---

## ✅ Pre-Launch Checklist

```bash
# Configuration
[ ] MongoDB Atlas connected
[ ] All environment variables set
[ ] JWT secrets generated (64+ chars)
[ ] Gemini API key configured
[ ] Stripe keys configured (test mode)
[ ] Email service configured

# Testing
[ ] All 7 critical flows tested manually
[ ] Payment processing verified
[ ] Email notifications working
[ ] Real-time messaging working
[ ] AI responses generating

# Security
[ ] .env files not in git
[ ] Rate limiting tested
[ ] Input validation verified
[ ] HTTPS enabled (production)

# Monitoring
[ ] Sentry error tracking active
[ ] Log files being written
[ ] Health endpoint responding

# Performance
[ ] Database indexes verified
[ ] API response times < 500ms
[ ] Frontend load time < 3s

# Documentation
[ ] API documentation up to date
[ ] Admin user guide created
[ ] Support email configured
```

---

## 🎯 Launch Strategy

### **Beta Launch (Week 1)**
- 10-50 invited users
- Monitor errors closely
- Gather feedback
- Fix critical bugs

### **Public Beta (Week 2-4)**
- Open registration
- Limited marketing
- Continue monitoring
- Optimize based on usage

### **Production Launch (Week 5+)**
- Full marketing push
- Scale infrastructure
- 24/7 monitoring
- Support team ready

---

## 🆘 Support & Troubleshooting

### **Common Issues:**

**MongoDB Connection Fails**
```bash
# Check whitelist: Network Access in Atlas
# Verify credentials in connection string
# Test connection: mongosh "mongodb+srv://..."
```

**Gemini API Errors**
```bash
# Verify API key is active
# Check quota limits
# Review error logs
```

**Email Not Sending**
```bash
# Gmail: Enable "Less secure app access"
# SendGrid: Verify sender email
# Check email service logs
```

**Stripe Webhook Fails**
```bash
# Verify webhook endpoint is public
# Check webhook secret matches
# Test with Stripe CLI: stripe listen
```

---

## 📞 **Need Help?**

- **Documentation:** See API_GUIDE.md
- **Testing:** See MANUAL_TESTING_GUIDE.md
- **Issues:** Check backend logs in `./logs/`
- **Support:** Create GitHub issue with error logs

---

**Status:** ✅ **Following this guide makes your product production-ready in 30 minutes**

**Next Steps:** Run the testing checklist → Fix any bugs → Deploy → Monitor → Scale

---

*Last Updated: December 2025*
*Version: 1.0.0*
