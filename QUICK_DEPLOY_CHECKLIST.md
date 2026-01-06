# ✅ Quick Deploy Checklist

## Copy-Paste This Checklist

Print this out or keep it open while deploying:

---

### ☐ **1. Railway Backend (2 min)**
- [ ] Go to https://railway.app
- [ ] Login with GitHub
- [ ] New Project → Deploy from GitHub → Select `Serene-Wellbeing`
- [ ] Settings → Root Directory: `backend`
- [ ] Copy these variables to Railway:
  ```
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0
  JWT_SECRET=production-jwt-secret-key-min-32-characters-long-change-this-12345678
  JWT_REFRESH_SECRET=production-refresh-secret-key-min-32-characters-long-change-this-12345678
  JWT_EXPIRES_IN=7d
  JWT_REFRESH_EXPIRES_IN=30d
  RAZORPAY_KEY_ID=rzp_test_stub
  RAZORPAY_KEY_SECRET=secret
  FRONTEND_URL=https://your-app.vercel.app
  ALLOWED_ORIGINS=https://your-app.vercel.app
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=test@example.com
  EMAIL_PASSWORD=test
  EMAIL_FROM=Serene <noreply@example.com>
  ENABLE_CRON_JOBS=false
  LOG_LEVEL=info
  ```
- [ ] Click Deploy
- [ ] **Copy your Railway URL**: _________________

---

### ☐ **2. Vercel Frontend (1 min)**
- [ ] Go to https://vercel.com
- [ ] Login with GitHub
- [ ] New Project → Import `Serene-Wellbeing`
- [ ] Add Environment Variable:
  ```
  VITE_API_URL=https://YOUR_RAILWAY_URL.up.railway.app/api/v1
  ```
- [ ] Click Deploy
- [ ] **Copy your Vercel URL**: _________________

---

### ☐ **3. MongoDB Atlas (1 min)**
- [ ] Go to https://cloud.mongodb.com
- [ ] Login with: penchalatharun31_db_user
- [ ] Network Access → Add IP Address → `0.0.0.0/0`
- [ ] Save

---

### ☐ **4. Update Railway CORS (30 sec)**
- [ ] Back to Railway dashboard
- [ ] Update variables:
  ```
  FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
  ALLOWED_ORIGINS=https://YOUR_VERCEL_URL.vercel.app
  ```
- [ ] Auto-redeploys

---

### ☐ **5. Seed Data (Optional - 1 min)**
Run from your local machine:
```bash
cd backend
MONGODB_URI="mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0" npm run seed
```

---

### ☐ **6. Test (2 min)**
- [ ] Open your Vercel URL
- [ ] Register new user
- [ ] Browse experts (should see 5)
- [ ] Click expert → View profile
- [ ] Try booking session
- [ ] Check dashboard

---

## ✅ **Done!**

Your app is live at:
- Frontend: https://________________.vercel.app
- Backend: https://________________.up.railway.app

**Total time: 5 minutes**
**Total cost: $0**

---

## 🆘 **If Something Breaks**

### Check Railway Logs:
1. Railway dashboard → Click service
2. Deployments → View logs
3. Look for errors

### Check Vercel Logs:
1. Vercel dashboard → Click project
2. Deployments → Click latest
3. View Function Logs

### Common Issues:

**"Cannot connect to MongoDB"**
→ Check MongoDB Atlas Network Access allows `0.0.0.0/0`

**"CORS error"**
→ Update `ALLOWED_ORIGINS` in Railway to match exact Vercel URL

**"No experts showing"**
→ Run `npm run seed` to add test data

**"404 on API calls"**
→ Check `VITE_API_URL` ends with `/api/v1`

---

## 📞 **Need Help?**

Check these logs in order:
1. Railway deployment logs
2. Vercel function logs
3. MongoDB Atlas metrics
4. Browser console (F12)

Most issues are:
- Wrong environment variable values
- Missing `/api/v1` in API URL
- MongoDB IP not whitelisted

**Fix these and redeploy!**
