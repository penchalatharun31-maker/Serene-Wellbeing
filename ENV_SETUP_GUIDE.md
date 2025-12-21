# 🔐 Environment Variables Setup Guide

## 📋 Current Status

Your `.env` file is currently set up for **local development**. Here's what needs to be configured:

---

## ✅ Already Configured (Working)

These variables are set and working:

| Variable | Current Value | Status |
|----------|---------------|--------|
| `NODE_ENV` | development | ✅ OK |
| `PORT` | 5000 | ✅ OK |
| `MONGODB_URI` | localhost:27017 | ✅ OK (local) |
| `FRONTEND_URL` | localhost:3000 | ✅ OK (local) |
| `BCRYPT_ROUNDS` | 12 | ✅ OK (secure) |
| `PLATFORM_COMMISSION_RATE` | 0.20 | ✅ OK (20%) |

---

## ⚠️ MUST Configure (Placeholders)

These have placeholder values and **MUST** be changed before production:

### 1. **Google Gemini AI** 🤖
```env
# CURRENT (Placeholder)
GEMINI_API_KEY=placeholder-add-your-gemini-api-key-here

# NEEDED (Get from Google AI Studio)
GEMINI_API_KEY=AIzaSyA...your-actual-key-here
```

**How to get:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy...`)
4. Replace placeholder in `.env`

**Used for:** AI Companion, crisis detection, mood insights

---

### 2. **Stripe Payment** 💳
```env
# CURRENT (Placeholders)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# NEEDED (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_51ABC...your-test-key
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...your-test-key
STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret
```

**How to get:**
1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy **Test mode** keys (for development)
4. For webhooks: Dashboard → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.com/api/v1/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

**Used for:** Session payments, package purchases, corporate billing

---

### 3. **Email Service** 📧
```env
# CURRENT (Test values)
EMAIL_USER=test@example.com
EMAIL_PASSWORD=test-password

# OPTION A: Gmail (Simple, for testing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# OPTION B: SendGrid (Production recommended)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-sendgrid-api-key
```

**How to get (Gmail):**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Copy 16-character password

**How to get (SendGrid - Recommended for production):**
1. Sign up at https://sendgrid.com (Free: 100 emails/day)
2. Go to Settings → API Keys → Create API Key
3. Copy the API key

**Used for:** Welcome emails, session reminders, password resets

---

### 4. **JWT Secrets** 🔑
```env
# CURRENT (Development only - NOT secure for production)
JWT_SECRET=local-dev-jwt-secret-key-min-32-characters-long-12345678
JWT_REFRESH_SECRET=local-dev-refresh-secret-key-min-32-characters-long-12345678

# NEEDED (Generate secure secrets)
JWT_SECRET=<generated-secret-here>
JWT_REFRESH_SECRET=<generated-secret-here>
```

**How to generate:**
```bash
# Run these commands in terminal:
openssl rand -base64 32
openssl rand -base64 32
```

**Copy the output and replace in `.env`**

**Used for:** User authentication tokens

---

## 🚀 Production Configuration

When deploying to production, change these:

### 1. **Environment**
```env
NODE_ENV=production
```

### 2. **Database** (MongoDB Atlas)
```env
# CURRENT
MONGODB_URI=mongodb://localhost:27017/serene-wellbeing

# PRODUCTION (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority
```

**How to get:**
1. Sign up at https://www.mongodb.com/cloud/atlas (Free tier available)
2. Create a cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

---

### 3. **Redis** (Required for production scaling)
```env
# CURRENT
REDIS_URL=redis://localhost:6379

# PRODUCTION (Upstash - Free tier)
REDIS_URL=redis://default:your-password@your-redis-host.upstash.io:6379
```

**How to get:**
1. Sign up at https://upstash.com (Free tier: 10K commands/day)
2. Create Redis database
3. Copy "Redis URL"

**Used for:** Rate limiting (multi-server), session caching

---

### 4. **Frontend URL**
```env
# CURRENT
FRONTEND_URL=http://localhost:3000

# PRODUCTION
FRONTEND_URL=https://app.serenewellbeing.com
```

---

### 5. **Stripe Live Keys** (When ready to accept real payments)
```env
# Switch from test keys to live keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**⚠️ WARNING:** Only switch to live keys when:
- You've tested thoroughly in test mode
- You're ready to accept real money
- You've set up proper error handling

---

## 📊 Priority Order

### **To Start Development (Minimum):**
1. ✅ **Nothing required!** - App works locally with current values
2. (Optional) Add Gemini API key for AI features
3. (Optional) Add Gmail for email testing

