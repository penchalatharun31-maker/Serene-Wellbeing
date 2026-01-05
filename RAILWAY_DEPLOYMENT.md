# 🚂 Railway Deployment Guide - Serene Wellbeing

Complete guide for deploying Serene Wellbeing to Railway.app

## 📋 Overview

This project requires **TWO separate Railway services**:
1. **Backend Service** - Node.js API server
2. **Frontend Service** - React SPA served via Nginx

---

## 🚀 Quick Setup

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Empty Project"
3. Name it: `serene-wellbeing`

### Step 2: Connect GitHub Repository

1. In your Railway project, click "New"
2. Select "GitHub Repo"
3. Choose: `penchalatharun31-maker/Serene-Wellbeing`
4. Select branch: `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT`

---

## 🔧 Backend Service Configuration

### 1. Create Backend Service

1. Click "New" → "GitHub Repo"
2. Choose your repository
3. Railway will auto-detect the `railway.json` file

### 2. Configure Build Settings

**Build Configuration:**
- **Builder**: Dockerfile
- **Dockerfile Path**: `Dockerfile.backend`
- **Build Command**: (auto-detected)

**Deploy Configuration:**
- **Start Command**: `node dist/server.js`
- **Health Check Path**: `/api/v1/health`
- **Port**: Auto-assigned (Railway provides $PORT)

### 3. Set Environment Variables

Go to your backend service → Variables → Add all:

```bash
# Database
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_redis_connection_string

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Payment Gateways
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=noreply@serene-wellbeing.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Application URLs
FRONTEND_URL=${{Serene-Frontend.url}}
BACKEND_URL=${{Serene-Backend.url}}

# Environment
NODE_ENV=production
PORT=${{PORT}}

# Security
CORS_ORIGIN=${{Serene-Frontend.url}}
COOKIE_DOMAIN=.railway.app

# Optional Features
ENABLE_LOGGING=true
LOG_LEVEL=info
```

**Important Notes:**
- Replace `your_*` values with actual credentials
- `${{SERVICE_NAME.url}}` references other Railway services
- `${{PORT}}` is auto-provided by Railway

---

## 🎨 Frontend Service Configuration

### 1. Create Frontend Service

1. In the same Railway project, click "New" → "GitHub Repo"
2. Choose the same repository
3. **Important**: You'll need to configure this service separately

### 2. Configure Build Settings

**Root Directory:** `/` (project root)

**Build Configuration:**
- **Builder**: Dockerfile
- **Dockerfile Path**: `Dockerfile.frontend`
- **Build Command**: `npm run build`

**Deploy Configuration:**
- **Start Command**: `nginx -g 'daemon off;'`
- **Health Check Path**: `/`
- **Port**: 80 (Nginx default)

### 3. Set Environment Variables

Go to your frontend service → Variables → Add all:

```bash
# Backend API URL (references Railway backend service)
VITE_API_URL=${{Serene-Backend.url}}

# Payment Gateway (Public Keys Only)
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# Application Info
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@serene-wellbeing.com

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_TAG_MANAGER_ID=

# Error Tracking (Optional)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=production
```

**Important:**
- Only use `VITE_` prefix variables in frontend
- Never expose secret keys in frontend
- `${{Serene-Backend.url}}` references your backend service

---

## 🔗 Service Naming Convention

Recommended service names in Railway:
- Backend: `Serene-Backend`
- Frontend: `Serene-Frontend`

This allows you to reference them in environment variables:
- `${{Serene-Backend.url}}`
- `${{Serene-Frontend.url}}`

---

## ✅ Post-Deployment Checklist

### 1. Verify Backend Deployment

```bash
# Check health endpoint
curl https://your-backend-url.railway.app/api/v1/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-05T04:00:00.000Z",
  "uptime": 123.45,
  "database": "connected"
}
```

### 2. Verify Frontend Deployment

```bash
# Check frontend loads
curl -I https://your-frontend-url.railway.app/

# Expected response:
HTTP/1.1 200 OK
Content-Type: text/html
...
```

### 3. Test End-to-End Flow

1. Open frontend URL in browser
2. Go to `/onboarding`
3. Complete steps 1-5 (signup)
4. Test booking and payment flow
5. Verify Razorpay integration works

---

