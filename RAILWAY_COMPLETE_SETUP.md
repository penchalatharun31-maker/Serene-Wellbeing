# 🚀 RAILWAY CONFIGURATION - COMPLETE SETUP GUIDE

## Your Setup (Confirmed):
- **Frontend**: `mellow-solace-production.up.railway.app`
- **Backend**: `serene-wellbeing-production-d8f0.up.railway.app`
- **Both deployed on Railway** ✅

---

## 🔧 STEP 1: Configure BACKEND (Serene-Wellbeing Service)

### In Railway Dashboard → Serene-Wellbeing → Variables:

Add/Update these variables:

```bash
# Razorpay Configuration (YOU SAID YOU ADDED - VERIFY EXACT FORMAT)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
RAZORPAY_WEBHOOK_SECRET=ZZZZZZZZZZZZZZZZ

# CORS Configuration (CRITICAL - ADD IF MISSING)
FRONTEND_URL=https://mellow-solace-production.up.railway.app
ALLOWED_ORIGINS=https://mellow-solace-production.up.railway.app,http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing

# JWT Secrets
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars

# Other Required
PORT=5000
NODE_ENV=production
API_VERSION=v1
```

**⚠️ CRITICAL**: The `FRONTEND_URL` and `ALLOWED_ORIGINS` MUST match your frontend Railway domain exactly.

**After adding/updating variables, Railway will auto-redeploy** (wait for deployment to complete)

---

## 🔧 STEP 2: Configure FRONTEND (mellow-solace Service)

### In Railway Dashboard → mellow-solace → Variables:

Add/Update these variables:

```bash
# Backend API URL (POINTS TO YOUR BACKEND RAILWAY SERVICE)
VITE_API_URL=https://serene-wellbeing-production-d8f0.up.railway.app/api/v1

# Razorpay Key (SAME KEY AS BACKEND - FRONTEND NEEDS THIS TOO)
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX

# Optional but recommended
VITE_APP_NAME=Serene Wellbeing Hub
VITE_DEBUG=false
```

**⚠️ CRITICAL**:
1. `VITE_API_URL` must point to your backend Railway service
2. `VITE_RAZORPAY_KEY_ID` must be the SAME real Razorpay key (not placeholder)

**After adding/updating variables, trigger a redeploy:**
- Railway → mellow-solace → Deployments → Click "Deploy" button

---

## ✅ VERIFICATION CHECKLIST

### Backend Variables (Serene-Wellbeing):
- [ ] `RAZORPAY_KEY_ID` starts with `rzp_test_` or `rzp_live_`
- [ ] `RAZORPAY_KEY_SECRET` exists and is not placeholder
- [ ] `FRONTEND_URL=https://mellow-solace-production.up.railway.app`
- [ ] `ALLOWED_ORIGINS` includes frontend domain
- [ ] `MONGODB_URI` is set (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` is set
- [ ] Service shows "Online" status

### Frontend Variables (mellow-solace):
- [ ] `VITE_API_URL=https://serene-wellbeing-production-d8f0.up.railway.app/api/v1`
- [ ] `VITE_RAZORPAY_KEY_ID` matches backend's RAZORPAY_KEY_ID
- [ ] Service shows "Online" status
- [ ] Latest deployment successful

---

## 🧪 TEST THE CONNECTION

### Test 1: Backend Health (From Browser)
Open: `https://serene-wellbeing-production-d8f0.up.railway.app/api/v1/health`

**Expected Response:**
```json
{"success":true,"status":"healthy","timestamp":"...","uptime":123}
```

### Test 2: Frontend Can Reach Backend
1. Open your frontend: `https://mellow-solace-production.up.railway.app`
2. Press F12 (open console)
3. Run this:
```javascript
fetch('https://serene-wellbeing-production-d8f0.up.railway.app/api/v1')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected:', d))
  .catch(e => console.error('❌ Failed:', e));
```

**Expected:** `✅ Backend connected: {success: true, message: "Serene Wellbeing API", ...}`

### Test 3: Check Environment Variables
On your frontend (F12 console):
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);
```

**Expected:**
```
API URL: https://serene-wellbeing-production-d8f0.up.railway.app/api/v1
Razorpay Key: rzp_test_XXXXXXXXXXXXX (14 characters after rzp_test_)
```

### Test 4: Try Booking a Session
1. Login to frontend
2. Browse experts
3. Try to book session
4. Check if Razorpay modal opens
5. If it fails, check browser console for exact error

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "Network Error" When Booking
**Cause**: Frontend can't reach backend (CORS issue)

**Fix**:
1. Verify backend has `ALLOWED_ORIGINS=https://mellow-solace-production.up.railway.app`
2. Redeploy backend after adding
3. Check Railway logs for CORS errors

