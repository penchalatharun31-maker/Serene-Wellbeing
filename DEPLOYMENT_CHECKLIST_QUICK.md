# Railway Deployment - Quick Checklist

## ⚡ Quick Reference Guide

Use this checklist to ensure proper deployment to Railway.

---

## 🔍 Pre-Deployment Check

### Code & Configuration
- [ ] Code pushed to GitHub
- [ ] Branch: `claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT` or `main`
- [ ] Backend `railway.json` exists (located in `/backend`)
- [ ] Frontend `Dockerfile` exists (located in `/`)
- [ ] Frontend `nginx.conf` exists
- [ ] Frontend `docker-entrypoint.sh` exists

### External Services
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] Google Gemini API key obtained
- [ ] Railway account created

---

## 📦 Backend Deployment Checklist

### 1. Create Backend Service
- [ ] Railway → New Project → Deploy from GitHub
- [ ] Repository: `Serene-Wellbeing`
- [ ] Root Directory: `/backend`
- [ ] Branch selected correctly

### 2. Add Redis
- [ ] Railway → New → Database → Redis
- [ ] `REDIS_URL` auto-populated

### 3. Generate Secrets
Run locally and save outputs:
```bash
openssl rand -base64 64  # JWT_SECRET
openssl rand -base64 64  # JWT_REFRESH_SECRET
openssl rand -base64 64  # SESSION_SECRET
```

### 4. Set Environment Variables

#### Required Variables:
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `REDIS_URL=redis://...`
- [ ] `JWT_SECRET=<64-char-secret>`
- [ ] `JWT_REFRESH_SECRET=<64-char-secret>`
- [ ] `SESSION_SECRET=<64-char-secret>`
- [ ] `GEMINI_API_KEY=<your-key>`
- [ ] `GEMINI_MODEL=gemini-2.0-flash-exp`
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `API_VERSION=v1`
- [ ] `FRONTEND_URL=https://...` (update after frontend deployment)

#### Optional Variables (can add later):
- [ ] Payment gateway keys (Razorpay/Stripe)
- [ ] Email configuration (SMTP)
- [ ] Google OAuth credentials

### 5. Deploy & Verify
- [ ] Deployment successful (check Railway logs)
- [ ] Health check passes: `curl https://YOUR-BACKEND-URL/api/v1/health`
- [ ] Backend URL copied for frontend configuration

**Backend URL:** `________________________________`

---

## 🎨 Frontend Deployment Checklist

### 1. Create Frontend Service
- [ ] Railway → New → GitHub Repo
- [ ] Repository: `Serene-Wellbeing`
- [ ] Root Directory: `/` (root directory)
- [ ] Same branch as backend

### 2. Set Environment Variables

**CRITICAL:** Must be set BEFORE deployment (Vite bakes them at build time)

- [ ] `VITE_API_URL=https://YOUR-BACKEND-URL/api/v1`
- [ ] `VITE_RAZORPAY_KEY_ID=rzp_test_...`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] `VITE_APP_NAME=Serene Wellbeing Hub`
- [ ] `VITE_APP_VERSION=1.0.0`
- [ ] `VITE_SUPPORT_EMAIL=support@serenewellbeing.com`
- [ ] `VITE_ENABLE_CHAT=true`
- [ ] `VITE_ENABLE_VIDEO_CALLS=true`
- [ ] `VITE_ENABLE_GROUP_SESSIONS=true`
- [ ] `VITE_DEBUG=false`

### 3. Deploy & Verify
- [ ] Deployment successful (check Railway logs)
- [ ] Frontend URL obtained
- [ ] Homepage loads without errors
- [ ] No console errors (press F12)
- [ ] Health check works: `curl https://YOUR-FRONTEND-URL/health`

**Frontend URL:** `________________________________`

### 4. Update Backend FRONTEND_URL
- [ ] Go back to backend environment variables
- [ ] Update `FRONTEND_URL=https://YOUR-FRONTEND-URL`
- [ ] Backend redeployed automatically

---

## ✅ Post-Deployment Verification

### Backend Tests
```bash
# Health check
curl https://YOUR-BACKEND-URL/api/v1/health
# Expected: {"status":"healthy","services":{"database":"connected","redis":"connected"}}

# Liveness probe
curl https://YOUR-BACKEND-URL/api/v1/health/live
# Expected: {"status":"healthy"}

# Readiness probe
curl https://YOUR-BACKEND-URL/api/v1/health/ready
# Expected: {"status":"healthy"}
```

### Frontend Tests
```bash
# Health check
curl https://YOUR-FRONTEND-URL/health
# Expected: "healthy"

# Homepage
curl https://YOUR-FRONTEND-URL/
# Expected: HTML content
```

### Integration Tests
- [ ] Open frontend in browser
- [ ] Press F12 → Console (no errors)
- [ ] Navigate between pages (works)
- [ ] Try to sign up/login (works)
- [ ] Check Network tab (API calls succeed)
- [ ] No CORS errors

---

## 🐛 Common Issues Quick Fix

| Issue | Quick Fix |
|-------|-----------|
| Backend health check fails | Check all required env vars are set |
| Frontend shows blank page | Check `VITE_API_URL` is set correctly |
| CORS errors | Update backend `FRONTEND_URL` to match frontend |
| MongoDB connection error | Allow `0.0.0.0/0` in MongoDB Atlas |
| Redis connection error | Ensure Railway Redis addon is added |
| Environment variables not working | Redeploy after setting variables |

---

## 📊 Monitoring Commands

```bash
# View backend logs
railway logs --service backend --follow

# View frontend logs
railway logs --service frontend --follow

# Check deployment status
railway status

# Restart backend
railway restart --service backend

# Restart frontend
railway restart --service frontend
```

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without errors
- ✅ No CORS errors in browser console
- ✅ API calls work (check Network tab)
- ✅ User can navigate and interact with app
- ✅ Database connection stable (check logs)
- ✅ Redis connection stable (check logs)

---

## 📞 Need Help?

**View detailed guide:** `DEPLOYMENT_ISSUES_FIXED.md`

**Check logs:**
```bash
railway logs --service backend --num 100
railway logs --service frontend --num 100
```

**Railway Resources:**
- Documentation: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)

---

**Last updated:** March 8, 2026