## 🐛 Troubleshooting

### Backend "Application failed to respond"

**Possible causes:**
1. **Missing environment variables**
   - Check all required vars are set
   - Verify MongoDB URI is correct
   - Test database connection

2. **Build failure**
   - Check Railway build logs
   - Verify Dockerfile.backend exists
   - Ensure package.json has correct scripts

3. **Health check failing**
   - Verify `/api/v1/health` endpoint works
   - Check health check timeout (100s)
   - Review backend logs for errors

**Fix:**
```bash
# View logs in Railway dashboard
Railway Dashboard → Backend Service → Deployments → View Logs

# Common fixes:
1. Add missing env vars
2. Increase health check timeout
3. Check MongoDB connection string
4. Verify PORT is using ${{PORT}}
```

### Frontend "Application failed to respond"

**Possible causes:**
1. **Build errors**
   - Missing dependencies
   - TypeScript errors
   - Environment variable issues

2. **Nginx configuration**
   - nginx.conf syntax error
   - Wrong port configuration
   - Missing index.html

3. **CORS errors**
   - Backend CORS not configured for frontend URL
   - Wrong VITE_API_URL

**Fix:**
```bash
# Check build logs
Railway Dashboard → Frontend Service → Deployments → View Logs

# Verify environment variables
1. Ensure VITE_API_URL points to backend
2. Check VITE_RAZORPAY_KEY_ID is set
3. Rebuild if vars changed during build

# Test locally first:
npm run build
npm run preview  # Should work without errors
```

### CORS Errors

**Symptoms:** Frontend can't connect to backend API

**Fix:**
1. Backend `.env`:
   ```bash
   CORS_ORIGIN=${{Serene-Frontend.url}}
   FRONTEND_URL=${{Serene-Frontend.url}}
   ```

2. If using custom domain, update CORS to include it:
   ```bash
   CORS_ORIGIN=https://serene-wellbeing.com,https://www.serene-wellbeing.com
   ```

### Database Connection Errors

**Symptoms:** Backend crashes with MongoDB errors

**Fix:**
1. Verify MongoDB Atlas allows Railway IP addresses
   - Atlas → Network Access → Add IP: `0.0.0.0/0` (all IPs)
   - Or add Railway's specific IP range

2. Check connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

3. Ensure database user has correct permissions

---

## 🔄 Redeployment

### Automatic Deployments

Railway auto-deploys when you push to the configured branch:

```bash
# Make changes locally
git add .
git commit -m "fix: your changes"
git push origin claude/production-deploy-015ntgtxbopumD2TQiYsgTyT
```

Railway will:
1. Detect the push
2. Build both services
3. Deploy if build succeeds
4. Run health checks

### Manual Redeploy

If you need to trigger a manual redeploy:

1. Go to Railway Dashboard
2. Select service (Backend or Frontend)
3. Click "Deployments"
4. Click "Redeploy" on latest deployment

---

## 📊 Monitoring

### View Logs

```bash
# Railway Dashboard
Service → Deployments → View Logs

# Or use Railway CLI:
railway logs --service backend
railway logs --service frontend
```

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request count
- Response times

Access via: Service → Metrics

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Railway Dashboard → Service → Settings
2. Scroll to "Domains"
3. Click "Add Domain"
4. Enter your domain: `app.serene-wellbeing.com`
5. Add CNAME record in your DNS:
   ```
   CNAME  app  your-service.railway.app
   ```

### SSL Certificate

Railway automatically provisions SSL certificates for:
- `*.railway.app` domains (automatic)
- Custom domains (after DNS verification)

---

## 💰 Cost Estimation

Railway pricing (as of 2026):
- **Hobby Plan**: $5/month per service
- **Pro Plan**: $20/month + usage

For this project (2 services):
- Estimated: $10-50/month depending on traffic
- Free tier: $5 credit/month (hobby projects)

---

## 🆘 Support

If you encounter issues:

1. **Check Railway Status**: https://status.railway.app
2. **Railway Docs**: https://docs.railway.app
3. **Railway Discord**: https://discord.gg/railway
4. **GitHub Issues**: [Your repo issues page]

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Templates](https://railway.app/templates)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated**: January 2026
**Maintained by**: Serene Wellbeing Team
