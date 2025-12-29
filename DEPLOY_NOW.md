# 🚀 DEPLOY NOW - Railway Deployment Guide

**Branch to Deploy:** `claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT`

## ✅ Pre-Deployment Checklist

All items below are **READY** and verified:
- ✅ TypeScript builds successfully (backend + frontend)
- ✅ Dockerfiles configured for Railway
- ✅ Environment variable templates ready
- ✅ Railway configuration files created
- ✅ Payment integration (Razorpay) complete
- ✅ All edge cases handled
- ✅ Security middleware configured
- ✅ Health check endpoints ready

---

## 📋 What You Need Before Starting

### 1. **Railway Account**
- If not already: Sign up at https://railway.app
- Connect your GitHub account

### 2. **MongoDB Database** (Already have)
- MongoDB Atlas connection string

### 3. **API Keys** (Get these ready)
- **Razorpay:** https://dashboard.razorpay.com/app/website-app-settings/api-keys
  - RAZORPAY_KEY_ID (starts with `rzp_test_` or `rzp_live_`)
  - RAZORPAY_KEY_SECRET
  - RAZORPAY_WEBHOOK_SECRET

- **Google Gemini AI:** https://aistudio.google.com/app/apikey
  - GEMINI_API_KEY

- **JWT Secrets:** Generate two secure random strings
  ```bash
  # Run these commands to generate:
  openssl rand -base64 32  # For JWT_SECRET
  openssl rand -base64 32  # For JWT_REFRESH_SECRET
  ```

