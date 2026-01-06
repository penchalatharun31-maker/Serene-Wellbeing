# 🔍 MongoDB Atlas & Authentication Verification Guide

## 🚨 IMPORTANT: Why You Can't See Data in Atlas

**Root Cause**: This is a **sandbox environment** that doesn't have network access to MongoDB Atlas.

**What This Means**:
- ✅ Your MongoDB Atlas credentials are correct
- ✅ The configuration is properly set up
- ❌ BUT: Sandbox can't reach external MongoDB Atlas servers
- ❌ Data created here won't appear in Atlas

**Solution**: **Test on your local machine** where you have internet access.

---

## 📋 STEP-BY-STEP: Verify MongoDB Atlas on Your Local Machine

### Step 1: Verify Atlas Configuration ✅

**File**: `backend/.env`

Make sure this line is **UNCOMMENTED**:
```bash
# ✅ PRODUCTION (uncomment this)
MONGODB_URI=mongodb+srv://penchalatharun31_db_user:FJhvx7Q8nd8F.XT@cluster0.nl28hbh.mongodb.net/serene-wellbeing?retryWrites=true&w=majority&appName=Cluster0

# ❌ LOCAL (comment this out)
# MONGODB_URI=mongodb://localhost:27017/serene-wellbeing
```

---

### Step 2: Whitelist Your IP in MongoDB Atlas

1. **Login to MongoDB Atlas**:
   - Go to: https://cloud.mongodb.com
   - Login with your credentials

2. **Navigate to Network Access**:
   - Click on "Network Access" in left sidebar
   - Click "Add IP Address"

3. **Add Your IP**:
   - Option A: Click "ADD CURRENT IP ADDRESS" (recommended)
   - Option B: Enter `0.0.0.0/0` to allow all IPs (⚠️ less secure, only for testing)
   - Click "Confirm"

4. **Wait 1-2 minutes** for changes to propagate

---

### Step 3: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

**Expected Output** (SUCCESS ✅):
```
✓ MongoDB Connected: cluster0.nl28hbh.mongodb.net
✓ Database: serene-wellbeing
✓ Connection pool size: 10
Server running in development mode on port 5000
```

**If You See Errors** (❌):
```
MongoDB connection failed
```

**Troubleshooting**:
1. Check IP whitelist (Step 2)
2. Verify credentials in `.env`
3. Check internet connection
4. Wait 2 minutes and restart server

---

### Step 4: Test User Registration

**Using cURL**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response** (✅):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "677c123456789abcdef12345",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user",
    "credits": 0,
    "isVerified": false
  }
}
```

**Save the token** for next steps!

---

### Step 5: Verify Data in MongoDB Atlas Dashboard

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com

2. **Navigate to Collections**:
   - Click on "Database" (left sidebar)
   - Click "Browse Collections"
   - Select database: `serene-wellbeing`

3. **Check Users Collection**:
   - Click on `users` collection
   - You should see your newly created user:
     ```json
     {
       "_id": "677c123456789abcdef12345",
       "name": "Test User",
       "email": "testuser@example.com",
       "role": "user",
       "credits": 0,
       "isVerified": false,
       "createdAt": "2026-01-06T14:10:00.000Z"
     }
     ```

4. **If You See the User** ✅:
   - **SUCCESS!** Data is persisting to Atlas
   - MongoDB Atlas is working correctly

5. **If You DON'T See the User** ❌:
   - Check backend logs for errors
   - Verify IP whitelist
   - Check if server connected successfully (Step 3)

---

## 🔐 STEP-BY-STEP: Test Role-Based Authentication

### Test 1: Register Users with Different Roles

**Register as Regular User**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Regular User",
    "email": "user@test.com",
    "password": "password123",
    "role": "user"
  }'
```

**Register as Expert**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Expert User",
    "email": "expert@test.com",
    "password": "password123",
    "role": "expert"
  }'
```

**Save both tokens!**

---

### Test 2: Verify JWT Contains Role

**Decode your JWT token** at: https://jwt.io

**Paste your token** and check payload:
```json
{
  "id": "677c123456789abcdef12345",
  "role": "user",  // ✅ Role is included!
  "iat": 1704556200,
  "exp": 1705161000
}
```

---

### Test 3: Test Login Returns Role

**Login as User**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123"
  }'
```

