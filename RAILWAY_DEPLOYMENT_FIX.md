# Railway Deployment Fix Guide

## Current Issues

### Backend
- ❌ Cannot deploy at all
- **Root Cause**: Using NIXPACKS instead of Dockerfile
- **URL**: serene-wellbeing-production-d8f0.up.railway.app

### Frontend
- ⚠️ Deployed but showing 18 runtime errors
- **Root Cause**: Missing VITE_API_URL environment variable
- **URL**: https://mellow-solace-production.up.railway.app

---

## 🔧 Backend Deployment Fix

### Step 1: Update Railway Configuration

The backend `railway.json` has been updated to use Docker instead of NIXPACKS.

**Changes Made:**
- ✅ Updated `backend/railway.json` to use Dockerfile builder
- ✅ Updated `backend/Dockerfile` to use Node.js 20 (matching package.json requirements)
- ✅ Health check configured at `/api/v1/health`

### Step 2: Configure Environment Variables in Railway

Go to your backend service in Railway and add these **REQUIRED** environment variables:

```bash
# ===== DATABASE =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# ===== REDIS (REQUIRED) =====
# Railway Redis: redis://default:<password>@<host>.railway.app:<port>
REDIS_URL=redis://default:password@redis-host:6379

# ===== AUTHENTICATION =====
# Generate using: openssl rand -base64 64
JWT_SECRET=your-strong-random-64-character-secret
JWT_REFRESH_SECRET=your-different-strong-random-64-character-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=your-strong-session-secret

# ===== AI SERVICE =====
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash-exp

# ===== FRONTEND URL =====
FRONTEND_URL=https://mellow-solace-production.up.railway.app

# ===== SERVER =====
NODE_ENV=production
PORT=5000
API_VERSION=v1

# ===== PAYMENT GATEWAYS (Optional - can add test keys first) =====
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# ===== EMAIL (Optional) =====
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Serene Wellbeing <noreply@serene-wellbeing.com>

# ===== GOOGLE OAUTH (Optional) =====
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/auth/google/callback

# ===== OTHER =====
PLATFORM_COMMISSION_RATE=0.20
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

### Step 3: Deploy Backend

1. Push the updated configuration:
   ```bash
   git add backend/railway.json backend/Dockerfile
   git commit -m "Fix: Update backend Railway config to use Dockerfile"
   git push
   ```

2. In Railway dashboard:
   - Go to your backend service
   - Click "Settings" → "Build"
   - Verify it's using Dockerfile (should be automatic now)
   - Trigger a new deployment

3. Wait for deployment and check health:
   ```bash
   curl https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/health
   ```

---

## 🎨 Frontend Deployment Fix

### Step 1: Configure Environment Variables in Railway

The frontend errors are caused by missing `VITE_API_URL`. In Railway frontend service, add these environment variables:

```bash
# ===== CRITICAL: Backend API URL =====
VITE_API_URL=https://serene-wellbeing-production-d8f0.up.railway.app/api/v1

# ===== PAYMENT KEYS (use test keys initially) =====
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# ===== APPLICATION INFO =====
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serenewellbeing.com

# ===== FEATURE FLAGS =====
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# ===== DEBUG =====
VITE_DEBUG=false
```

### Step 2: Redeploy Frontend

1. In Railway dashboard:
   - Go to your frontend service
   - Click "Settings" → "Variables"
   - Add all the environment variables above
   - **IMPORTANT**: Make sure `VITE_API_URL` points to your backend URL

2. Trigger a new deployment (Railway will rebuild with new env vars)

3. Test the frontend:
   - Open: https://mellow-solace-production.up.railway.app
   - Check browser console (should have no API connection errors)

---

## ✅ Verification Checklist

### Backend
- [ ] Backend deploys successfully
- [ ] Health check returns 200: `curl https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/health`
- [ ] Logs show "Server running on port 5000"
- [ ] MongoDB connection successful
- [ ] Redis connection successful

### Frontend
- [ ] Frontend builds successfully
- [ ] No console errors about missing VITE_API_URL
- [ ] Can load the homepage
- [ ] Can navigate to different pages
- [ ] API calls work (check Network tab)

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend still won't deploy
**Solution**:
- Check Railway logs for specific error
- Verify all REQUIRED env vars are set (MongoDB, Redis, JWT secrets)
- Make sure Dockerfile is being used (not NIXPACKS)

### Issue 2: Frontend shows API connection errors
**Solution**:
- Verify `VITE_API_URL` is set correctly in Railway
- Make sure backend is deployed and healthy first
- Check if backend URL is accessible: `curl https://your-backend-url/api/v1/health`
- Remember: VITE_ variables are baked at build time, so you need to redeploy after changing them

### Issue 3: CORS errors
**Solution**:
- Make sure `FRONTEND_URL` in backend matches your frontend Railway URL
- Backend should show: `Frontend URL: https://mellow-solace-production.up.railway.app`

### Issue 4: Database connection failed
**Solution**:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB connection string is correct
- Make sure username/password are properly encoded

### Issue 5: Redis connection failed
**Solution**:
- Add Redis service in Railway
- Copy the Redis URL from Railway Redis service
- Add it to backend environment variables as `REDIS_URL`

---

## 📝 Deployment Order

**IMPORTANT**: Always deploy in this order:

1. **Deploy Backend First**
   - Ensure it's healthy and accessible
   - Note the backend URL

2. **Update Frontend Environment Variables**
   - Set `VITE_API_URL` to backend URL

3. **Deploy Frontend**
   - Frontend will build with correct API URL

---

## 🔐 Security Reminders

- ✅ Use strong, randomly generated secrets (min 64 characters)
- ✅ Never commit `.env.production` with real credentials
- ✅ Use test payment keys initially
- ✅ Enable MongoDB IP whitelist (or use 0.0.0.0/0 for Railway)
- ✅ Rotate secrets regularly
- ✅ Keep dependencies updated

---

## 📞 Need Help?

If you're still having issues:

1. **Check Railway Logs**:
   - Backend: Railway Dashboard → Backend Service → Logs
   - Frontend: Railway Dashboard → Frontend Service → Logs

2. **Test Health Endpoint**:
   ```bash
   curl -v https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/health
   ```

3. **Check Browser Console**:
   - Open DevTools → Console
   - Look for specific error messages

---

## 🚀 Quick Start Commands

```bash
# 1. Commit the fixes
git add .
git commit -m "Fix: Update Railway deployment configuration for backend and frontend"
git push origin claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT

# 2. Test backend health (after Railway deployment)
curl https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/health

# 3. Check frontend
open https://mellow-solace-production.up.railway.app
```

---

## Summary

**Backend**: Changed from NIXPACKS to Dockerfile, updated Node version, added proper health checks

**Frontend**: Need to add `VITE_API_URL` environment variable in Railway dashboard pointing to backend URL

**Critical**: Set all environment variables in Railway dashboard before deploying!
