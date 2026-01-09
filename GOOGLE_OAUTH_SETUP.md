# 🔐 Google OAuth 2.0 Setup Guide

Complete guide to configure Google Sign-In for Serene Wellbeing Platform.

---

## ✅ What Was Implemented

### Backend Changes:
1. **New Controller**: `backend/src/controllers/googleAuth.controller.ts`
   - `getGoogleAuthUrl()` - Generates Google OAuth URL
   - `handleGoogleCallback()` - Handles OAuth callback and creates/logins users
   - `verifyGoogleToken()` - Alternative flow for frontend-managed tokens

2. **New Routes**: Added to `backend/src/routes/auth.routes.ts`
   - `GET /api/v1/auth/google` - Get OAuth URL
   - `GET /api/v1/auth/google/callback` - OAuth callback endpoint
   - `POST /api/v1/auth/google/verify` - Verify Google ID token

3. **Environment Variables**: Added to `backend/.env.example`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`

### Frontend Changes:
1. **New Page**: `pages/GoogleOAuthCallback.tsx`
   - Handles redirect from Google
   - Extracts tokens and completes login

2. **Updated Components**:
   - `pages/Login.tsx` - Real Google OAuth button
   - `pages/Signup.tsx` - Real Google OAuth button with role support
   - `App.tsx` - Added OAuth callback route

---

## 🚀 Setup Instructions

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Create/Select Project**:
   - Create a new project or select existing one
   - Name it "Serene Wellbeing" or similar

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: "Serene Wellbeing Web Client"

5. **Configure Authorized URIs**:

   **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5173
   https://your-frontend-domain.vercel.app
   ```

   **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/v1/auth/google/callback
   https://your-backend.railway.app/api/v1/auth/google/callback
   ```

6. **Copy Credentials**:
   - Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - Copy the **Client Secret**

---

### Step 2: Configure Backend Environment Variables

#### Development (`.env`):
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

#### Production (Railway):
Set these in your Railway dashboard:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/v1/auth/google/callback
FRONTEND_URL=https://your-frontend.vercel.app
```

---

### Step 3: Configure Frontend Environment Variables

#### Development (`.env.development`):
```bash
# Already configured - no changes needed
VITE_API_URL=http://localhost:5000/api/v1
```

#### Production (Vercel):
```bash
# Already configured - no changes needed
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## 🔄 How It Works

### OAuth Flow Diagram:

```
User clicks "Sign in with Google"
         ↓
Frontend calls: GET /api/v1/auth/google?role=user
         ↓
Backend generates Google OAuth URL
         ↓
User redirected to Google login page
         ↓
User authorizes application
         ↓
Google redirects to: /api/v1/auth/google/callback?code=xxx
         ↓
Backend exchanges code for access token
         ↓
Backend fetches user info from Google
         ↓
Backend creates/finds user in MongoDB
         ↓
Backend generates JWT tokens
         ↓
Backend redirects to: frontend/#/auth/google/callback?token=xxx&role=xxx
         ↓
Frontend extracts tokens and logs user in
         ↓
User redirected to dashboard based on role
```

---

## 🎯 User Experience

### For B2C Users (role='user'):
1. Click "Sign in with Google" on Login page
2. Authorize with Google account
3. Automatically redirected to `/dashboard/user`
4. No password needed - seamless login

### For Experts (role='expert'):
1. Click "Sign in with Google" on Signup page (with role=expert)
2. Authorize with Google account
3. Account created but **`isActive=false`** (requires admin approval)
4. Redirected to "Under Review" page

### For Companies (role='company'):
1. Click "Sign in with Google" on Signup page (with role=company)
2. Authorize with Google account
3. Redirected to `/company-onboarding` to complete profile

---

## 🔒 Security Features

1. **State Parameter**: Passes role through OAuth state to prevent tampering
2. **Token Verification**: Backend verifies Google tokens before creating sessions
3. **JWT Tokens**: Uses your existing JWT system for session management
4. **Email Verification**: Google-authenticated emails automatically verified
5. **No Password Storage**: OAuth users don't need passwords

---

## 🧪 Testing

### Local Testing (Development):

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Login Flow**:
   - Go to: http://localhost:5173/#/login
   - Click "Sign in with Google"
   - Should redirect to Google OAuth
   - After authorization, should return to dashboard

### Production Testing:

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Update Google OAuth credentials with production URLs
4. Test complete flow

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Make sure the callback URL in your Google OAuth credentials EXACTLY matches:
```
http://localhost:5000/api/v1/auth/google/callback  (development)
https://your-backend.railway.app/api/v1/auth/google/callback  (production)
```

### Error: "Google OAuth not configured"
**Solution**: Check that environment variables are set correctly:
```bash
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
```

### Error: "Authentication failed"
**Solution**: Check backend logs for detailed error message:
```bash
# Backend will log specific OAuth errors
```

### Google button not working
**Solution**: Check browser console for errors. Make sure VITE_API_URL is set correctly.

---

## 📱 Mobile/Social Login Support

The same OAuth flow works for:
- Desktop browsers
- Mobile browsers
- Can be extended to mobile apps using app-specific redirect URIs

Future enhancements:
- Apple Sign-In
- Facebook Login
- Microsoft/LinkedIn OAuth

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Google Cloud Project created
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs configured
- [ ] Backend environment variables set
- [ ] Frontend can reach backend API
- [ ] Test login flow in development
- [ ] Test signup flow with different roles
- [ ] Production URLs configured in Google Console
- [ ] Production environment variables set
- [ ] Test end-to-end flow in production

---

## 🎓 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Best Practices](https://oauth.net/2/)

---

**Your platform now supports enterprise-grade Google Sign-In! 🚀**