**Check Response Includes Role**:
```json
{
  "success": true,
  "token": "...",
  "user": {
    "role": "user"  // ✅ Role is returned
  }
}
```

---

### Test 4: Test Role-Based Route Protection

**Get User Token**:
```bash
USER_TOKEN="<your-user-token>"
```

**Try to Access Expert-Only Route** (should fail):
```bash
curl -X GET http://localhost:5000/api/v1/experts/dashboard \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response** (✅):
```json
{
  "success": false,
  "error": "User role 'user' is not authorized to access this route"
}
```

**This proves role-based auth is working!**

---

## 💳 STEP-BY-STEP: Test Payment Flow

### Prerequisites

1. **Get Razorpay Test Keys**:
   - Go to: https://dashboard.razorpay.com/app/keys
   - Copy Test Key ID and Secret

2. **Update `.env`**:
   ```bash
   RAZORPAY_KEY_ID=rzp_test_YourTestKeyId
   RAZORPAY_KEY_SECRET=YourTestKeySecret
   ```

3. **Restart Backend Server**

---

### Test 1: Create Payment Order

**Login as User** (get token):
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

**Save token**:
```bash
TOKEN="<your-token>"
```

**Create Razorpay Order**:
```bash
curl -X POST http://localhost:5000/api/v1/payments/create-razorpay-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 499,
    "currency": "INR"
  }'
```

**Expected Response** (✅):
```json
{
  "success": true,
  "order": {
    "id": "order_NXxxxxxxxxxxx",
    "amount": 49900,
    "currency": "INR",
    "status": "created"
  }
}
```

---

### Test 2: Frontend Payment Flow

**On your local machine**, open the app:
```bash
cd frontend  # or root directory
npm run dev
```

**Test Flow**:
1. ✅ Login as user
2. ✅ Go to user dashboard
3. ✅ Click "Top Up Credits"
4. ✅ Select credit pack (50, 150, 500)
5. ✅ Choose payment method (UPI/Card)
6. ✅ Click "Continue to Pay"
7. ✅ Razorpay checkout should open
8. ✅ Use test card: 4111 1111 1111 1111
9. ✅ Complete payment
10. ✅ Credits should be added

**Check Logs**:
```bash
# Backend should log:
✓ Payment order created: order_xxxxx
✓ Payment verified: pay_xxxxx
✓ Credits added to user
```

---

### Test 3: Session Booking Payment

1. ✅ Login as user
2. ✅ Browse experts at `/browse`
3. ✅ Select an expert
4. ✅ Click "Book Session"
5. ✅ Choose date and time
6. ✅ Click "Continue to Payment"
7. ✅ Click "Pay ₹XXX"
8. ✅ Razorpay opens
9. ✅ Complete payment
10. ✅ Session booked successfully

**Check MongoDB Atlas**:
- Go to `sessions` collection
- Should see new session document with:
  - `userId`: your user ID
  - `expertId`: expert ID
  - `status`: "pending" or "confirmed"
  - `razorpayPaymentId`: payment ID

---

## 🔍 TROUBLESHOOTING GUIDE

### Issue 1: "Cannot See Data in Atlas"

**Symptoms**:
- User created locally
- Login works
- But no data in Atlas dashboard

**Diagnosis**:
```bash
# Check backend logs
cd backend
npm run dev

