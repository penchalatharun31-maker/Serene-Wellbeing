# Railway Deployment Guide

## The Problem

Your application needs **TWO separate services** on Railway:
1. **Backend API** (Node.js + Express) - Port 5000
2. **Frontend** (React + Nginx) - Port 80

Currently, Railway is only running the frontend (nginx), which is why you see "Application failed to respond".

## Solution: Deploy Two Services

### Step 1: Deploy Backend Service

#### 1.1 Create Backend Service
1. Go to your Railway project dashboard
2. Click **"+ New Service"**
3. Select **"GitHub Repo"**
4. Choose your repository: `Serene-Wellbeing`
5. Name it: **"serene-backend"**

#### 1.2 Configure Backend Build
1. Click on the **serene-backend** service
2. Go to **Settings** tab
3. Set the following:

**Root Directory:**
```
backend
```

**Build Command:**
```
npm ci && npm run build
```

**Start Command:**
```
node dist/server.js
```

**Dockerfile Path:**
```
backend/Dockerfile
```

**Branch:**
```
claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT
```

#### 1.3 Configure Backend Environment Variables
Go to **Variables** tab and add these (minimum required):

```bash
# Node Environment
NODE_ENV=production

# MongoDB Atlas (USE YOUR ATLAS CONNECTION STRING!)
MONGODB_URI=mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiry
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL (Railway will provide this after frontend deployment)
FRONTEND_URL=https://your-frontend-url.railway.app

# Email Settings (Optional - use SendGrid, Mailgun, or SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@serenewellbeing.com
FROM_NAME=Serene Wellbeing Hub

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# API Version
API_VERSION=v1
```

**Important Notes:**
- Railway automatically provides the `PORT` variable - DO NOT set it manually
- Replace `your-gemini-api-key-here` with your actual Google Gemini API key
- Generate a strong random string for `JWT_SECRET`

### Step 2: Deploy Frontend Service

#### 2.1 Create Frontend Service
1. In Railway dashboard, click **"+ New Service"** again
2. Select **"GitHub Repo"**
3. Choose your repository: `Serene-Wellbeing`
4. Name it: **"serene-frontend"**

#### 2.2 Configure Frontend Build
1. Click on the **serene-frontend** service
2. Go to **Settings** tab
3. Set the following:

**Root Directory:**
```
/
```
(Leave empty or use `/` for root)

**Dockerfile Path:**
```
Dockerfile
```

**Branch:**
```
claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT
```

#### 2.3 Configure Frontend Environment Variables
Go to **Variables** tab and add:

```bash
# Backend API URL (get this from backend service after it deploys)
VITE_API_URL=https://your-backend-url.railway.app/api/v1

# Stripe Public Key (for frontend payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**How to get the backend URL:**
1. Go to your **serene-backend** service
2. Click on **Settings** > **Networking**
3. Copy the public domain (e.g., `serene-backend-production.up.railway.app`)
4. Add it as `VITE_API_URL` in frontend variables

### Step 3: Update CORS Configuration

After both services are deployed, update the backend environment variables:

1. Go to **serene-backend** service
2. Update `FRONTEND_URL` with your frontend Railway URL
3. This allows CORS to work properly

### Step 4: Verify Deployment

#### Backend Health Check
Visit: `https://your-backend-url.railway.app/api/v1/health`

You should see:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-23T..."
}
```

#### Frontend Check
Visit: `https://your-frontend-url.railway.app`

You should see your React application.

## Quick Setup Checklist

- [ ] Create backend service on Railway
- [ ] Set backend root directory to `backend`
- [ ] Set backend Dockerfile path to `backend/Dockerfile`
- [ ] Add MongoDB Atlas connection string
- [ ] Add Gemini API key
- [ ] Add JWT secret
- [ ] Deploy backend and get the public URL
- [ ] Create frontend service on Railway
- [ ] Set frontend Dockerfile path to `Dockerfile`
- [ ] Add `VITE_API_URL` pointing to backend
- [ ] Deploy frontend
- [ ] Update backend `FRONTEND_URL` with frontend URL
- [ ] Test both services

## Common Issues & Solutions

### Issue 1: "Application failed to respond"
**Cause:** Missing environment variables or MongoDB connection failure
**Solution:**
- Check deploy logs for specific errors
- Verify all required environment variables are set
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow from anywhere)

### Issue 2: CORS errors
**Cause:** Frontend and backend URLs not matching
**Solution:**
- Update `FRONTEND_URL` in backend with exact frontend Railway URL
- Include protocol: `https://your-frontend.railway.app` (no trailing slash)

### Issue 3: Database connection timeout
**Cause:** MongoDB Atlas not accessible
**Solution:**
- In MongoDB Atlas, go to Network Access
- Add IP: `0.0.0.0/0` (allow from anywhere)
- Or use Railway's static IPs if available

### Issue 4: Build fails with Node version error
**Cause:** Dockerfile Node version mismatch
**Solution:**
- Already fixed! Dockerfiles now use `node:20-alpine`
- Redeploy to apply the fix

## Getting API Keys

### Google Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add to Railway environment variables

### Stripe Keys (for payments)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" and "Secret key"
3. Add both to Railway environment variables

### SendGrid (for emails - optional)
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Create new API key
3. Use with SMTP settings or SendGrid API

## Monitoring

### View Logs
1. Click on service (backend or frontend)
2. Go to **Deployments** tab
3. Click on latest deployment
4. View **Deploy Logs** and **Runtime Logs**

### Check Metrics
1. Click on service
2. Go to **Metrics** tab
3. Monitor CPU, Memory, Network usage

## Cost Optimization

Railway offers:
- **$5 free credit** per month (Hobby plan)
- **$500 free for first month** (trial)

Tips:
- Start with 1 backend + 1 frontend service
- Monitor usage in Railway dashboard
- Upgrade to Pro plan ($20/month) when needed

## Next Steps After Deployment

1. **Seed Pricing Data:**
   ```bash
   # SSH into backend container or run locally
   npm run seed-pricing
   ```

2. **Test All Features:**
   - User registration and login
   - Expert onboarding
   - Session booking
   - AI companion chat
   - Pricing pages

3. **Set Up Custom Domain** (optional):
   - Go to service > Settings > Domains
   - Add your custom domain
   - Configure DNS records

4. **Enable Monitoring:**
   - Set up error tracking (Sentry)
   - Add analytics (Plausible, Google Analytics)
   - Monitor uptime (UptimeRobot)

## Support

If you encounter issues:
1. Check Railway deploy logs first
2. Verify environment variables
3. Test MongoDB Atlas connection
4. Check CORS configuration
5. Review backend health endpoint

---

## Summary

✅ **Branch deployed:** `claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT`
✅ **Node version:** 20 (fixed in Dockerfiles)
✅ **Services needed:** 2 (backend + frontend)
✅ **Database:** MongoDB Atlas
✅ **All fixes applied:** React 19 compatibility, package-lock sync, Node 20

**You're ready to deploy! 🚀**
