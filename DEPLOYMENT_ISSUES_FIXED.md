# Railway Deployment Issues - Comprehensive Fix

## 🎯 Current Status

**Last Updated:** March 8, 2026

### Deployment Issues Identified & Fixed

#### ✅ Issue 1: Server Configuration
**Problem:** Server needs to bind to `0.0.0.0` for Railway to access health checks.

**Status:** ✅ Already fixed - `backend/src/server.ts` line 251 correctly uses `HOST = '0.0.0.0'`

#### ✅ Issue 2: Health Check Configuration
**Backend:**
- ✅ Health check path: `/api/v1/health`
- ✅ Timeout: 300 seconds
- ✅ Restart policy: ON_FAILURE with 10 retries

**Frontend:**
- ✅ Health check path: `/health` (configured in nginx.conf)
- ✅ Nginx serves health endpoint correctly

---

## 🚀 Step-by-Step Deployment Instructions

### Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Railway account ([railway.app](https://railway.app))
- [ ] MongoDB Atlas cluster ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- [ ] Google Gemini API key ([aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
- [ ] Code pushed to GitHub branch

---

## 📦 Part 1: Backend Deployment

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `penchalatharun31-maker/Serene-Wellbeing`
5. Configure:
   - **Service Name:** `backend`
   - **Root Directory:** `/backend`
   - **Branch:** `claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT` (or `main`)

### Step 2: Add Redis Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Add Redis"**
3. Railway will auto-generate `REDIS_URL` - copy it for later

### Step 3: Generate JWT Secrets

On your local machine, run these commands:

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate JWT_REFRESH_SECRET
openssl rand -base64 64

# Generate SESSION_SECRET
openssl rand -base64 64
```

Copy each output - you'll need them for environment variables.

### Step 4: Configure Backend Environment Variables

In Railway Dashboard → Backend Service → Variables, add:

#### **Critical Variables (Required):**

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# Redis (auto-populated if you added Railway Redis addon)
REDIS_URL=redis://default:password@redis.railway.app:6379

# JWT & Session (use generated secrets from Step 3)
JWT_SECRET=<paste-your-64-char-secret>
JWT_REFRESH_SECRET=<paste-your-different-64-char-secret>
SESSION_SECRET=<paste-your-session-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Service
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-2.0-flash-exp

# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Frontend URL (update after frontend is deployed)
FRONTEND_URL=https://your-frontend-url.up.railway.app

# Business Configuration
PLATFORM_COMMISSION_RATE=0.20
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

#### **Optional Variables (Payment Gateways):**

Start with test keys:

```bash
# Razorpay (India)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_test_secret

# Stripe (International)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
```

#### **Optional Variables (Email):**

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833):

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Serene Wellbeing <noreply@serene-wellbeing.com>
```

#### **Optional Variables (Google OAuth):**

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://YOUR-BACKEND-URL.up.railway.app/api/v1/auth/google/callback
```

### Step 5: Deploy Backend

1. Railway will automatically deploy after you set environment variables
2. Monitor deployment: Railway Dashboard → Backend Service → Deployments → Logs
3. Wait for: `✅ Deployment successful`

### Step 6: Get Backend URL & Test

1. Go to: Settings → Networking → Public Networking
2. Copy your backend URL: `https://backend-production-xxxx.up.railway.app`
3. Test health endpoint:

```bash
curl https://YOUR-BACKEND-URL.up.railway.app/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-08T10:00:00.000Z",
  "uptime": 123.45,
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## 🎨 Part 2: Frontend Deployment

### Step 1: Create Frontend Service

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select the same repository: `Serene-Wellbeing`
3. Configure:
   - **Service Name:** `frontend`
   - **Root Directory:** `/` (root, not `/frontend`)
   - **Branch:** Same as backend

### Step 2: Configure Frontend Environment Variables

**CRITICAL:** Vite environment variables are baked into the build at compile time. You MUST set these before deployment.

In Railway Dashboard → Frontend Service → Variables:

```bash
# Backend API URL (use your backend URL from Part 1, Step 6)
VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api/v1

# Payment Gateway Keys (use test keys initially)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Application Info
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serenewellbeing.com

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# Debug (set to false for production)
VITE_DEBUG=false
```

### Step 3: Deploy Frontend

1. Railway will automatically build and deploy
2. Monitor: Railway Dashboard → Frontend Service → Deployments → Logs
3. Frontend build should complete in ~5-10 minutes

### Step 4: Get Frontend URL & Test

1. Go to: Settings → Networking → Public Networking
2. Copy your frontend URL: `https://frontend-production-xxxx.up.railway.app`
3. Open in browser and verify:
   - [ ] Homepage loads without errors
   - [ ] No console errors (press F12)
   - [ ] Can navigate between pages
   - [ ] API calls work (check Network tab)

### Step 5: Update Backend FRONTEND_URL

**IMPORTANT:** Go back to backend environment variables and update:

```bash
FRONTEND_URL=https://YOUR-FRONTEND-URL.up.railway.app
```

This fixes CORS and ensures backend knows where frontend is hosted.

Railway will automatically redeploy backend with new FRONTEND_URL.

---

## ✅ Verification Checklist

### Backend Health Checks

```bash
# Test backend health
curl https://YOUR-BACKEND-URL.up.railway.app/api/v1/health

# Should return 200 OK with:
# {"status":"healthy","services":{"database":"connected","redis":"connected"}}
```

### Frontend Health Checks

```bash
# Test frontend health
curl https://YOUR-FRONTEND-URL.up.railway.app/health

# Should return 200 OK with: "healthy"
```

### Integration Tests

1. Open frontend in browser
2. Press F12 → Console tab
3. Check for errors:
   - ✅ No "Failed to fetch" errors
   - ✅ No "CORS" errors
   - ✅ No "VITE_API_URL is undefined" errors

4. Test user flow:
   - [ ] Sign up / Login works
   - [ ] Navigation works
   - [ ] API calls succeed (check Network tab)

---

## 🐛 Common Issues & Solutions

### Issue: "Backend health check failed"

**Symptoms:**
- Railway shows "Health check timeout"
- Backend keeps restarting

**Solutions:**

1. **Check environment variables:**
   ```bash
   railway variables list
   ```
   Ensure all REQUIRED variables are set (see Part 1, Step 4)

2. **Check MongoDB connection:**
   - Verify MongoDB Atlas allows connections from `0.0.0.0/0`
   - Network Access → Add IP Address → Allow Access from Anywhere

3. **Check Redis connection:**
   - Ensure Railway Redis addon is added
   - Verify `REDIS_URL` is set correctly

4. **Check logs:**
   ```bash
   railway logs --service backend
   ```
   Look for specific error messages

### Issue: "Frontend shows API connection errors"

**Symptoms:**
- Console error: "Failed to fetch"
- Console error: "VITE_API_URL is not defined"

**Solutions:**

1. **Verify VITE_API_URL is set:**
   - Railway Dashboard → Frontend → Variables
   - Must be set BEFORE build (not after)

2. **Redeploy frontend:**
   - After setting VITE_API_URL, trigger new deployment
   - Railway → Frontend → Deployments → "Redeploy"

3. **Check backend CORS:**
   - Ensure `FRONTEND_URL` in backend matches your frontend URL
   - Check backend logs for CORS errors

### Issue: "CORS errors in browser console"

**Symptoms:**
- Console error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution:**

1. Update backend `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://YOUR-EXACT-FRONTEND-URL.up.railway.app
   ```

2. Ensure no trailing slashes in URLs

3. Redeploy backend after updating

### Issue: "MongoDB connection refused"

**Symptoms:**
- Backend logs: "MongooseError: failed to connect"

**Solutions:**

1. **Check MongoDB Atlas Network Access:**
   - MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)

2. **Verify connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
   - Ensure username and password are correct
   - URL-encode special characters in password

3. **Test connection locally:**
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
   ```

### Issue: "Redis connection failed"

**Symptoms:**
- Backend logs: "Redis connection error"

**Solutions:**

1. **Ensure Railway Redis is added:**
   ```bash
   railway add redis
   ```

2. **Verify REDIS_URL format:**
   ```
   redis://default:password@redis.railway.app:6379
   ```

3. **Check Railway Redis service is running:**
   - Railway Dashboard → Redis → Check status

### Issue: "Environment variables not loading"

**Symptoms:**
- Logs show: "Environment validation failed"
- Variables appear undefined

**Solutions:**

1. **For backend:**
   - Set variables in Railway Dashboard → Backend → Variables
   - Redeploy: `railway up --detach`

2. **For frontend:**
   - CRITICAL: Variables must start with `VITE_`
   - Variables are baked at build time - must redeploy after setting

3. **Verify variables:**
   ```bash
   railway variables
   ```

---

## 📊 Monitoring & Logs

### View Real-time Logs

```bash
# Backend logs
railway logs --service backend --follow

# Frontend logs
railway logs --service frontend --follow
```

### Check Deployment Status

```bash
railway status
```

### Restart Services

```bash
# Restart backend
railway restart --service backend

# Restart frontend
railway restart --service frontend
```

---

## 🔐 Security Best Practices

1. **JWT Secrets:**
   - ✅ Use 64+ character random strings
   - ✅ Never commit to Git
   - ✅ Rotate every 90 days

2. **Database:**
   - ✅ Use strong passwords
   - ✅ Enable MongoDB Atlas IP whitelist
   - ✅ Use connection string with auth

3. **Payment Gateways:**
   - ✅ Start with test keys
   - ✅ Only use live keys after thorough testing
   - ✅ Store webhook secrets securely

4. **Email:**
   - ✅ Use Gmail App Passwords (not account password)
   - ✅ Enable 2FA on email account

5. **Dependencies:**
   - ✅ Regularly run: `npm audit fix`
   - ✅ Keep packages updated

---

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without console errors
- ✅ User can sign up/login
- ✅ API calls succeed (check Network tab)
- ✅ No CORS errors in console
- ✅ Database connection stable (check Railway logs)
- ✅ Redis connection stable (check Railway logs)

---

## 📞 Getting Help

### Check Logs First

```bash
# View recent backend logs
railway logs --service backend --num 100

# View recent frontend logs
railway logs --service frontend --num 100
```

### Resources

- **Railway Documentation:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **MongoDB Atlas Support:** [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Google Gemini API:** [ai.google.dev/docs](https://ai.google.dev/docs)

---

## 📝 Quick Reference

### Backend URLs

```bash
# Health check
https://YOUR-BACKEND-URL.up.railway.app/api/v1/health

# API documentation
https://YOUR-BACKEND-URL.up.railway.app/api/v1/docs

# Liveness probe
https://YOUR-BACKEND-URL.up.railway.app/api/v1/health/live

# Readiness probe
https://YOUR-BACKEND-URL.up.railway.app/api/v1/health/ready
```

### Frontend URLs

```bash
# Homepage
https://YOUR-FRONTEND-URL.up.railway.app/

# Health check
https://YOUR-FRONTEND-URL.up.railway.app/health
```

### Important Files

```
backend/
├── Dockerfile              # Docker build configuration
├── railway.json            # Railway deployment configuration
├── src/server.ts           # Main server entry point
└── .env.example            # Environment variable template

frontend/
├── Dockerfile              # Docker build configuration
├── railway.json            # Railway deployment configuration
├── nginx.conf              # Nginx web server configuration
└── docker-entrypoint.sh    # Startup script
```

---

## 🚀 Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Railway → Service → Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Enable monitoring** (recommended)
   - Set up error tracking (e.g., Sentry)
   - Configure uptime monitoring
   - Set up alerts for failures

3. **Production payment keys** (when ready)
   - Switch to live Razorpay/Stripe keys
   - Test payment flow thoroughly
   - Monitor transaction logs

4. **SSL/TLS certificates** (automatic)
   - Railway provides free SSL certificates
   - Verify HTTPS is working

5. **Backup strategy** (critical)
   - Set up MongoDB Atlas backups
   - Configure backup schedule
   - Test restore process

---

**🎊 Congratulations! Your application is now deployed and running on Railway!**

Last updated: March 8, 2026
