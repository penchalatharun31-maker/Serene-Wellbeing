# 🚀 RAILWAY DEPLOYMENT - EXACT CONFIGURATION

**Branch**: `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT`
**Last Updated**: January 1, 2026

---

## ⚠️ CRITICAL: BOTH SERVICES MUST USE THESE EXACT SETTINGS

### 🎨 FRONTEND SERVICE CONFIGURATION

**Navigate to**: Railway → mellow-solace-production → Settings

| Setting | Value |
|---------|-------|
| **Branch** | `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT` |
| **Root Directory** | ` ` (EMPTY - leave blank) |
| **Dockerfile Path** | `Dockerfile` |
| **Auto Deploy** | ✅ ENABLED |
| **Watch Paths** | (Leave default or set to `/`) |

**Environment Variables**: (Should already be set)
- Add any frontend-specific variables if needed

---

### 🔧 BACKEND SERVICE CONFIGURATION

**Navigate to**: Railway → serene-wellbeing-production-d8f0 → Settings

| Setting | Value |
|---------|-------|
| **Branch** | `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT` |
| **Root Directory** | ` ` (EMPTY - leave blank) |
| **Dockerfile Path** | `Dockerfile.backend` |
| **Auto Deploy** | ✅ ENABLED |
| **Watch Paths** | (Leave default or set to `/`) |

**Environment Variables**: (Set these)
- `NODE_ENV=production`
- `MONGODB_URI=<your-mongodb-uri>`
- `JWT_SECRET=<your-jwt-secret>`
- `GEMINI_API_KEY=<your-api-key>`
- `RAZORPAY_KEY_ID=<your-key>`
- `RAZORPAY_KEY_SECRET=<your-secret>`
- `FRONTEND_URL=https://mellow-solace-production.up.railway.app`
- (+ all other env vars from backend/.env.example)

---

## 🔄 FORCE REDEPLOY

After updating settings:

1. **Go to each service** → Deployments tab
2. **Click the three dots** (•••) on the latest deployment
3. **Select "Redeploy"** or trigger new deployment
4. **Monitor build logs** for success

---

## ✅ VERIFICATION CHECKLIST

### Frontend (`Dockerfile`):
- ✅ Node 20 Alpine
- ✅ `npm install --legacy-peer-deps`
- ✅ Nginx serving from `/usr/share/nginx/html`
- ✅ Port 80 exposed

### Backend (`Dockerfile.backend`):
- ✅ Node 20 Alpine (both build & production stages)
- ✅ `npm install` in build stage (includes devDependencies)
- ✅ `npm install --production` in production stage
- ✅ TypeScript compilation works
- ✅ Port 5000 exposed
- ✅ Health check at `/api/v1/health`

### Configuration Files:
- ✅ `railway.json` - Frontend config
- ✅ `backend/railway.json` - Backend config
- ✅ `.dockerignore` - Does NOT include `backend`
- ✅ `backend/tsconfig.json` - Has `typeRoots`
- ✅ `backend/src/types/express.d.ts` - Type declarations

---

## 🐛 IF DEPLOYMENT STILL FAILS

### Check Build Logs For:

**TypeScript Errors** → Fixed in commits 8c0b05f, 9522c54, 7b9936e, 19d2fad
**npm Dependency Errors** → Fixed in commit c219fc5
**Dockerfile Not Found** → Ensure Root Directory is EMPTY
**File Not Found** → Ensure `.dockerignore` doesn't exclude `backend`

### Manual Trigger:
1. Make a small change (add comment to README)
2. Commit and push
3. Watch Railway auto-deploy

---

## 📊 EXPECTED BUILD OUTPUT

### Frontend Build:
```
✓ Building with Node 20
✓ Installing dependencies (--legacy-peer-deps)
✓ Building Vite app
✓ Copying to nginx
✓ Service starting on port 80
```

### Backend Build:
```
✓ Building with Node 20
✓ Installing all dependencies
✓ Compiling TypeScript
✓ Production stage with Node 20
✓ Installing production dependencies
✓ Service starting on port 5000
✓ Health check responding
```

---

## 🎯 COMMIT HASH FOR DEPLOYMENT

**Latest Commit**: `19d2fad`
**Commit Message**: "fix: Use local variable assignment for TypeScript type narrowing"

This commit includes ALL 8 deployment fixes.

---

**If Railway is still not auto-deploying**, check:
1. GitHub webhook is connected
2. Branch name is exactly correct (case-sensitive)
3. Railway has permissions to access the repository
