# Railway Backend Deployment - Quick Start

## 🚀 5-Minute Setup

### Prerequisites
- Railway account
- MongoDB Atlas URI
- Google Gemini API key

---

## Option 1: GitHub Deployment (Easiest)

### Step 1: Push to GitHub
```bash
git push origin claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select repository: `Serene-Wellbeing`
4. Set **Root Directory**: `/backend`
5. Add Redis: Click **"New"** → **"Database"** → **"Redis"**

### Step 3: Set Environment Variables

Click **Variables** and add these **REQUIRED** variables:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing
REDIS_URL=<auto-filled-from-redis-addon>
JWT_SECRET=<run: openssl rand -base64 64>
JWT_REFRESH_SECRET=<run: openssl rand -base64 64>
SESSION_SECRET=<run: openssl rand -base64 64>
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-2.0-flash-exp
NODE_ENV=production
PORT=5000
API_VERSION=v1
FRONTEND_URL=https://your-frontend.up.railway.app
```

### Step 4: Deploy & Test

Railway will auto-deploy. Test with:
```bash
curl https://YOUR-URL.up.railway.app/api/v1/health
```

---

## Option 2: CLI Deployment (Fastest)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Backend
```bash
cd backend
railway init
railway add redis
```

### Step 3: Set Variables
```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="$(openssl rand -base64 64)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -base64 64)"
railway variables set SESSION_SECRET="$(openssl rand -base64 64)"
railway variables set GEMINI_API_KEY="your-gemini-key"
railway variables set GEMINI_MODEL="gemini-2.0-flash-exp"
railway variables set NODE_ENV="production"
```

### Step 4: Deploy
```bash
railway up
railway logs
```

---

## ✅ Quick Validation

After deployment, verify:

```bash
# Check health
curl https://YOUR-URL.up.railway.app/api/v1/health

# Expected response:
# {"status":"healthy","timestamp":"...","services":{"database":"connected"}}
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Root Directory is `/backend` |
| Health check fails | Verify all environment variables are set |
| MongoDB connection error | Allow `0.0.0.0/0` in MongoDB Atlas Network Access |
| Redis error | Ensure Railway Redis addon is added |

---

## 📝 Required Secrets

Generate JWT secrets:
```bash
openssl rand -base64 64  # For JWT_SECRET
openssl rand -base64 64  # For JWT_REFRESH_SECRET
openssl rand -base64 64  # For SESSION_SECRET
```

Get Gemini API key:
- Visit: https://aistudio.google.com/app/apikey

---

## 🔗 Useful Commands

```bash
railway logs              # View logs
railway status            # Check deployment status
railway open              # Open dashboard
railway restart           # Restart service
railway variables         # View all variables
```

---

## 📚 Full Guide

For detailed instructions, see: **RAILWAY_COMPLETE_SETUP_GUIDE.md**

---

**Need Help?** Check logs: `railway logs` or view in Railway Dashboard → Deployments → Logs
