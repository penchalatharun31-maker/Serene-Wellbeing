# 🖥️ Complete Localhost Setup Guide

This guide will help you set up and run the complete Serene Wellbeing Hub on your local machine to test all features.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **MongoDB** v7.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Redis** v7.0 or higher ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

### Verify Installation

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
mongod --version # Should show v7.0 or higher
redis-server --version # Should show v7.0 or higher
```

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourrepo/serene-wellbeing.git
cd serene-wellbeing
```

### Step 2: Start MongoDB

**On macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**On Windows:**
```bash
# Navigate to MongoDB bin directory and run:
mongod --dbpath="C:\data\db"
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see MongoDB shell open successfully
# Type 'exit' to close
```

### Step 3: Start Redis

**On macOS (using Homebrew):**
```bash
brew services start redis
```

**On Windows:**
```bash
redis-server
```

**On Linux:**
```bash
sudo systemctl start redis
```

**Verify Redis is running:**
```bash
redis-cli ping
# Should respond with: PONG
```

### Step 4: Configure Backend Environment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your local configuration:
```bash
nano .env  # or use your preferred editor
```

4. Update the following values for **local development**:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/serene-wellbeing

# Redis Configuration (Local Redis)
REDIS_URL=redis://localhost:6379

# JWT Authentication (Use these for testing - CHANGE in production!)
JWT_SECRET=local-dev-jwt-secret-key-min-32-characters-long-12345
JWT_REFRESH_SECRET=local-dev-refresh-secret-key-min-32-characters-long-12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini AI (Get your API key from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-actual-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-exp

# Stripe Payment (Use test keys from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
STRIPE_API_VERSION=2023-10-16

# Email Configuration (Optional for local testing - can leave as is)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Serene Wellbeing <noreply@localhost>

# Frontend URL (Local development)
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting (Relaxed for local testing)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Session Configuration
SESSION_SECRET=local-dev-session-secret-min-32-characters-long
SESSION_DURATION_MINUTES=60
BOOKING_BUFFER_MINUTES=15

# Commission Settings
PLATFORM_COMMISSION_RATE=0.20
EXPERT_PAYOUT_DAY=1

# Notification Settings
NOTIFICATION_REMINDER_HOURS=24

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3000

# Cron Jobs (Disable for local testing to avoid automated tasks)
ENABLE_CRON_JOBS=false

# Security
BCRYPT_ROUNDS=12
HELMET_CSP_ENABLED=false

# Application
APP_NAME=Serene Wellbeing Hub
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@localhost
```

### Step 5: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
npm install
```

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see output like:
```
[INFO] MongoDB connected successfully
[INFO] Redis connected successfully
[INFO] Server running on http://localhost:5000
[INFO] API Version: v1
[INFO] Socket.IO server ready
```

**Keep this terminal window open!**

### Step 7: Configure Frontend Environment

1. Open a **NEW terminal window** and navigate to the project root:
```bash
cd /path/to/serene-wellbeing
```

2. Copy the example environment file:
```bash
cp .env.example .env.development
```

3. Edit `.env.development`:
```bash
nano .env.development
```

4. Update the values for **local development**:

```env
# API Configuration (Local Backend)
VITE_API_URL=http://localhost:5000/api/v1

# Stripe Configuration (Frontend - Use test publishable key)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key

# Analytics (Optional - can be empty for local testing)
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_TAG_MANAGER_ID=

# Sentry (Error Tracking - Optional - can be empty for local testing)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_GROUP_SESSIONS=true

# Application Info
VITE_APP_NAME=Serene Wellbeing Hub
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@localhost
```

### Step 8: Install Frontend Dependencies

```bash
# Make sure you're in the project root directory
npm install
```

### Step 9: Start Frontend Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 10: Access the Application

Open your browser and navigate to:

**Frontend:** [http://localhost:3000](http://localhost:3000)

You should see the Serene Wellbeing Hub landing page! 🎉

## 👤 Creating Test Accounts

### Create a Super Admin Account (Founder Dashboard Access)

1. **Option A: Using MongoDB Shell**

```bash
mongosh serene-wellbeing

db.users.insertOne({
  name: "Admin User",
  email: "admin@localhost.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIVXgKP5Qq", // password: "admin123"
  role: "super_admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  phone: "+1234567890",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

2. **Option B: Using Signup and Manual Database Update**

- Go to [http://localhost:3000/signup](http://localhost:3000/signup)
- Create an account
- Then update the role in MongoDB:

```bash
mongosh serene-wellbeing
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "super_admin", isVerified: true } }
)
```

### Create Test Expert Account

```bash
mongosh serene-wellbeing