### **To Test Payments:**
1. **Stripe Test Keys** (get from Stripe Dashboard)
2. Email service (for payment confirmations)

### **For Production Launch:**
1. **MongoDB Atlas** (database hosting)
2. **Stripe Live Keys** (real payments)
3. **SendGrid/Email Service** (reliable email delivery)
4. **JWT Secrets** (generate new secure secrets)
5. **Redis** (for rate limiting across servers)
6. **Frontend URL** (your production domain)

---

## 🔒 Security Best Practices

### **DO:**
- ✅ Use `.env` for all secrets (never commit to git)
- ✅ Generate strong JWT secrets (32+ characters)
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use Stripe test mode until ready for production

### **DON'T:**
- ❌ Commit `.env` to git (it's in `.gitignore`)
- ❌ Share secrets in Slack/email
- ❌ Use the same secrets across environments
- ❌ Use default/example secrets in production
- ❌ Switch to Stripe live mode without testing

---

## 🧪 Testing Your Configuration

### **1. Test Database Connection:**
```bash
cd backend
npm run dev
# Should see: "✓ MongoDB connected successfully"
```

### **2. Test Gemini AI:**
```bash
curl -X POST http://localhost:5000/api/v1/ai-companion/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Hello"}'
```

### **3. Test Stripe:**
```bash
curl http://localhost:5000/api/v1/pricing/individual
# Should return pricing plans
```

### **4. Test Email:**
```bash
# Try password reset endpoint
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 📝 Quick Setup Checklist

### **Local Development:**
- [ ] MongoDB running: `sudo systemctl start mongod`
- [ ] Redis running (optional): `sudo systemctl start redis`
- [ ] `.env` file exists
- [ ] Backend starts: `npm run dev`
- [ ] No errors in console

### **Production Ready:**
- [ ] MongoDB Atlas configured
- [ ] Redis (Upstash) configured
- [ ] Stripe live keys added
- [ ] SendGrid email configured
- [ ] JWT secrets generated (new, secure)
- [ ] Frontend URL updated
- [ ] `NODE_ENV=production`
- [ ] All tests passing
- [ ] Seed pricing data: `npx ts-node src/scripts/seedPricing.ts`

---

## 🆘 Troubleshooting

### **"MongoDB connection failed"**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### **"Gemini API error"**
- Check API key is valid (starts with `AIzaSy...`)
- Check you haven't exceeded free quota (15 requests/min)
- Get key from: https://aistudio.google.com/app/apikey

### **"Stripe error"**
- Verify keys start with `sk_test_` (not `sk_live_`)
- Check keys are from same account
- Test in Stripe Dashboard → Developers → API Keys

### **"Email not sending"**
- For Gmail: Use app-specific password (not regular password)
- For SendGrid: Check API key is valid
- Check EMAIL_FROM has valid email format

---

## 🎯 Recommended Services (All have free tiers)

| Service | Purpose | Free Tier | Sign Up |
|---------|---------|-----------|---------|
| **MongoDB Atlas** | Database | 512MB | https://www.mongodb.com/cloud/atlas |
| **Upstash Redis** | Caching | 10K commands/day | https://upstash.com |
| **Stripe** | Payments | Unlimited test mode | https://stripe.com |
| **SendGrid** | Email | 100/day | https://sendgrid.com |
| **Google Gemini** | AI | 15 req/min | https://aistudio.google.com |
| **Cloudinary** | Image hosting | 25GB | https://cloudinary.com |

---

## 💡 Pro Tips

1. **Use different `.env` files per environment:**
   ```
   .env.development
   .env.staging
   .env.production
   ```

2. **Store production secrets in environment variables:**
   - Railway/Render: Use dashboard
   - AWS: Use Parameter Store
   - Vercel: Use environment variables tab

3. **Never log secrets:**
   ```typescript
   // BAD
   console.log('JWT Secret:', process.env.JWT_SECRET);

   // GOOD
   console.log('JWT Secret configured:', !!process.env.JWT_SECRET);
   ```

4. **Test in Stripe test mode first:**
   - Use test card: `4242 4242 4242 4242`
   - Any future date, any CVC

---

## ✅ You're Ready When:

- [ ] All ⚠️ placeholders replaced with real values
- [ ] Backend starts without errors
- [ ] Can seed pricing data successfully
- [ ] Can create a user account
- [ ] Can view pricing pages
- [ ] Email test works
- [ ] (Optional) Stripe test payment works
- [ ] (Optional) AI Companion responds

**Current Status:** ✅ **Ready for local development**
**Production Ready:** ⏳ **Configure MongoDB Atlas + Stripe + Email**

---

*Last Updated: December 21, 2025*
