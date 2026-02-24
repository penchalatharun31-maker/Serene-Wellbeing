# 🚀 Quick Start Guide - Serene Wellbeing Hub

**For Developers:** Get up and running in 10 minutes

---

## ⚡ Fastest Setup (Docker - Recommended)

### Prerequisites
- Docker Desktop installed
- Git installed

### Steps

```bash
# 1. Clone repository
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
cd Serene-Wellbeing

# 2. Configure environment (copy and edit)
cp .env.docker .env

# 3. Start everything with one command
docker-compose -f docker-compose.dev.yml up

# Done! Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - MongoDB UI: http://localhost:8081 (admin/admin)
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed (or use MongoDB Atlas)
- Git installed

### Backend Setup (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.development

# 4. Edit .env.development - REQUIRED FIELDS:
nano .env.development
# Add:
# - MONGODB_URI=mongodb://localhost:27017/serene-wellbeing
# - JWT_SECRET=your-secret-key-minimum-32-chars
# - GEMINI_API_KEY=your-gemini-key
# - STRIPE_SECRET_KEY=sk_test_your_key

# 5. Start development server
npm run dev

# ✅ Backend running on http://localhost:5000
```

### Frontend Setup (2 minutes)

```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.development

# 4. Edit .env.development
nano .env.development
# Add:
# - VITE_API_URL=http://localhost:5000

# 5. Start development server
npm run dev

# ✅ Frontend running on http://localhost:3000
```

---

## 🧪 Verify Setup

### Test Backend
```bash
# Health check
curl http://localhost:5000/api/v1/health

# Expected response:
# {"success":true,"data":{"status":"ok","timestamp":"..."}}
```

### Test Frontend
Open browser to `http://localhost:3000` - you should see the landing page

### Test Full Stack
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create a test account
4. Login

---

## 🔑 Required API Keys

### 1. Google Gemini AI (Required)
- Get key: https://aistudio.google.com/app/apikey
- Free tier: 60 requests per minute
- Add to backend `.env`: `GEMINI_API_KEY=your-key`

### 2. Stripe (Required for payments)
- Dashboard: https://dashboard.stripe.com/test/apikeys
- Get test keys (start with `sk_test_`)
- Backend `.env`: `STRIPE_SECRET_KEY=sk_test_...`
- Frontend `.env`: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

### 3. Razorpay (Optional - for India payments)
- Dashboard: https://dashboard.razorpay.com/app/keys
- Add to backend `.env`

### 4. MongoDB (Required)
**Option A - Local:**
```bash
# Install MongoDB
brew install mongodb-community  # Mac
# or
sudo apt install mongodb        # Linux

# Start MongoDB
mongod --dbpath /data/db

# Use in .env: MONGODB_URI=mongodb://localhost:27017/serene-wellbeing
```

**Option B - Cloud (Recommended):**
- Create free cluster: https://www.mongodb.com/cloud/atlas
- Get connection string
- Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing`

---

## 📋 Essential Commands

### Development
```bash
# Backend
cd backend
npm run dev          # Start with hot reload
npm test             # Run tests
npm run lint         # Check code

# Frontend
cd frontend
npm run dev          # Start with hot reload
npm test             # Run tests
npm run build        # Build for production
```

### Docker
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build
```

### Database
```bash
# Connect to MongoDB (if local)
mongosh serene-wellbeing

# View collections
show collections

# Query users
db.users.find().pretty()
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env:
PORT=5001
```

### MongoDB connection failed
```bash
# Check MongoDB is running
mongosh

# If not running:
mongod --dbpath /data/db

# Or use MongoDB Atlas (cloud)
```

### Module not found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Backend
cd backend
npm run build:clean

# Frontend
cd frontend
rm -rf dist
npm run build
```

---

## 🎯 Testing Checklist

After setup, test these features:

- [ ] Backend health check works
- [ ] Frontend loads
- [ ] User registration works
- [ ] User login works
- [ ] Browse experts page loads
- [ ] Session booking modal opens
- [ ] Payment modal opens (test mode)
- [ ] AI companion responds
- [ ] Messaging works
- [ ] Dashboard loads

---

## 📚 Next Steps

1. ✅ Complete setup above
2. 📖 Read `DEVELOPER_HANDOFF.md` for complete documentation
3. 🧪 Run tests: `npm test` in both backend and frontend
4. 📘 Review API docs: `backend/API_GUIDE.md`
5. 🚀 Deploy: Follow deployment guide in `DEVELOPER_HANDOFF.md`

---

## 🆘 Need Help?

- **Full Documentation:** See `DEVELOPER_HANDOFF.md`
- **API Reference:** See `backend/API_GUIDE.md`
- **Deployment Guide:** See `backend/DEPLOYMENT.md`
- **Issues:** https://github.com/penchalatharun31-maker/Serene-Wellbeing/issues

---

**Quick Start Version:** 1.0.0
**Last Updated:** February 24, 2026
