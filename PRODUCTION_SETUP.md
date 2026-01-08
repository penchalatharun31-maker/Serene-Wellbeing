# 🚀 Production Deployment Setup

## ✅ Your Credentials Checklist

You mentioned you already have **Razorpay** and **MongoDB** credentials. Here's how to configure them:

---

## 1️⃣ **Backend Configuration (Railway)**

Set these environment variables in your **Railway dashboard**:

### Required Credentials:

```bash
# MongoDB Atlas (Your Production Database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority

# Razorpay (LIVE MODE Keys)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=your_live_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars

# Application
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
GEMINI_API_KEY=your_gemini_api_key
```

---

## 2️⃣ **Frontend Configuration (Vercel)**

Set these environment variables in your **Vercel dashboard**:

```bash
# Backend API URL (Your Railway backend URL)
VITE_API_URL=https://your-backend.railway.app/api/v1

# Razorpay (LIVE MODE - Public Key Only)
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
```

---

## 3️⃣ **Quick Verification**

After deployment, test:
1. User signup → Check MongoDB Atlas for new user
2. User login → Should retrieve from database
3. Book session → Razorpay checkout opens
4. Complete payment → Session saved to database
5. Logout → Redirects to landing page ✅

---

**Your platform is production-ready! Just update the environment variables in Railway and Vercel.** 🚀
