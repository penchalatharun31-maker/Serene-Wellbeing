# ⚡ Railway Quick Fix - Get Your App Running in 10 Minutes

## 🚨 Current Problem

You're seeing: **"Application failed to respond"**

This is because Railway needs proper configuration for your two services.

---

## ✅ Solution - Follow These Steps

### Step 1: Verify You Have 2 Services (2 minutes)

1. Go to https://railway.app/dashboard
2. Open your project
3. You should see **2 services**:
   - One for Backend (API)
   - One for Frontend (React app)

**If you only have 1 service:**
- Click "New" → "GitHub Repo"
- Select your repository again
- This will create the second service

---

### Step 2: Configure Backend Service (3 minutes)

1. Click on your **Backend** service
2. Go to **Settings** → **Service Name**: Change to `Serene-Backend`
3. Go to **Settings** → **Build**:
   - **Root Directory**: `/`
   - **Dockerfile Path**: `Dockerfile.backend`
4. Go to **Variables** → Click "New Variable" → "Add Bulk":

```
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_REFRESH_SECRET=another_super_secret_refresh_key_32_chars
NODE_ENV=production
PORT=${{PORT}}
RAZORPAY_KEY_ID=rzp_live_or_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET_HERE
FRONTEND_URL=${{Serene-Frontend.url}}
CORS_ORIGIN=${{Serene-Frontend.url}}
```

5. Click "Deploy" → "Redeploy"

---

### Step 3: Configure Frontend Service (3 minutes)

1. Click on your **Frontend** service
2. Go to **Settings** → **Service Name**: Change to `Serene-Frontend`
3. Go to **Settings** → **Build**:
   - **Root Directory**: `/`
   - **Dockerfile Path**: `Dockerfile.frontend`
4. Go to **Variables** → Click "New Variable" → "Add Bulk":

```
VITE_API_URL=${{Serene-Backend.url}}
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_YOUR_KEY_HERE
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
```

5. Click "Deploy" → "Redeploy"

---

### Step 4: Wait for Deployment (2 minutes)

1. Watch the **Deployments** tab
2. Wait for both services to show:
   - ✅ **Deploy Successful**
   - 🟢 **Status: Active**

3. If either fails:
   - Click on the failed deployment
   - View **Build Logs** or **Deploy Logs**
   - Look for error messages (send them to me if stuck)

---

### Step 5: Test Your App (2 minutes)

1. Go to **Frontend service** → Click the URL (e.g., `https://serene-frontend-production.up.railway.app`)
2. You should see your app load! 🎉
3. Try the onboarding flow:
   - Go to `/onboarding`
   - Complete steps 1-6
   - Test the payment flow

---

## 🐛 Still Not Working?

### Check #1: Backend Health

Open this URL in your browser:
```
https://YOUR-BACKEND-URL.railway.app/api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-05...",
  "uptime": 123.45
}
```

**If you get an error:**
1. Check Railway Backend logs
2. Verify MONGODB_URI is correct
3. Ensure JWT_SECRET is set

### Check #2: Frontend Loading

Open your frontend URL and press **F12** (DevTools) → **Console**

**Look for errors:**
- ❌ "CORS error" → Fix backend CORS_ORIGIN variable
- ❌ "API_URL undefined" → Add VITE_API_URL to frontend
- ❌ "Network error" → Backend might be down

### Check #3: Payment Flow

If booking works but payment doesn't:
1. Verify VITE_RAZORPAY_KEY_ID in frontend
2. Verify RAZORPAY_KEY_SECRET in backend
3. Check browser console for Razorpay errors

---

## 🆘 Common Fixes

### "Application failed to respond" (Backend)

**Fix:**
1. Railway Dashboard → Backend → Variables
2. Add: `PORT=${{PORT}}` (exactly like this)
3. Redeploy

### "Application failed to respond" (Frontend)

**Fix:**
1. Railway Dashboard → Frontend → Settings
2. Verify Dockerfile Path: `Dockerfile.frontend`
3. Check build logs for errors
4. Redeploy

### "CORS error" in browser

**Fix:**
1. Backend → Variables → Add:
   ```
   CORS_ORIGIN=${{Serene-Frontend.url}}
   FRONTEND_URL=${{Serene-Frontend.url}}
   ```
2. Redeploy backend

### "MongoDB connection failed"

**Fix:**
1. Go to MongoDB Atlas
2. Network Access → Add IP: `0.0.0.0/0`
3. This allows Railway to connect
4. Redeploy backend

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] You have 2 separate services in Railway
- [ ] Backend service name is `Serene-Backend`
- [ ] Frontend service name is `Serene-Frontend`
- [ ] Backend has MONGODB_URI variable set
- [ ] Backend has JWT_SECRET variable set (32+ chars)
- [ ] Backend has PORT=${{PORT}} variable
- [ ] Frontend has VITE_API_URL=${{Serene-Backend.url}}
- [ ] Both services show "Deploy Successful"
- [ ] Both services show green "Active" status
- [ ] Backend health check returns 200 OK
- [ ] Frontend URL loads in browser

---

## 🎯 Expected Result

After following these steps:

✅ **Backend URL**: `https://serene-backend-xxx.railway.app`
- Returns health check at `/api/v1/health`

✅ **Frontend URL**: `https://serene-frontend-xxx.railway.app`
- Shows Serene Wellbeing homepage
- Onboarding flow works
- Payment flow works

---

## 💡 Pro Tips

1. **Service References**: Railway auto-resolves `${{Service-Name.url}}` to the actual URL
2. **Environment Variables**: Frontend vars must use `VITE_` prefix
3. **Rebuilds**: If you add variables after build, click "Redeploy"
4. **Logs**: Always check logs first when debugging
5. **Test Locally**: Build locally first: `npm run build && npm run preview`

---

## 🔗 Next Steps

Once your app is running:

1. Test all features thoroughly
2. Add custom domain (optional)
3. Set up monitoring
4. Configure production payment keys
5. Enable SSL (automatic on Railway)

---

**Need more detailed help?** Read: `RAILWAY_DEPLOYMENT.md`

**Environment variables reference**: `RAILWAY_ENV_VARS.md`

---

**Last Updated**: January 2026