- **Email SMTP** (Optional but recommended)
  - Gmail App Password: https://myaccount.google.com/apppasswords

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Create New Project on Railway**

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Serene-Wellbeing`
5. Select branch: `claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT`
6. Railway will detect the code but **DON'T deploy yet**

---

### **STEP 2: Create Backend Service**

1. In your Railway project, click **"+ New Service"**
2. Select **"GitHub Repo"** → Choose `Serene-Wellbeing`
3. Railway will create a service

**Configure Backend Service:**

1. Click on the service → **Settings**
2. **Root Directory:** Set to `backend`
3. **Build Configuration:**
   - Builder: `Dockerfile`
   - Dockerfile Path: `Dockerfile`
4. **Deploy Configuration:**
   - Start Command: `node dist/server.js`
   - Health Check Path: `/api/v1/health`

**Add Backend Environment Variables:**

Click **Variables** tab and add these:

```bash
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database (YOUR MongoDB Atlas URL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# JWT (Generate these with openssl rand -base64 32)
JWT_SECRET=<your-generated-secret-here>
JWT_REFRESH_SECRET=<your-generated-refresh-secret-here>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Razorpay (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
DEFAULT_CURRENCY=INR
DEFAULT_TIMEZONE=UTC

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp

# Frontend URL (Will update this in STEP 4)
FRONTEND_URL=https://your-frontend-url.railway.app

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Serene Wellbeing <noreply@serenewellbeing.com>

# Business
PLATFORM_COMMISSION_RATE=0.20
EXPERT_PAYOUT_DAY=1

# Logging
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12

# App Info
APP_NAME=Serene Wellbeing Hub
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@serenewellbeing.com
```

5. Click **"Deploy"** - Backend will start building

---

### **STEP 3: Create Frontend Service**

1. Back in your Railway project, click **"+ New Service"** again
2. Select **"GitHub Repo"** → Choose `Serene-Wellbeing` (same repo)
3. Railway will create another service

**Configure Frontend Service:**

1. Click on the service → **Settings**
2. **Root Directory:** Leave empty (root `/`)
3. **Build Configuration:**
   - Builder: `Dockerfile`
   - Dockerfile Path: `Dockerfile`
4. **Deploy Configuration:**
   - Health Check Path: `/`

**Add Frontend Environment Variables:**

Click **Variables** tab and add these:

```bash
# API URL (Use backend service URL from STEP 2)
VITE_API_URL=https://your-backend-service.railway.app/api/v1

# Razorpay (PUBLIC key only)
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id

# Currency & Timezone
VITE_DEFAULT_CURRENCY=INR
VITE_DEFAULT_TIMEZONE=UTC

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=false
VITE_ENABLE_GROUP_SESSIONS=true

# App Info
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serene-wellbeing.com
```

5. Click **"Deploy"** - Frontend will start building

---

### **STEP 4: Get Service URLs and Update CORS**

**After both services deploy:**

1. **Get Backend URL:**
   - Click on Backend service
   - Go to **Settings** → **Domains**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://serene-backend.railway.app`)

2. **Get Frontend URL:**
   - Click on Frontend service
   - Go to **Settings** → **Domains**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://serene-frontend.railway.app`)

3. **Update Backend Environment Variables:**
   - Go to Backend service → **Variables**
   - Update `FRONTEND_URL` with your frontend URL:
     ```
     FRONTEND_URL=https://serene-frontend.railway.app
     ```
   - Backend will auto-redeploy

4. **Update Frontend Environment Variables:**
   - Go to Frontend service → **Variables**
   - Update `VITE_API_URL` with your backend URL:
     ```
     VITE_API_URL=https://serene-backend.railway.app/api/v1
     ```
   - Frontend will auto-redeploy

---

### **STEP 5: Verify Deployment**

1. **Test Backend Health:**
   - Visit: `https://your-backend-url.railway.app/api/v1/health`
   - Should see: `{"success": true, "status": "healthy", ...}`

2. **Test Frontend:**
   - Visit: `https://your-frontend-url.railway.app`
   - Should see the landing page

3. **Test Complete Flow:**
   - Try to sign up a new user
   - Browse experts
   - Test payment flow

---

## 🔧 Common Issues & Fixes

### **Issue 1: Backend Not Starting**
- Check Railway logs for errors
- Verify MONGODB_URI is correct
- Ensure all required environment variables are set

### **Issue 2: CORS Errors**
- Ensure `FRONTEND_URL` in backend matches your frontend domain
- Check backend logs for blocked requests

### **Issue 3: Payment Not Working**
- Verify RAZORPAY_KEY_ID matches between backend and frontend
- Check Razorpay dashboard for test/live mode
- Ensure webhook secret is correct

### **Issue 4: AI Features Not Working**
- Verify GEMINI_API_KEY is valid
- Check API quota in Google AI Studio

---

## 📊 Monitoring Your Deployment

### **Railway Dashboard**

1. **View Logs:**
   - Click on each service
   - Go to **"Deployments"** tab
   - Click latest deployment → View logs

2. **Monitor Resources:**
   - CPU and Memory usage shown in dashboard
   - Railway auto-scales based on usage

3. **Metrics:**
   - Response times
   - Error rates
   - Request volume

---

## 🎯 Post-Deployment Tasks

### **1. Configure Razorpay Webhook**

1. Go to Razorpay Dashboard → **Webhooks**
2. Add new webhook URL:
   ```
   https://your-backend-url.railway.app/api/v1/payments/webhook
   ```
3. Select events:
   - `payment.authorized`
   - `payment.failed`
   - `payment.captured`
   - `refund.created`
4. Copy the webhook secret
5. Update `RAZORPAY_WEBHOOK_SECRET` in Railway backend env vars

### **2. Set Up Custom Domain (Optional)**

**Backend:**
1. Railway service → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add: `api.yourdomain.com`
4. Update DNS with provided CNAME

**Frontend:**
1. Railway service → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add: `yourdomain.com`
4. Update DNS with provided CNAME

### **3. Enable Monitoring**

- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up log aggregation

---

## 🔐 Security Checklist

- ✅ JWT secrets are strong (32+ characters)
- ✅ Razorpay live keys (not test keys)
- ✅ HTTPS enabled (automatic on Railway)
- ✅ Environment variables secured
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ Helmet security headers active

---

## 💰 Estimated Railway Costs

**Starter Plan ($5/month per service):**
- Backend Service: $5/month
- Frontend Service: $5/month
- **Total: $10/month** (includes 500 GB bandwidth)

**For Production (Recommended):**
- Upgrade to Pro plan for better resources
- Estimated: $20-30/month for both services

---

## 🆘 Need Help?

1. **Check Railway Logs:**
   - Most issues show up in deployment logs

2. **Railway Discord:**
   - https://discord.gg/railway

3. **Documentation:**
   - Backend API: `/api/v1/docs` endpoint
   - Railway Docs: https://docs.railway.app

---

## ✅ Deployment Complete!

Once both services show **"Active"** status in Railway:

🎉 **Your Serene Wellbeing marketplace is LIVE!**

**Frontend URL:** https://your-frontend-url.railway.app
**Backend API:** https://your-backend-url.railway.app/api/v1
**Health Check:** https://your-backend-url.railway.app/api/v1/health

---

**Built with ❤️ - Ready to help people with their mental wellbeing!**
