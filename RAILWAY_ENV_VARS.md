# 🔐 Railway Environment Variables - Quick Reference

## Backend Service Variables

Copy and paste these into Railway Dashboard → Backend Service → Variables:

```bash
# === CRITICAL - Required for app to run ===
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority
JWT_SECRET=your_random_32_character_secret_key_here
JWT_REFRESH_SECRET=your_random_32_character_refresh_secret_here
NODE_ENV=production
PORT=${{PORT}}

# === Payment Gateways - Required for bookings ===
RAZORPAY_KEY_ID=rzp_live_YOUR_RAZORPAY_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY_HERE

# === Application URLs - Use Railway service references ===
FRONTEND_URL=${{Serene-Frontend.url}}
BACKEND_URL=${{Serene-Backend.url}}
CORS_ORIGIN=${{Serene-Frontend.url}}

# === Email Configuration ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=noreply@serene-wellbeing.com

# === Google Gemini AI (Optional) ===
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY_HERE

# === JWT Settings ===
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# === Security ===
COOKIE_DOMAIN=.railway.app

# === Optional ===
ENABLE_LOGGING=true
LOG_LEVEL=info
REDIS_URL=redis://username:password@host:port
```

---

## Frontend Service Variables

Copy and paste these into Railway Dashboard → Frontend Service → Variables:

```bash
# === CRITICAL - Backend API Connection ===
VITE_API_URL=${{Serene-Backend.url}}

# === Payment Gateways (Public Keys Only!) ===
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_RAZORPAY_KEY_ID_HERE
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY_HERE

# === Application Info ===
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serene-wellbeing.com

# === Feature Flags ===
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# === Analytics (Optional) ===
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_TAG_MANAGER_ID=

# === Error Tracking (Optional) ===
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=production
```

---

## ⚠️ Important Notes

### Service References

Railway allows you to reference other services using:
```bash
${{SERVICE_NAME.url}}
```

**Example:**
If your backend service is named `Serene-Backend`, use:
```bash
VITE_API_URL=${{Serene-Backend.url}}
```

This automatically resolves to: `https://serene-backend-production.up.railway.app`

### Secret Keys vs Public Keys

**❌ NEVER put secret keys in frontend:**
- ❌ `RAZORPAY_KEY_SECRET`
- ❌ `STRIPE_SECRET_KEY`
- ❌ `JWT_SECRET`

**✅ Frontend only uses public keys:**
- ✅ `VITE_RAZORPAY_KEY_ID`
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY`

### Environment Variable Prefixes

- **Frontend**: Must use `VITE_` prefix
- **Backend**: No prefix required
- **Railway System**: `${{PORT}}`, `${{SERVICE.url}}`

---

## 🔍 How to Verify Variables Are Set

### Backend

```bash
# Railway Dashboard → Backend → Deployments → Logs
# Look for startup logs showing:
info: Environment loaded successfully
info: MongoDB connection: connected
info: Server running on port 5000
```

### Frontend

```bash
# Railway Dashboard → Frontend → Deployments → Logs
# Look for build logs showing:
vite v6.4.1 building for production...
✓ built in 11.61s
```

If build fails with "VITE_API_URL is undefined", add the variable and redeploy.

---

## 🚨 Troubleshooting

### "Application failed to respond"

**Backend:**
1. Check `MONGODB_URI` is set correctly
2. Verify `JWT_SECRET` is at least 32 characters
3. Ensure `PORT=${{PORT}}` (not hardcoded)

**Frontend:**
1. Check `VITE_API_URL` is set before build
2. Verify it references backend: `${{Serene-Backend.url}}`
3. Rebuild if you added variables after first deploy

### "CORS Error" in browser console

**Fix:** Ensure backend has:
```bash
FRONTEND_URL=${{Serene-Frontend.url}}
CORS_ORIGIN=${{Serene-Frontend.url}}
```

### "Payment not working"

**Fix:** Ensure both services have Razorpay keys:

**Backend:**
```bash
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

**Frontend:**
```bash
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE  # Same as backend key ID
```

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] MongoDB Atlas has Railway IPs whitelisted (`0.0.0.0/0`)
- [ ] All backend required variables are set
- [ ] All frontend required variables are set
- [ ] Service names match references (`Serene-Backend`, `Serene-Frontend`)
- [ ] Using production Razorpay/Stripe keys (not test keys)
- [ ] SMTP credentials are correct (test email sending)
- [ ] `PORT=${{PORT}}` in backend (not hardcoded)
- [ ] `VITE_API_URL=${{Serene-Backend.url}}` in frontend
- [ ] `CORS_ORIGIN=${{Serene-Frontend.url}}` in backend

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong secrets** (32+ characters, random)
3. **Rotate secrets regularly** (every 90 days)
4. **Use production keys** in Railway (not test keys)
5. **Limit database access** to Railway IPs only
6. **Enable 2FA** on all service accounts
7. **Monitor logs** for suspicious activity

---

## 🆘 Need Help?

If you're still having issues:

1. **Check Railway logs**: Service → Deployments → View Logs
2. **Verify all variables**: Service → Variables
3. **Test backend health**: `curl https://your-backend.railway.app/api/v1/health`
4. **Check browser console**: F12 → Console tab
5. **Review this guide**: RAILWAY_DEPLOYMENT.md

---

**Last Updated**: January 2026
