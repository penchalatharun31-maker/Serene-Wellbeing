# Serene Wellbeing - Complete Setup & Run Guide

This repository contains both the **frontend** (React) and **backend** (Node.js API) for the Serene Wellbeing Hub platform.

## 📁 Repository Structure

```
Serene-Wellbeing/
├── frontend/          # React + TypeScript + Vite (existing)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js + Express + TypeScript (new)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── README.md         # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have installed:
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

## 📦 Installation & Setup

### Step 1: Clone Repository (if not already cloned)

```bash
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
cd Serene-Wellbeing
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `backend/.env` file** with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database - Choose ONE option:

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/serene-wellbeing

# Option 2: MongoDB Atlas (recommended)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-token-secret-at-least-32-characters

# Google Gemini AI (REQUIRED)
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Stripe (use test keys for development)
# Get keys from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (for testing, use Mailtrap or Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Serene Wellbeing <noreply@serenewellbeing.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
```

**Edit `frontend/.env.local` file**:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api/v1

# Stripe Publishable Key (same as backend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Google Gemini API Key (same as backend)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

## ▶️ Running the Application

You need to run **BOTH** frontend and backend simultaneously in **separate terminal windows**.

### Option 1: Run Separately (Recommended for Development)

#### Terminal 1 - Backend Server

```bash
# From project root
cd backend

# Run in development mode (with auto-reload)
npm run dev

# You should see:
# Server running in development mode on port 5000
# MongoDB Connected: ...
```

Backend will be available at: **http://localhost:5000**

#### Terminal 2 - Frontend Development Server

```bash
# From project root (open new terminal)
cd frontend

# Run development server
npm run dev

# You should see:
# VITE v6.x.x ready in xxx ms
# Local: http://localhost:3000
```

Frontend will be available at: **http://localhost:3000**

### Option 2: Run Both with One Command (Using npm-run-all)

**From project root**, create a `package.json`:

```json
{
  "name": "serene-wellbeing",
  "version": "1.0.0",
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev": "npm-run-all --parallel dev:backend dev:frontend"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

Then run:

```bash
# Install npm-run-all
npm install

# Run both frontend and backend
npm run dev
```

## 🔍 Verify Everything is Working

### 1. Check Backend Health

Open browser or use curl:
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123.45
}
```

### 2. Check Frontend

Open browser: **http://localhost:3000**

You should see the Serene Wellbeing landing page.

### 3. Check Database Connection

Backend logs should show:
```
MongoDB Connected: localhost (or your Atlas cluster)
```

If you see connection errors, verify your `MONGODB_URI` in `.env`.

## 🗄️ Database Setup

### Option A: Local MongoDB

1. **Install MongoDB**:
   - macOS: `brew install mongodb-community`
   - Windows: Download from [MongoDB.com](https://www.mongodb.com/try/download/community)
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**:
   ```bash
   # macOS/Linux
   mongod --dbpath ~/data/db

   # Windows
   mongod --dbpath C:\data\db
   ```

3. **Keep MongoDB running** in a separate terminal

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `MONGODB_URI` in `backend/.env`

## 📝 Getting API Keys

### Google Gemini API Key (REQUIRED)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add to both `backend/.env` and `frontend/.env.local`

### Stripe API Keys (for payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create account (use test mode)
3. Go to Developers → API Keys
4. Copy "Publishable key" and "Secret key"
5. Add to `backend/.env` and `frontend/.env.local`

### Email Setup (Gmail example)

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use this password in `backend/.env` as `EMAIL_PASSWORD`

## 🧪 Testing the Integration

### 1. Test User Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Use Frontend

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register a new account
4. Login
5. Browse experts
6. Book a session

## 📂 Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000 |
| MongoDB (local) | 27017 | localhost:27017 |
| Socket.IO | 5000 | ws://localhost:5000 |

## 🛠️ Development Commands

### Backend Commands

```bash
cd backend

# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Backend won't start

**Error**: `Cannot find module 'express'`
```bash
cd backend
npm install
```

**Error**: `MongoNetworkError`
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check network/firewall settings

**Error**: `Port 5000 already in use`
```bash
# Find and kill process using port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend won't start

**Error**: `VITE_API_URL is not defined`
- Create `frontend/.env.local` file
- Add `VITE_API_URL=http://localhost:5000/api/v1`

**Error**: `Cannot connect to backend`
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in `.env.local`
- Verify CORS settings

### Database Issues

**Error**: `Authentication failed`
- Check MongoDB username/password in connection string
- Verify IP whitelist in MongoDB Atlas

**Error**: `Collection not found`
- Collections are created automatically
- Make sure you connected to correct database

### API Integration Issues

**CORS errors in browser**
- Backend CORS is configured for `http://localhost:3000`
- Check `FRONTEND_URL` in `backend/.env`

**401 Unauthorized**
- Check if you're sending the JWT token
- Verify token is not expired
- Re-login to get fresh token

## 📊 Monitoring

### View Backend Logs

```bash
cd backend

# Real-time logs
npm run dev

# Production logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Check Database

```bash
# Connect to MongoDB
mongosh

# Switch to database
use serene-wellbeing

# View collections
show collections

# View users
db.users.find().pretty()
```

## 🚀 Production Deployment

See `backend/DEPLOYMENT.md` for detailed deployment instructions.

Quick overview:
1. Build both frontend and backend
2. Deploy backend to server (AWS, DigitalOcean, Railway, etc.)
3. Deploy frontend to CDN (Vercel, Netlify, etc.)
4. Update environment variables for production
5. Use MongoDB Atlas for database
6. Enable SSL/HTTPS

## 📚 Additional Resources

- **Backend API Documentation**: See `backend/API_GUIDE.md`
- **Backend README**: See `backend/README.md`
- **Deployment Guide**: See `backend/DEPLOYMENT.md`
- **Implementation Summary**: See `BACKEND_IMPLEMENTATION_SUMMARY.md`

## 🆘 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review the troubleshooting section above
3. Check if all environment variables are set
4. Verify all services are running (MongoDB, Backend, Frontend)
5. Check logs in `backend/logs/` directory
6. Review API documentation in `backend/API_GUIDE.md`

## 📞 Support

For issues:
- Check documentation files
- Review error logs
- Verify environment configuration

---

## Quick Reference Card

```bash
# Start Everything (3 terminals)

# Terminal 1: MongoDB (if local)
mongod

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev

# Access Application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/v1
# Health Check: http://localhost:5000/api/v1/health
```

**Happy Coding! 🎉**