db.users.insertOne({
  name: "Dr. Jane Smith",
  email: "expert@localhost.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIVXgKP5Qq", // password: "admin123"
  role: "expert",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=expert",
  phone: "+1234567891",
  isVerified: true,
  bio: "Licensed therapist specializing in anxiety and depression",
  specialties: ["Anxiety", "Depression", "Stress Management"],
  credentials: ["PhD in Psychology", "Licensed Clinical Psychologist"],
  hourlyRate: 150,
  rating: 4.8,
  totalReviews: 127,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Create Test Regular User Account

```bash
mongosh serene-wellbeing

db.users.insertOne({
  name: "John Doe",
  email: "user@localhost.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIVXgKP5Qq", // password: "admin123"
  role: "user",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  phone: "+1234567892",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🧪 Testing All Features

### 1. **Authentication**
- ✅ Signup: [http://localhost:3000/signup](http://localhost:3000/signup)
- ✅ Login: [http://localhost:3000/login](http://localhost:3000/login)

**Test Credentials:**
- Super Admin: `admin@localhost.com` / `admin123`
- Expert: `expert@localhost.com` / `admin123`
- User: `user@localhost.com` / `admin123`

### 2. **User Dashboard** (Login as user@localhost.com)
- ✅ Dashboard: [http://localhost:3000/dashboard/user](http://localhost:3000/dashboard/user)
- ✅ AI Companion: [http://localhost:3000/ai-companion](http://localhost:3000/ai-companion)
- ✅ Mood Tracker: [http://localhost:3000/mood-tracker](http://localhost:3000/mood-tracker)
- ✅ Journal: [http://localhost:3000/journal](http://localhost:3000/journal)
- ✅ Wellness Challenges: [http://localhost:3000/challenges](http://localhost:3000/challenges)
- ✅ Content Library: [http://localhost:3000/content-library](http://localhost:3000/content-library)
- ✅ Browse Experts: [http://localhost:3000/browse](http://localhost:3000/browse)
- ✅ Messages: [http://localhost:3000/messages](http://localhost:3000/messages)

### 3. **Expert Dashboard** (Login as expert@localhost.com)
- ✅ Dashboard: [http://localhost:3000/dashboard/expert](http://localhost:3000/dashboard/expert)
- ✅ Bookings: [http://localhost:3000/dashboard/expert/bookings](http://localhost:3000/dashboard/expert/bookings)
- ✅ Availability: [http://localhost:3000/dashboard/expert/availability](http://localhost:3000/dashboard/expert/availability)
- ✅ Earnings: [http://localhost:3000/dashboard/expert/earnings](http://localhost:3000/dashboard/expert/earnings)

### 4. **Super Admin Dashboard** (Login as admin@localhost.com)
- ✅ Dashboard: [http://localhost:3000/dashboard/admin](http://localhost:3000/dashboard/admin)
- ✅ **Founder Metrics**: [http://localhost:3000/dashboard/admin/founder](http://localhost:3000/dashboard/admin/founder) 📊
- ✅ Expert Approvals: [http://localhost:3000/dashboard/admin/experts](http://localhost:3000/dashboard/admin/experts)
- ✅ Companies: [http://localhost:3000/dashboard/admin/companies](http://localhost:3000/dashboard/admin/companies)
- ✅ Commissions: [http://localhost:3000/dashboard/admin/commissions](http://localhost:3000/dashboard/admin/commissions)
- ✅ Payouts: [http://localhost:3000/dashboard/admin/payouts](http://localhost:3000/dashboard/admin/payouts)

### 5. **API Endpoints Testing**

You can test the backend API directly:

```bash
# Health Check
curl http://localhost:5000/api/v1/health

# AI Companion Chat (requires auth token)
curl -X POST http://localhost:5000/api/v1/ai-companion/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "I am feeling anxious today"}'

# Mood Tracking (requires auth token)
curl -X POST http://localhost:5000/api/v1/mood \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"mood": "happy", "intensity": 8, "notes": "Great day!"}'
```

## 🔍 Verifying Everything Works

### Backend Health Check
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-16T...",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ai": "ready"
  }
}
```

### Database Connection
```bash
mongosh serene-wellbeing
db.stats()
```

### Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

## 🛑 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: Run mongod.exe
```

### Redis Connection Issues

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution:**
```bash
# Check if Redis is running
ps aux | grep redis

# Start Redis
# macOS: brew services start redis
# Linux: sudo systemctl start redis
# Windows: redis-server.exe
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process using port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Gemini API Not Working

**Error:** `Google Gemini AI error`

**Solution:**
1. Get your API key from [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Update `backend/.env` with your actual `GEMINI_API_KEY`
3. Restart the backend server

### Frontend Not Connecting to Backend

**Error:** `Network Error` or `CORS Error`

**Solution:**
1. Verify backend is running on `http://localhost:5000`
2. Check `VITE_API_URL=http://localhost:5000/api/v1` in `.env.development`
3. Verify `FRONTEND_URL=http://localhost:3000` in `backend/.env`
4. Clear browser cache and restart both servers

## 📦 Alternative: Quick Start with Root Package Manager

If you want to run everything with a single command:

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run both frontend and backend in development mode
npm run dev
```

This will start both servers concurrently!

## 🎯 What's Next?

Now that you have everything running locally, you can:

1. **Test all features** - Go through each section of the platform
2. **View Founder Metrics** - Login as admin and visit `/dashboard/admin/founder`
3. **Create test data** - Add users, bookings, sessions to see metrics populate
4. **Develop new features** - Make changes and see them live reload
5. **Run tests** - Execute `npm test` in both frontend and backend

## 📚 Additional Resources

- **API Documentation:** Check `backend/src/routes/` for all available endpoints
- **Component Documentation:** Check `components/` and `pages/` for frontend components
- **Database Schema:** Check `backend/src/models/` for all data models

## 💡 Pro Tips

1. **Use MongoDB Compass** - Visual GUI for MongoDB ([Download](https://www.mongodb.com/products/compass))
2. **Use Redis Insight** - Visual GUI for Redis ([Download](https://redis.com/redis-enterprise/redis-insight/))
3. **Use Postman** - Test API endpoints easily ([Download](https://www.postman.com/downloads/))
4. **Browser DevTools** - Use React DevTools extension for debugging

---

**Need Help?** Check the main [README.md](README.md) or create an issue on GitHub.

**Happy Testing! 🚀**