### Issue 2: "Razorpay Configuration Missing"
**Cause**: Frontend doesn't have `VITE_RAZORPAY_KEY_ID`

**Fix**:
1. Add `VITE_RAZORPAY_KEY_ID` to frontend Railway variables
2. Redeploy frontend
3. Verify with console: `console.log(import.meta.env.VITE_RAZORPAY_KEY_ID)`

### Issue 3: Razorpay Modal Opens But Payment Fails
**Cause**: Backend Razorpay secret wrong or payment verification failing

**Fix**:
1. Check Railway backend logs (Deployments → View Logs)
2. Look for "Razorpay" errors
3. Verify `RAZORPAY_KEY_SECRET` is correct
4. Ensure frontend and backend use SAME `RAZORPAY_KEY_ID`

### Issue 4: "Payment Verification Failed"
**Cause**: Razorpay signature mismatch

**Fix**:
1. Backend `RAZORPAY_KEY_SECRET` must match the secret from Razorpay dashboard
2. Get keys from: https://dashboard.razorpay.com/app/keys
3. Copy BOTH Key ID and Key Secret together (they're a pair)

---

## 📊 RAILWAY LOGS - HOW TO CHECK

### Backend Logs:
1. Railway → Serene-Wellbeing service
2. Click "Deployments" tab
3. Click latest deployment
4. Click "View Logs"
5. Look for errors mentioning:
   - "Razorpay"
   - "CORS"
   - "MongoDB"
   - "Payment"

### Frontend Logs:
1. Railway → mellow-solace service
2. Click "Deployments" tab
3. Click latest deployment
4. Check for build errors

---

## 🎯 NEXT STEPS (Do in Order)

1. **Go to Railway Dashboard** (you're already there)

2. **Open Serene-Wellbeing service (backend)**
   - Click "Variables" tab
   - Verify `FRONTEND_URL` exists and = `https://mellow-solace-production.up.railway.app`
   - If missing, add it
   - If wrong, fix it

3. **Open mellow-solace service (frontend)**
   - Click "Variables" tab
   - Verify `VITE_API_URL` exists and = `https://serene-wellbeing-production-d8f0.up.railway.app/api/v1`
   - Verify `VITE_RAZORPAY_KEY_ID` exists and is NOT `rzp_test_1234567890`
   - If missing/wrong, add/fix them
   - Click "Deploy" to trigger redeploy

4. **Wait for both services to show "Online"**

5. **Test connection using Test 2 above**

6. **Try booking a session**

7. **If still fails, send me:**
   - Screenshot of backend Variables tab
   - Screenshot of frontend Variables tab
   - Screenshot of browser console errors (F12)

---

## 💡 PRO TIP

Railway services can reference each other! Instead of hardcoding URLs:

**In mellow-solace (frontend) variables, you could use:**
```bash
VITE_API_URL=${{Serene-Wellbeing.RAILWAY_PUBLIC_DOMAIN}}/api/v1
```

But for now, hardcoded URL works fine.

---

## ✅ SUCCESS INDICATORS

When everything works, you should see:
- ✅ Backend returns health status
- ✅ Frontend console shows no CORS errors
- ✅ Login/signup works
- ✅ Experts list loads
- ✅ Session booking modal opens
- ✅ Razorpay modal opens (pop-up with payment options)
- ✅ Test payment succeeds
- ✅ Session appears in dashboard

---

**Once you've added the variables, tell me and I'll help you verify everything is connected!**
