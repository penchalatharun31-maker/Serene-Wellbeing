# Railway Deployment Guide - Serene Wellbeing Hub

This guide explains how to deploy both frontend and backend to Railway.

## Architecture

- **Frontend**: React/Vite app built as static files, served via Nginx
- **Backend**: Node.js/Express API with MongoDB and Redis

## Prerequisites

1. Railway account (free tier available)
2. MongoDB Atlas account (or use Railway's MongoDB addon)
3. Redis instance (use Railway's Redis addon)
4. Google Gemini API key
5. Payment gateway keys (Razorpay/Stripe)

---

## Backend Deployment

### Step 1: Create Backend Service

1. Go to Railway Dashboard → New Project → Deploy from GitHub
2. Select the `Serene-Wellbeing` repository
3. Choose "Backend" as the service name
4. Set Root Directory to `/backend`

### Step 2: Configure Backend Environment Variables

In Railway Dashboard → Backend Service → Variables, add:

```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# Redis (use Railway Redis addon or external Redis)
REDIS_URL=redis://default:password@redis-host.railway.app:6379

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=<your-generated-secret-min-32-chars>
JWT_REFRESH_SECRET=<your-generated-refresh-secret-min-32-chars>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google Gemini AI
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-2.0-flash-exp

# Payment Gateway - Razorpay (India)
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>

# Payment Gateway - Stripe (International) - Optional
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
STRIPE_API_VERSION=2023-10-16

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-app-specific-password>
EMAIL_FROM=Serene Wellbeing <noreply@serenewellbeing.com>

# Frontend URL (will be set after frontend deployment)
FRONTEND_URL=https://your-frontend.up.railway.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Business Configuration
PLATFORM_COMMISSION_RATE=0.20
EXPERT_PAYOUT_DAY=1
NOTIFICATION_REMINDER_HOURS=24

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security
BCRYPT_ROUNDS=12
HELMET_CSP_ENABLED=false

# Application
APP_NAME=Serene Wellbeing Hub
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@serenewellbeing.com
```

### Step 3: Backend Railway.json Configuration

The backend uses:
- File: `backend/railway.json`
- Builder: NIXPACKS
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Healthcheck: `/api/v1/health`

---

## Frontend Deployment

### Step 1: Create Frontend Service

1. Go to Railway Dashboard → Same Project → New Service → Deploy from GitHub
2. Select the `Serene-Wellbeing` repository
3. Choose "Frontend" as the service name
4. Root Directory: `/` (repository root)

### Step 2: Configure Frontend Environment Variables

**CRITICAL**: These variables must be set as **build arguments** because Vite bakes them into the bundle at build time.

In Railway Dashboard → Frontend Service → Variables, add:

```env
# API Configuration
# IMPORTANT: Replace with your actual Railway backend URL after backend is deployed
# Example: https://serene-backend-production.up.railway.app/api/v1
VITE_API_URL=https://YOUR-BACKEND-SERVICE.up.railway.app/api/v1

# Payment Gateway - Razorpay (India)
VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>

# Payment Gateway - Stripe (International) - Optional
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_TAG_MANAGER_ID=

# Error Tracking (Optional)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# Application Info
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serenewellbeing.com

# Debug Mode (OFF in production)
VITE_DEBUG=false
```

### Step 3: Frontend Railway.json Configuration

The frontend uses:
- File: `railway.json`
- Builder: DOCKERFILE
- Dockerfile: `Dockerfile`
- Healthcheck: `/`
- Port: 80 (Nginx)

### Step 4: Get Backend URL

After backend deploys successfully:

1. Go to Backend Service → Settings → Domains
2. Copy the generated domain (e.g., `serene-backend-production.up.railway.app`)
3. Add `/api/v1` to the end
4. Update Frontend's `VITE_API_URL` variable to: `https://serene-backend-production.up.railway.app/api/v1`
5. Also update Backend's `FRONTEND_URL` variable to your frontend domain (without /api/v1)
6. Redeploy both services for changes to take effect

---

## Post-Deployment Steps

### 1. Test Backend Health

```bash
curl https://your-backend.up.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123,
  "environment": "production"
}
```

### 2. Test Frontend

Visit: `https://your-frontend.up.railway.app`

### 3. Test Full Flow

1. Go to frontend URL
2. Click "Sign Up"
3. Try Google OAuth login
4. Should redirect properly and create account

### 4. Monitor Logs

- Backend: Railway Dashboard → Backend Service → Logs
- Frontend: Railway Dashboard → Frontend Service → Logs

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" errors in frontend

**Cause**: VITE_API_URL not set correctly or CORS issue

**Solution**:
1. Check `VITE_API_URL` includes `/api/v1` at the end
2. Verify backend `FRONTEND_URL` matches your frontend domain
3. Check backend CORS configuration in `backend/src/server.ts`

### Issue 2: Backend healthcheck failing

**Cause**: Backend not starting or healthcheck endpoint not responding

**Solution**:
1. Check backend logs for startup errors
2. Verify all required environment variables are set
3. Ensure MongoDB and Redis URLs are correct

### Issue 3: Google OAuth redirect not working

**Cause**: Incorrect redirect URIs in Google Cloud Console

**Solution**:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Add authorized redirect URI: `https://your-backend.up.railway.app/api/v1/auth/google/callback`
3. Add authorized origin: `https://your-frontend.up.railway.app`

### Issue 4: Payment gateway errors

**Cause**: API keys not set or incorrect

**Solution**:
1. Verify Razorpay/Stripe keys are correct
2. Check webhook secrets match
3. Update webhook URLs in payment provider dashboard

### Issue 5: Frontend shows "localhost" API calls

**Cause**: Frontend built without `VITE_API_URL` environment variable

**Solution**:
1. Vite requires env vars at BUILD time, not runtime
2. Set `VITE_API_URL` in Railway variables
3. Trigger new deployment to rebuild with correct env var

---

## Security Checklist

- [ ] All JWT secrets are strong random strings (32+ chars)
- [ ] Backend API keys (GEMINI, RAZORPAY, STRIPE) are never exposed to frontend
- [ ] CORS is configured to allow only your frontend domain
- [ ] MongoDB uses strong password and network access is restricted
- [ ] Redis requires authentication
- [ ] HTTPS is enabled (automatic with Railway)
- [ ] Rate limiting is enabled
- [ ] Environment variables are set in Railway, not committed to git

---

## Scaling & Performance

### Database Indexing
Ensure MongoDB indexes are created for optimal performance (run this via MongoDB shell or compass):

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Sessions collection
db.sessions.createIndex({ userId: 1, scheduledDate: -1 });
db.sessions.createIndex({ expertId: 1, scheduledDate: -1 });
db.sessions.createIndex({ status: 1 });

// Experts collection
db.experts.createIndex({ userId: 1 }, { unique: true });
db.experts.createIndex({ specializations: 1 });
db.experts.createIndex({ isApproved: 1 });
```

### Railway Autoscaling
- Free tier: 1 instance, 512MB RAM, shared CPU
- Hobby tier: 1 instance, 8GB RAM, shared CPU
- Pro tier: Horizontal autoscaling available

---

## Cost Optimization

**Free Tier Limits:**
- Railway: $5 free credit/month (~500 hours)
- MongoDB Atlas: 512MB free cluster
- Redis: Use Railway's Redis addon (free with limitations)

**Recommendations:**
1. Use MongoDB Atlas free tier for development
2. Optimize cold starts by keeping backend warm with healthcheck pings
3. Enable compression in nginx (already configured in `nginx.conf`)
4. Use CDN for static assets (Cloudflare free tier)

---

## Support

If you encounter issues:
1. Check Railway logs first
2. Verify all environment variables
3. Test backend health endpoint
4. Check browser console for frontend errors
5. Review this guide's troubleshooting section

For Railway-specific issues: https://railway.app/help
