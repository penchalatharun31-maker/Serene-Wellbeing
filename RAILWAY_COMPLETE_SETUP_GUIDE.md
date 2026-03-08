# Railway Deployment - Complete Setup Guide

## 🎯 Overview

This guide provides a **comprehensive, step-by-step** approach to deploying the Serene Wellbeing Hub backend to Railway. Follow these instructions carefully to avoid common pitfalls.

---

## 📋 Prerequisites

### 1. Required Accounts & Services

- ✅ Railway account ([railway.app](https://railway.app))
- ✅ MongoDB Atlas account (free tier: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- ✅ Google Gemini API key ([aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
- ✅ GitHub repository access

### 2. Required Tools

```bash
# Install Railway CLI
npm install -g @railway/cli

# Or using Homebrew (macOS/Linux)
brew install railway

# Verify installation
railway --version
```

### 3. Required Information

Have these ready before starting:
- MongoDB connection string
- Google Gemini API key
- Strong random secrets for JWT (we'll generate these)

---

## 🚀 Deployment Methods

Railway offers **two deployment approaches**. Choose the one that works best for you:

### **Method A: GitHub Integration (Recommended)**
✅ Automatic deployments on git push
✅ Easy rollbacks
✅ Built-in CI/CD

### **Method B: Railway CLI**
✅ Direct deployment from local machine
✅ Faster for testing
✅ More control over deployment

---

## 📦 Method A: GitHub Integration (Recommended)

### Step 1: Prepare Your Repository

Ensure you're on the correct branch and all changes are committed:

```bash
git status
git add .
git commit -m "Prepare for Railway deployment"
git push origin claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT
```

### Step 2: Create Railway Project

1. **Login to Railway**: Go to [railway.app](https://railway.app)
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**: Select "Deploy from GitHub repo"
4. **Select Repository**: Choose `penchalatharun31-maker/Serene-Wellbeing`
5. **Configure Service**:
   - **Service Name**: `backend`
   - **Root Directory**: `/backend`
   - **Branch**: `claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT` (or `main`)

### Step 3: Configure Build Settings

Railway should automatically detect the Dockerfile. Verify:

1. Go to **Service Settings** → **Build**
2. Ensure:
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `Dockerfile`
   - **Build Command**: (leave empty, Docker handles it)

### Step 4: Add Redis (Optional but Recommended)

1. In your Railway project, click **"New"** → **"Database"** → **"Add Redis"**
2. Railway will automatically add `REDIS_URL` to your environment variables
3. Copy the `REDIS_URL` value from the Redis service variables

### Step 5: Set Environment Variables

Go to **backend service** → **Variables** and add the following:

#### **Required Variables**

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# Redis (if added via Railway addon, this is auto-populated)
REDIS_URL=redis://default:password@redis.railway.app:6379

# JWT Secrets (generate with: openssl rand -base64 64)
JWT_SECRET=<paste-generated-secret-here>
JWT_REFRESH_SECRET=<paste-another-generated-secret-here>
SESSION_SECRET=<paste-session-secret-here>

# AI Service
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-2.0-flash-exp

# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Frontend URL (update after frontend is deployed)
FRONTEND_URL=https://your-frontend.up.railway.app
```

#### **Optional Variables**

```bash
# Payment Gateway - Razorpay (use test keys initially)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_test_secret

# Payment Gateway - Stripe (use test keys initially)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Serene Wellbeing <noreply@serene-wellbeing.com>

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://YOUR-BACKEND-URL.up.railway.app/api/v1/auth/google/callback

# Business Config
PLATFORM_COMMISSION_RATE=0.20
BCRYPT_ROUNDS=12
LOG_LEVEL=info
APP_NAME=Serene Wellbeing Hub
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@serene-wellbeing.com
```

### Step 6: Generate JWT Secrets

On your local machine or in a terminal, run:

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate JWT_REFRESH_SECRET
openssl rand -base64 64

# Generate SESSION_SECRET
openssl rand -base64 64
```

Copy each output and paste into Railway environment variables.

### Step 7: Deploy

1. **Trigger Deployment**: Railway will automatically deploy after you set environment variables
2. **Monitor Logs**: Go to **Deployments** → **View Logs**
3. **Wait for Success**: Look for: `✅ Deployment successful`

### Step 8: Get Your Backend URL

1. Go to **Settings** → **Networking** → **Public Networking**
2. Railway will generate a URL like: `backend-production-xxxx.up.railway.app`
3. Copy this URL - you'll need it for frontend configuration

### Step 9: Test Backend Health

```bash
curl https://YOUR-BACKEND-URL.up.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-08T10:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## 🖥️ Method B: Railway CLI Deployment

### Step 1: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

### Step 2: Initialize Project

Navigate to the **backend** directory:

```bash
cd backend
```

Link to existing project or create new:

```bash
# Option 1: Link to existing project
railway link

# Option 2: Create new project
railway init
```

### Step 3: Set Environment Variables

You can set variables via CLI:

```bash
# Set individual variables
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="$(openssl rand -base64 64)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -base64 64)"
railway variables set SESSION_SECRET="$(openssl rand -base64 64)"
railway variables set GEMINI_API_KEY="your-gemini-key"
railway variables set GEMINI_MODEL="gemini-2.0-flash-exp"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
railway variables set API_VERSION="v1"

# Add Redis
railway add redis
# Copy REDIS_URL from dashboard and set it
railway variables set REDIS_URL="redis://default:password@redis.railway.app:6379"

# Set frontend URL (update after frontend deployment)
railway variables set FRONTEND_URL="https://your-frontend.up.railway.app"
```

Or use the interactive mode:

```bash
railway variables
```

### Step 4: Deploy

```bash
railway up
```

This will:
1. Build the Docker image
2. Push to Railway
3. Deploy the service

### Step 5: Monitor Deployment

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open
```

---

## 🔧 Troubleshooting

### Issue 1: "Build failed - Cannot find Dockerfile"

**Solution:**
1. Verify `railway.json` exists in `/backend` directory
2. Check `dockerfilePath` is set to `Dockerfile` (not `backend/Dockerfile`)
3. Ensure **Root Directory** in Railway is set to `/backend`

### Issue 2: "Health check failed"

**Solution:**
1. Check backend logs: `railway logs`
2. Verify all required environment variables are set
3. Ensure MongoDB URI is correct and accessible
4. Check Redis connection (if using)

### Issue 3: "Cannot connect to MongoDB"

**Solution:**
1. Verify MongoDB Atlas network access allows `0.0.0.0/0` (or Railway IPs)
2. Check MongoDB URI format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
3. Ensure username and password are URL-encoded if they contain special characters

### Issue 4: "Redis connection refused"

**Solution:**
1. If using Railway Redis addon, ensure it's added: `railway add redis`
2. Verify `REDIS_URL` environment variable is set
3. Check Redis is running in Railway dashboard

### Issue 5: "Port already in use"

**Solution:**
- Railway automatically assigns the `PORT` variable - don't hardcode port 5000
- Ensure your backend code uses `process.env.PORT || 5000`

### Issue 6: "Environment variables not loading"

**Solution:**
1. Verify variables are set in Railway dashboard
2. For Railway CLI: run `railway variables` to see all variables
3. Redeploy after setting variables: `railway up --detach`

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Backend URL is accessible
- [ ] Health endpoint returns 200: `curl https://YOUR-URL.up.railway.app/api/v1/health`
- [ ] MongoDB connection successful (check logs)
- [ ] Redis connection successful (check logs)
- [ ] All required environment variables are set
- [ ] Logs show no errors: `railway logs`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** with real credentials
2. **Use strong JWT secrets** (minimum 64 characters)
3. **Rotate secrets regularly** (every 90 days)
4. **Use test payment keys** initially (Razorpay, Stripe)
5. **Enable MongoDB IP whitelist** or use `0.0.0.0/0` for Railway
6. **Keep dependencies updated**: `npm audit fix`

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Via CLI
railway logs

# Via Dashboard
Railway → Project → Backend Service → Deployments → Logs
```

### Monitor Resources

- **Dashboard**: Railway → Project → Backend Service → Metrics
- Check CPU, Memory, Network usage

### Restart Service

```bash
# Via CLI
railway restart

# Via Dashboard
Railway → Backend Service → Settings → Restart
```

---

## 🚦 Next Steps: Frontend Deployment

Once backend is deployed:

1. Note your backend URL: `https://backend-production-xxxx.up.railway.app`
2. Deploy frontend (see frontend deployment guide)
3. Set frontend environment variable:
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api/v1
   ```
4. Update backend's `FRONTEND_URL` to match your frontend URL
5. Redeploy both services

---

## 📞 Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **MongoDB Atlas Support**: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)

---

## 🎉 Success!

Your backend should now be deployed and accessible at:
```
https://YOUR-BACKEND-URL.up.railway.app
```

Test it:
```bash
curl https://YOUR-BACKEND-URL.up.railway.app/api/v1/health
```

---

**Happy Deploying! 🚀**