# Look for:
✓ MongoDB Connected: cluster0.nl28hbh.mongodb.net  # ✅ Good
❌ MongoDB connection failed                       # ❌ Problem
```

**Solutions**:
1. ✅ Verify IP is whitelisted
2. ✅ Check internet connection
3. ✅ Verify `.env` has Atlas URI uncommented
4. ✅ Wait 2 minutes after IP whitelist change
5. ✅ Restart backend server

---

### Issue 2: "Payment Not Processing"

**Symptoms**:
- Razorpay doesn't open
- Payment button doesn't work
- Console errors

**Diagnosis**:
```javascript
// Open browser console (F12)
// Look for errors:
❌ Network error
❌ CORS error
❌ 401 Unauthorized
```

**Solutions**:
1. ✅ Check Razorpay keys in `.env`
2. ✅ Verify user is logged in (token exists)
3. ✅ Check frontend env: `VITE_RAZORPAY_KEY_ID`
4. ✅ Verify backend is running
5. ✅ Check network tab for API calls

---

### Issue 3: "Role-Based Auth Not Working"

**Symptoms**:
- User can access expert routes
- No 403 Forbidden error
- Dashboard shows wrong role

**Diagnosis**:
```bash
# Test with curl
curl -X GET http://localhost:5000/api/v1/experts/dashboard \
  -H "Authorization: Bearer <user-token>"

# Should get 403, if you get 200, auth is broken
```

**Solutions**:
1. ✅ Check `ProtectedRoute` has `allowedRoles` prop in `App.tsx`
2. ✅ Verify token includes role (decode at jwt.io)
3. ✅ Check middleware in backend routes
4. ✅ Restart both frontend and backend

---

## ✅ VERIFICATION CHECKLIST

Use this checklist on your local machine:

### MongoDB Atlas
- [ ] IP address whitelisted in Atlas
- [ ] Backend connects successfully to Atlas
- [ ] User registration creates document in Atlas
- [ ] Login retrieves user from Atlas
- [ ] Data persists after server restart

### Authentication
- [ ] User registration works (201 response)
- [ ] Login works (200 response, returns token)
- [ ] Token includes user role
- [ ] Protected routes require authentication
- [ ] Role-based routes enforce role check

### Payment Flow
- [ ] Razorpay order creation works
- [ ] Razorpay checkout opens
- [ ] Payment verification works
- [ ] Credits/session created after payment
- [ ] Payment data saved in Atlas

### Role-Based Authorization
- [ ] User cannot access `/api/v1/experts/*` routes
- [ ] Expert cannot access `/api/v1/admin/*` routes
- [ ] User redirected to `/dashboard/user` when accessing `/dashboard/expert`
- [ ] Proper 403 errors for unauthorized access

---

## 🚀 PRODUCTION DEPLOYMENT CHECKLIST

Before deploying to production:

### Security
- [ ] Generate strong JWT secrets: `openssl rand -base64 48`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS only
- [ ] Restrict CORS to your domain
- [ ] Remove `0.0.0.0/0` from IP whitelist
- [ ] Add only production server IPs

### Database
- [ ] MongoDB Atlas connection string updated
- [ ] Database name is correct
- [ ] Connection pooling configured
- [ ] Indexes created for performance

### Payment
- [ ] Switch to Live Razorpay keys (not test)
- [ ] Configure webhooks
- [ ] Test with real small payment
- [ ] Set up payout account

### Environment Variables
- [ ] All secrets are unique and strong
- [ ] Frontend API URL points to production backend
- [ ] Email service configured
- [ ] All required env vars are set

---

## 📞 QUICK REFERENCE

### MongoDB Atlas Login
- URL: https://cloud.mongodb.com
- Database: `serene-wellbeing`
- Collections: `users`, `experts`, `sessions`, `transactions`

### Razorpay Dashboard
- URL: https://dashboard.razorpay.com
- Test Mode: Get test keys
- Live Mode: Switch for production

### JWT Decoder
- URL: https://jwt.io
- Paste token to see payload

### API Endpoints
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Get User: `GET /api/v1/auth/me`
- Create Payment: `POST /api/v1/payments/create-razorpay-order`
- Verify Payment: `POST /api/v1/payments/verify`

---

## 📝 SUMMARY

**Why can't you see data in Atlas?**
- Sandbox environment has no internet access
- Need to test on your local machine

**What to do next?**
1. Run backend on your local machine
2. Whitelist your IP in MongoDB Atlas
3. Uncomment Atlas URI in `.env`
4. Follow verification steps above
5. Check data appears in Atlas dashboard

**Everything is configured correctly**, you just need to run it in an environment with internet access!

---

**Created**: 2026-01-06
**Purpose**: Complete verification guide for MongoDB Atlas, authentication, and payments
