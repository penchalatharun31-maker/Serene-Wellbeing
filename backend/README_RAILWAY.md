# Backend Deployment to Railway

## 🎯 Quick Deploy

### Prerequisites
- Railway account
- MongoDB Atlas URI
- Google Gemini API key

### Deploy Now

#### Option 1: GitHub (Recommended)
1. Push code: `git push`
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub → Select this repo
4. Set Root Directory: `/backend`
5. Add environment variables (see below)

#### Option 2: Railway CLI
```bash
cd backend
railway login
railway init
railway add redis
railway up
```

---

## 📋 Required Environment Variables

Set these in Railway Dashboard → Variables:

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing

# Redis (auto-filled if using Railway Redis addon)
REDIS_URL=redis://default:password@redis.railway.app:6379

# JWT Secrets (generate: openssl rand -base64 64)
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
SESSION_SECRET=<generated-secret>

# AI
GEMINI_API_KEY=<your-key>
GEMINI_MODEL=gemini-2.0-flash-exp

# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Frontend (update after frontend deployment)
FRONTEND_URL=https://your-frontend.up.railway.app
```

---

## ✅ Validation

Before deploying, run:
```bash
./validate-deployment.sh
```

This checks:
- ✅ All required files exist
- ✅ Dockerfile is valid
- ✅ railway.json is configured
- ✅ Dependencies are installed

---

## 🧪 Testing

After deployment:
```bash
# Test health endpoint
curl https://YOUR-URL.up.railway.app/api/v1/health

# Expected response:
# {"status":"healthy","services":{"database":"connected","redis":"connected"}}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Root Directory is `/backend` |
| Health check timeout | Verify all env vars are set |
| MongoDB error | Allow `0.0.0.0/0` in MongoDB Atlas |
| Redis error | Add Railway Redis addon |

View logs:
```bash
railway logs
```

---

## 📂 Project Structure

```
backend/
├── src/              # TypeScript source code
├── dist/             # Compiled JavaScript (generated)
├── Dockerfile        # Docker configuration
├── railway.json      # Railway deployment config
├── railway.toml      # Alternative Railway config
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── validate-deployment.sh  # Pre-deployment validation
```

---

## 🔧 Configuration Files

### railway.json
Configures Docker build and health checks for Railway.

### Dockerfile
Multi-stage build:
1. Builder stage: Compiles TypeScript
2. Production stage: Runs compiled JavaScript

### package.json
Scripts:
- `build`: Compile TypeScript to JavaScript
- `start`: Run production server
- `dev`: Run development server with hot reload

---

## 🚀 Deployment Process

Railway automatically:
1. Detects `railway.json` or `railway.toml`
2. Builds Docker image using `Dockerfile`
3. Runs health check at `/api/v1/health`
4. Exposes service on generated URL
5. Auto-restarts on failure (up to 10 times)

---

## 📊 Monitoring

### View Metrics
Railway Dashboard → Backend Service → Metrics

### View Logs
```bash
railway logs --follow
```

### Restart Service
```bash
railway restart
```

---

## 🔐 Security

- ✅ Never commit `.env` files
- ✅ Use 64+ character JWT secrets
- ✅ Rotate secrets every 90 days
- ✅ Use test payment keys initially
- ✅ Keep dependencies updated

---

## 📚 Additional Resources

- [Complete Setup Guide](../RAILWAY_COMPLETE_SETUP_GUIDE.md)
- [Quick Start](../RAILWAY_QUICK_START.md)
- [Environment Template](../railway-env-template.txt)

---

## 🆘 Support

**Need help?**
- Check logs: `railway logs`
- Run validation: `./validate-deployment.sh`
- See [Railway Docs](https://docs.railway.app)

---

**Backend Ready for Production! 🎉**
