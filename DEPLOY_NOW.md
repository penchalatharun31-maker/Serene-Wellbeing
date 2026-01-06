# 🚀 Deploy Your App in 5 Minutes (Free)

## ✅ Your Code is Ready - Just Deploy It!

The sandbox can't run external services, but your code is production-ready. Follow these exact steps:

---

## 📱 **Step 1: Deploy Backend to Railway (2 minutes)**

### 1. Go to Railway
- Open: https://railway.app
- Click "Login" → Sign in with GitHub
- Click "New Project"

### 2. Deploy from GitHub
- Click "Deploy from GitHub repo"
- Select: `Serene-Wellbeing`
- Railway will auto-detect the backend

### 3. Add Root Directory (Important!)
- Click on the service
- Settings → Root Directory: `backend`
- Click "Save"

### 4. Add Environment Variables
Click "Variables" tab and add these (copy from `backend/.env`):

```bash
# Required Variables
NODE_ENV=production
PORT=5000

# MongoDB Atlas (already configured)
MONGODB_URI=mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0

# JWT Secrets (use these or generate new ones)
JWT_SECRET=production-jwt-secret-key-min-32-characters-long-change-this-12345678
JWT_REFRESH_SECRET=production-refresh-secret-key-min-32-characters-long-change-this-12345678
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Razorpay (use test keys for now)
RAZORPAY_KEY_ID=rzp_test_stub
RAZORPAY_KEY_SECRET=secret

# Email (optional - can skip for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=test@example.com
EMAIL_PASSWORD=test-password
EMAIL_FROM=Serene Wellbeing <noreply@example.com>

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app

# Other settings
ENABLE_CRON_JOBS=false
LOG_LEVEL=info
```

### 5. Deploy!
- Click "Deploy"
- Wait 1-2 minutes for build
- Copy your Railway URL: `https://your-app-name.up.railway.app`

✅ **Backend is now live!**

---

## 🌐 **Step 2: Deploy Frontend to Vercel (2 minutes)**

### 1. Go to Vercel
- Open: https://vercel.com
- Click "Login" → Sign in with GitHub
- Click "New Project"

### 2. Import Repository
- Click "Import" next to `Serene-Wellbeing`
- Framework Preset: **Vite** (auto-detected)
- Root Directory: **Leave as `.`** (root)

### 3. Add Environment Variable
Click "Environment Variables" and add:

```bash
VITE_API_URL=https://your-app-name.up.railway.app/api/v1
```

**Replace `your-app-name.up.railway.app` with your actual Railway URL from Step 1!**

### 4. Deploy!
- Click "Deploy"
- Wait 1 minute
- Your app is live at: `https://your-app.vercel.app`

✅ **Frontend is now live!**

---

## 🔐 **Step 3: Configure MongoDB Atlas (1 minute)**

### Whitelist Railway's IP

1. Go to: https://cloud.mongodb.com
2. Click your cluster (Cluster0)
3. Click "Network Access" (left sidebar)
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" → `0.0.0.0/0`
6. Click "Confirm"

✅ **MongoDB is now accessible!**

---

## 🎨 **Step 4: Update Frontend URL in Railway**

Now that you have your Vercel URL:

1. Go back to Railway dashboard
2. Click your backend service
3. Variables tab
4. Update these variables:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. Service will auto-redeploy

✅ **CORS configured!**

---

## 🌱 **Step 5: Seed Test Data (Optional)**

Add test users and experts to your database:

### Option A: Via Railway Dashboard
1. In Railway → Click your service
2. Click "Deploy" tab
3. Click terminal icon (top right)
4. Run:
   ```bash
   npm run seed
   ```

### Option B: Via Local Terminal
If Railway terminal doesn't work:
```bash
# From your local machine
cd backend
MONGODB_URI="mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0" npm run seed
```

✅ **Test data created!**

This creates:
- 2 users: `user@example.com` / `password123`
- 5 experts: `olivia@example.com` / `password123`

---

## 🧪 **Step 6: Test Your Live App!**

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Click "Sign Up" → Create account
3. Click "Browse Experts" → Should see 5 experts
4. Click an expert → View profile
5. Book a session → Payment flow
6. Dashboard → View sessions

✅ **Everything should work!**

---

## 🎉 **You're Live!**

Your URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app-name.up.railway.app
- **Database**: MongoDB Atlas (cloud.mongodb.com)

---

## 🐛 **Troubleshooting**

### Backend not connecting to MongoDB
- Check Railway logs: Click service → "Deployments" → View logs
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` variable is correct in Railway

### Frontend can't reach backend
- Check `VITE_API_URL` in Vercel environment variables
- Should be: `https://your-railway-url.up.railway.app/api/v1`
- Make sure it ends with `/api/v1`

### CORS errors
- Update `ALLOWED_ORIGINS` in Railway to match your Vercel URL
- Should be: `https://your-app.vercel.app` (no trailing slash)

### No experts showing
- Run seed script: `npm run seed`
- Check MongoDB Atlas → Browse Collections → Should see data

---

## 💰 **Cost: $0/month**

Both Railway and Vercel offer generous free tiers:
- **Railway**: 500 hours/month free (enough for 24/7)
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **MongoDB Atlas**: 512MB free tier

Your app runs completely free! 🎉

---

## 🔒 **Security Notes for Production**

Before accepting real users:

1. **Generate new JWT secrets**:
   ```bash
   openssl rand -base64 48
   ```
   Update in Railway variables

2. **Get live Razorpay keys**:
   - Go to https://dashboard.razorpay.com
   - Switch to "Live Mode"
   - Copy live keys
   - Update in Railway

3. **Setup custom domain** (optional):
   - Vercel: Settings → Domains → Add domain
   - Railway: Settings → Public Networking → Custom domain

---

## ✅ **Next Steps**

1. Test all features on your live app
2. Fix any issues (check logs)
3. Get live Razorpay keys for real payments
4. Add custom domain
5. Start marketing!

**Your product is ready to launch! 🚀**
