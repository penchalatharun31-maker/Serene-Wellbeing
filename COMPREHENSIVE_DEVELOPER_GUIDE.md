# 📖 Comprehensive Developer Guide
## Serene Wellbeing Hub - Complete Developer Documentation

**Version:** 2.0
**Last Updated:** March 10, 2026
**Repository:** https://github.com/penchalatharun31-maker/Serene-Wellbeing

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Quick Start Guide](#quick-start-guide)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure](#project-structure)
6. [Development Workflow](#development-workflow)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Authentication & Authorization](#authentication--authorization)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)
13. [Code Standards & Best Practices](#code-standards--best-practices)
14. [CI/CD Pipeline](#cicd-pipeline)
15. [Performance & Monitoring](#performance--monitoring)
16. [Security Considerations](#security-considerations)

---

## 🎯 Project Overview

### What is Serene Wellbeing Hub?

Serene Wellbeing Hub is a **full-stack mental health and wellness platform** that connects users with licensed mental health professionals. The platform leverages AI (Google Gemini) to provide personalized recommendations, support, and insights.

### Core Features

#### **For Users**
- 🔍 AI-powered expert matching
- 📅 Smart session booking system
- 💬 Real-time chat with experts
- 📊 Progress tracking and analytics
- 💳 Secure payments (Stripe/Razorpay)
- 📚 Wellness resource library
- 🤖 AI companion chatbot
- 📝 Mood tracking and journaling

#### **For Experts**
- 🗓️ Calendar and availability management
- 💰 Automated payouts (80% revenue share)
- 📈 Performance analytics dashboard
- 🤖 AI-powered profile optimization
- ⭐ Review and rating system
- 📝 Session notes with AI summaries

#### **For Companies**
- 👔 Corporate wellness programs (EAP)
- 📊 Employee usage analytics
- 💼 Bulk credit management
- 🔐 HIPAA-compliant reporting

---

## 🏗️ Architecture & Tech Stack

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                         │
│  React 19 + TypeScript + Vite + Tailwind CSS + Socket.IO    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                        Backend Layer                          │
│     Express.js + TypeScript + Socket.IO + JWT Auth          │
└──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼
    ┌──────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
    │ MongoDB  │ │ Redis  │ │ Stripe │ │ Gemini  │
    │ Database │ │ Cache  │ │   API  │ │   AI    │
    └──────────┘ └────────┘ └────────┘ └─────────┘
```

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 5.8.2 | Type safety |
| **Vite** | 6.2.0 | Build tool & dev server |
| **React Router** | 7.9.6 | Client-side routing |
| **Axios** | 1.7.2 | HTTP client |
| **Socket.IO Client** | 4.7.5 | Real-time communication |
| **Recharts** | 3.5.0 | Data visualization |
| **Lucide React** | - | Icon library |
| **Tailwind CSS** | (inline) | Styling |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥18.0.0 | Runtime environment |
| **Express.js** | 4.19.2 | Web framework |
| **TypeScript** | 5.4.5 | Type safety |
| **MongoDB** | 8.3.0 (Mongoose) | Primary database |
| **Redis** | 5.11.0 | Caching & sessions |
| **Socket.IO** | 4.7.5 | WebSocket server |
| **JWT** | 9.0.2 | Authentication |
| **Stripe** | 15.12.0 | Payment processing |
| **Razorpay** | 2.9.6 | Payment processing (India) |
| **Google Gemini AI** | 0.21.0 | AI features |
| **Nodemailer** | 6.9.13 | Email service |
| **Winston** | 3.13.0 | Logging |
| **Helmet** | 7.1.0 | Security headers |

### DevOps & Tools

- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipelines
- **PM2** - Process management
- **Railway.app** - Deployment platform
- **Jest** - Testing framework
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed:

```bash
# Node.js (v18 or higher)
node --version  # Should be ≥18.0.0

# npm (v9 or higher)
npm --version   # Should be ≥9.0.0

# Git
git --version

# Docker (optional, for containerized setup)
docker --version
docker-compose --version
```

### Installation (5-Minute Setup)

```bash
# 1. Clone the repository
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
cd Serene-Wellbeing

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Setup environment variables
cp backend/.env.example backend/.env.development
cp .env.example .env.development

# Edit the .env files with your credentials
nano backend/.env.development
nano .env.development

# 4. Start the services
# Option A: With Docker (Recommended)
docker-compose -f docker-compose.dev.yml up

# Option B: Manual start
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/v1/health

---

## 🛠️ Development Environment Setup

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.development

# Edit .env.development
nano .env.development
```

#### Required Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/serene-wellbeing
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/serene-wellbeing

# JWT Secrets (Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret-minimum-32-characters

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
# Get from: https://aistudio.google.com/app/apikey

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Razorpay (Optional, for India)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@serenewellbeing.com

# Redis (Optional, for caching)
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=your-session-secret-key
CSRF_SECRET=your-csrf-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Platform Settings
PLATFORM_COMMISSION_RATE=0.20
```

#### Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET

# Generate other secrets
openssl rand -hex 32     # For SESSION_SECRET
```

### Step 2: Frontend Setup

```bash
cd ..  # Back to root directory

# Install frontend dependencies
npm install

# Copy environment template
cp .env.example .env.development

# Edit .env.development
nano .env.development
```

#### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Payment Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_AI_COMPANION=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

### Step 3: Database Setup

#### Option A: MongoDB Atlas (Recommended for Development)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI`

#### Option B: Local MongoDB with Docker

```bash
# Start MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0

# Connection string
MONGODB_URI=mongodb://admin:password@localhost:27017/serene-wellbeing?authSource=admin
```

### Step 4: Redis Setup (Optional but Recommended)

```bash
# Using Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Step 5: Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server starts on http://localhost:5000

# Terminal 2 - Frontend
cd ..
npm run dev
# App starts on http://localhost:3000
```

---

## 📂 Project Structure

```
Serene-Wellbeing/
│
├── backend/                      # Backend API
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── database.ts       # MongoDB connection
│   │   │   ├── redis.ts          # Redis configuration
│   │   │   ├── passport.ts       # OAuth strategies
│   │   │   └── env.validation.ts # Environment validation
│   │   │
│   │   ├── controllers/          # Request handlers (Business Logic)
│   │   │   ├── auth.controller.ts         # Authentication
│   │   │   ├── expert.controller.ts       # Expert management
│   │   │   ├── session.controller.ts      # Session booking
│   │   │   ├── payment.controller.ts      # Payment processing
│   │   │   ├── message.controller.ts      # Real-time messaging
│   │   │   ├── aiCompanion.controller.ts  # AI chatbot
│   │   │   ├── analytics.controller.ts    # Analytics & reporting
│   │   │   ├── admin.controller.ts        # Admin operations
│   │   │   └── ... (15+ more controllers)
│   │   │
│   │   ├── models/               # Database schemas (Mongoose)
│   │   │   ├── User.ts           # User accounts
│   │   │   ├── Expert.ts         # Expert profiles
│   │   │   ├── Session.ts        # Booking sessions
│   │   │   ├── Message.ts        # Chat messages
│   │   │   ├── Transaction.ts    # Payments
│   │   │   ├── Review.ts         # Session reviews
│   │   │   ├── Notification.ts   # User notifications
│   │   │   ├── Company.ts        # Company accounts
│   │   │   └── ... (12+ models)
│   │   │
│   │   ├── routes/               # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── expert.routes.ts
│   │   │   ├── session.routes.ts
│   │   │   └── ... (15+ route files)
│   │   │
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   ├── validation.ts     # Input validation
│   │   │   ├── rateLimiter.ts    # Rate limiting
│   │   │   ├── errorHandler.ts   # Global error handling
│   │   │   ├── csrf.ts           # CSRF protection
│   │   │   └── monitoring.ts     # Performance monitoring
│   │   │
│   │   ├── services/             # Business logic services
│   │   │   ├── gemini.service.ts        # Google AI integration
│   │   │   ├── aiCompanion.service.ts   # AI chatbot logic
│   │   │   ├── moodTracking.service.ts  # Mood analysis
│   │   │   └── cronJobs.ts              # Scheduled tasks
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── logger.ts         # Winston logger
│   │   │   ├── email.ts          # Email sending
│   │   │   ├── jwt.ts            # JWT helpers
│   │   │   ├── errors.ts         # Custom error classes
│   │   │   ├── upload.ts         # File upload handling
│   │   │   └── availabilityHelper.ts  # Schedule helpers
│   │   │
│   │   ├── sockets/              # WebSocket handlers
│   │   │   └── socket.ts         # Socket.IO setup
│   │   │
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── express.d.ts
│   │   │   └── session.d.ts
│   │   │
│   │   ├── __tests__/            # Test files
│   │   │   ├── setup.ts
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   │
│   │   └── server.ts             # Application entry point
│   │
│   ├── .env.example              # Environment template
│   ├── .env.development          # Development config
│   ├── .env.production           # Production config
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── jest.config.js            # Jest configuration
│   ├── Dockerfile                # Docker image
│   ├── README.md                 # Backend docs
│   ├── API_GUIDE.md              # API documentation
│   └── DEPLOYMENT.md             # Deployment guide
│
├── src/                          # Frontend source (legacy structure)
├── components/                   # React components
│   ├── Layout.tsx                # Main layout wrapper
│   ├── ProtectedRoute.tsx        # Auth guard
│   ├── UI.tsx                    # UI component library
│   ├── BookingModal.tsx          # Session booking modal
│   ├── PaymentModal.tsx          # Payment dialog
│   ├── VideoRoom.tsx             # Video call component
│   └── ... (10+ components)
│
├── pages/                        # Page components (Routes)
│   ├── Landing.tsx               # Homepage
│   ├── Login.tsx                 # Login page
│   ├── Signup.tsx                # Registration
│   ├── Browse.tsx                # Browse experts
│   ├── ExpertProfile.tsx         # Expert details
│   ├── Dashboards.tsx            # User dashboard
│   ├── Messages.tsx              # Chat interface
│   ├── AICompanion.tsx           # AI chatbot page
│   ├── MoodTracker.tsx           # Mood tracking
│   ├── Journal.tsx               # User journal
│   ├── Resources.tsx             # Wellness resources
│   └── ... (20+ pages)
│
├── services/                     # API client services
│   ├── api.ts                    # Axios configuration
│   ├── auth.service.ts           # Auth API calls
│   ├── expert.service.ts         # Expert API calls
│   ├── session.service.ts        # Session API calls
│   ├── payment.service.ts        # Payment API calls
│   ├── message.service.ts        # Messaging API calls
│   └── socket.service.ts         # Socket.IO client
│
├── context/                      # React Context (State)
│   └── AuthContext.tsx           # Authentication state
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useExperts.ts
│   ├── useMessages.ts
│   └── useNotifications.ts
│
├── e2e/                          # End-to-end tests
│   └── auth.spec.ts
│
├── .env.example                  # Frontend env template
├── .env.development              # Dev configuration
├── .env.production               # Prod configuration
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Test configuration
├── playwright.config.ts          # E2E test config
├── Dockerfile                    # Frontend Docker image
├── index.html                    # HTML entry
├── App.tsx                       # Root React component
├── index.tsx                     # React entry point
│
├── .github/                      # GitHub configuration
│   └── workflows/
│       ├── backend-ci.yml        # Backend CI/CD
│       ├── frontend-ci.yml       # Frontend CI/CD
│       └── docker-compose.yml    # Docker CI/CD
│
├── docker-compose.yml            # Production Docker setup
├── docker-compose.dev.yml        # Development Docker setup
├── .gitignore                    # Git ignore patterns
├── README.md                     # Main documentation
├── DEVELOPER_HANDOFF.md          # Developer handoff guide
├── COMPREHENSIVE_DEVELOPER_GUIDE.md  # This file
└── ... (various other docs)
```

---

## 🔄 Development Workflow

### Daily Development Process

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Make changes and test**
   ```bash
   # Run tests
   cd backend && npm test
   cd .. && npm test
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**

### Common Development Tasks

#### Adding a New API Endpoint

1. **Define route** in `backend/src/routes/yourResource.routes.ts`
   ```typescript
   router.post('/your-endpoint', auth, controller.yourMethod);
   ```

2. **Create controller** in `backend/src/controllers/yourResource.controller.ts`
   ```typescript
   export const yourMethod = async (req: Request, res: Response) => {
     try {
       // Your logic here
       res.json({ success: true, data: result });
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Add validation** (if needed)
   ```typescript
   export const validateYourEndpoint = [
     body('field').notEmpty().withMessage('Field is required'),
     // More validations
   ];
   ```

4. **Write tests** in `backend/src/__tests__/`

#### Adding a New Frontend Page

1. **Create page component** in `pages/YourPage.tsx`
   ```typescript
   export default function YourPage() {
     return <div>Your content</div>;
   }
   ```

2. **Add route** in `App.tsx`
   ```typescript
   <Route path="/your-page" element={<YourPage />} />
   ```

3. **Create API service** (if needed) in `services/yourService.ts`

4. **Write tests** in `src/__tests__/`

### Code Generation Commands

```bash
# Backend

# Build TypeScript
cd backend && npm run build

# Watch mode (auto-rebuild)
cd backend && npm run dev

# Type checking
cd backend && npm run type-check

# Lint code
cd backend && npm run lint
cd backend && npm run lint:fix

# Frontend

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 📡 API Documentation

### Base URLs

```
Development: http://localhost:5000/api/v1
Production:  https://your-domain.com/api/v1
```

### Authentication

All protected endpoints require a Bearer token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Key API Endpoints Summary

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Auth** | POST | `/auth/register` | Register new user |
| | POST | `/auth/login` | Login user |
| | GET | `/auth/me` | Get current user |
| | POST | `/auth/logout` | Logout user |
| **Experts** | GET | `/experts` | List all experts |
| | GET | `/experts/:id` | Get expert details |
| | POST | `/experts/profile` | Create expert profile |
| | POST | `/experts/recommendations` | Get AI recommendations |
| **Sessions** | POST | `/sessions` | Book a session |
| | GET | `/sessions/user/all` | Get user sessions |
| | POST | `/sessions/:id/cancel` | Cancel session |
| | POST | `/sessions/:id/rate` | Rate session |
| **Payments** | POST | `/payments/create-intent` | Create payment intent |
| | POST | `/payments/confirm` | Confirm payment |
| | POST | `/payments/credits/purchase` | Buy credits |
| **Messages** | POST | `/messages` | Send message |
| | GET | `/messages/conversations` | Get conversations |
| | GET | `/messages/:userId` | Get messages with user |
| **AI** | POST | `/ai-companion/chat` | Chat with AI |
| | GET | `/ai-companion/history` | Get chat history |
| **Analytics** | GET | `/analytics/user` | User analytics |
| | GET | `/analytics/expert` | Expert analytics |
| | GET | `/analytics/admin` | Admin dashboard stats |

### Example API Call

```bash
# Register a new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "user"
  }'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

For complete API documentation, see [backend/API_GUIDE.md](backend/API_GUIDE.md).

---

## 🗄️ Database Schema

### Core Models

#### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'user' | 'expert' | 'company' | 'admin' | 'super_admin',
  avatar?: string,
  phone?: string,
  dateOfBirth?: Date,
  credits: number (default: 0),
  isVerified: boolean,
  status: 'active' | 'inactive' | 'suspended',
  createdAt: Date,
  updatedAt: Date
}
```

#### Expert Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  title: string,
  specialization: string[],
  bio: string,
  experience: number,
  hourlyRate: number,
  rating: number,
  reviewCount: number,
  totalEarnings: number,
  languages: string[],
  certifications: [{
    name: string,
    issuer: string,
    year: number
  }],
  availability: {
    monday: [{ start: string, end: string }],
    tuesday: [...],
    // ... other days
  },
  isApproved: boolean,
  isAcceptingClients: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Session Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  expertId: ObjectId (ref: 'Expert'),
  scheduledDate: Date,
  scheduledTime: string,
  duration: number,
  price: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded',
  paymentStatus: 'pending' | 'paid' | 'refunded',
  paymentIntentId?: string,
  meetingLink?: string,
  notes?: string,
  rating?: number,
  review?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships

```
User (1) ──> (1) Expert
User (1) ──> (many) Sessions
Expert (1) ──> (many) Sessions
User (1) ──> (many) Messages
User (1) ──> (many) Transactions
Expert (1) ──> (many) Reviews
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

```
1. User registers/logs in
   ↓
2. Server generates JWT token (expires in 24h)
   ↓
3. Server generates refresh token (expires in 30d)
   ↓
4. Tokens sent to client
   ↓
5. Client stores tokens (httpOnly cookie or secure storage)
   ↓
6. Client sends JWT in Authorization header for each request
   ↓
7. Server validates JWT
   ↓
8. If expired, client uses refresh token to get new JWT
```

### Role-Based Access Control (RBAC)

```typescript
// Middleware usage
router.get('/admin/stats', auth, authorize('admin', 'super_admin'), controller.getStats);

// Roles hierarchy
super_admin > admin > company > expert > user
```

### OAuth Integration

Supported providers:
- Google OAuth 2.0
- (Can add more: GitHub, Facebook, etc.)

### Password Security

- **Hashing:** bcrypt with 12 rounds
- **Requirements:** Minimum 8 characters, at least one uppercase, one lowercase, one number
- **Reset flow:** Email-based token with 1-hour expiry

---

## 🧪 Testing Strategy

### Backend Testing

#### Unit Tests
```bash
cd backend
npm run test:unit
```

Example test:
```typescript
describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    expect(user.password).not.toBe('password123');
  });
});
```

#### Integration Tests
```bash
cd backend
npm run test:integration
```

Example test:
```typescript
describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
```

#### Running All Tests
```bash
cd backend
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode
npm run type-check       # TypeScript type checking
npm run lint             # Code linting
```

### Frontend Testing

#### Component Tests
```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:ui          # Open Vitest UI
```

#### E2E Tests (Playwright)
```bash
npm run test:e2e         # Run E2E tests
```

Example E2E test:
```typescript
test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});
```

### Test Coverage Goals

- **Unit Tests:** ≥80%
- **Integration Tests:** Key API flows
- **E2E Tests:** Critical user journeys

---

## 🚀 Deployment Guide

### Deployment Options

1. **Railway.app** (Recommended - Easiest)
2. **Docker Compose** (VPS/Cloud)
3. **PM2** (Traditional deployment)

### Option 1: Railway.app Deployment

#### Backend Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Set environment variables in Railway dashboard
# Then deploy
railway up
```

#### Frontend Deployment

```bash
cd ..
railway init
# Set VITE_API_URL to backend Railway URL
railway up
```

### Option 2: Docker Compose Deployment

```bash
# On your VPS
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
cd Serene-Wellbeing

# Configure environment
cp backend/.env.example backend/.env.production
nano backend/.env.production

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 3: PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Build backend
cd backend
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database credentials correct
- [ ] API keys valid
- [ ] SSL certificate configured
- [ ] CORS settings updated
- [ ] Rate limits configured
- [ ] Email service working
- [ ] Payment gateway in production mode
- [ ] Monitoring tools setup
- [ ] Backup strategy in place

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### 2. MongoDB Connection Failed

**Issue:** `MongoServerError: bad auth`

**Solution:**
```bash
# Check MONGODB_URI format
# Correct: mongodb+srv://user:password@cluster.mongodb.net/dbname

# Ensure password is URL-encoded if it contains special characters
# Example: pass@word → pass%40word
```

#### 3. JWT Token Invalid

**Issue:** `JsonWebTokenError: invalid token`

**Solution:**
- Ensure JWT_SECRET matches in backend `.env`
- Check token expiry
- Clear browser cookies/storage
- Generate new token by logging in again

#### 4. CORS Errors

**Issue:** `No 'Access-Control-Allow-Origin' header`

**Solution:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### 5. TypeScript Build Errors

```bash
# Clean build
cd backend
rm -rf dist
npm run build

# Or
npm run build:clean
```

#### 6. Docker Container Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

#### 7. Email Not Sending

**Issue:** Email notifications not working

**Solution:**
- For Gmail, use App-Specific Password
- Enable "Less secure app access" (not recommended) OR use OAuth2
- Check EMAIL_HOST, EMAIL_PORT settings
- Verify EMAIL_USER and EMAIL_PASSWORD

#### 8. Payment Gateway Errors

**Issue:** Stripe payment failing

**Solution:**
- Ensure you're using test keys in development
- Check webhook endpoint is accessible
- Verify webhook secret matches
- Test with Stripe test cards: `4242 4242 4242 4242`

### Debug Mode

```bash
# Backend with debug logs
cd backend
DEBUG=* npm run dev

# Or set LOG_LEVEL in .env
LOG_LEVEL=debug
```

### Getting Help

1. Check existing documentation
2. Search [GitHub Issues](https://github.com/penchalatharun31-maker/Serene-Wellbeing/issues)
3. Check logs: `backend/logs/app.log`
4. Use `npm run health` to check backend status

---

## 📝 Code Standards & Best Practices

### TypeScript Guidelines

```typescript
// ✅ Good - Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good - Use type for unions/intersections
type UserRole = 'user' | 'expert' | 'admin';

// ✅ Good - Explicit return types
function getUser(id: string): Promise<User> {
  return User.findById(id);
}

// ❌ Bad - Using 'any'
function processData(data: any) { // Avoid 'any'
  // ...
}
```

### Naming Conventions

```typescript
// Files: camelCase
userController.ts
authService.ts

// Classes/Interfaces: PascalCase
class UserService {}
interface UserProfile {}

// Variables/Functions: camelCase
const userId = '123';
function getUserById() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
```

### Error Handling

```typescript
// ✅ Good - Use try-catch with specific error handling
try {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
} catch (error) {
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
  } else {
    logger.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### API Response Format

```typescript
// ✅ Success response
{
  "success": true,
  "data": { ... },
  "count": 10,      // For paginated results
  "total": 100,     // Total items
  "page": 1,
  "pages": 10
}

// ✅ Error response
{
  "success": false,
  "error": "ValidationError",
  "message": "Email is required",
  "statusCode": 400,
  "errors": [       // Optional detailed errors
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile update endpoint
fix: resolve JWT token expiry issue
docs: update API documentation
style: format code with prettier
refactor: restructure auth middleware
test: add unit tests for user model
chore: update dependencies
```

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] All tests pass
- [ ] No console.logs (use logger instead)
- [ ] Error handling is comprehensive
- [ ] Input validation is present
- [ ] Security considerations addressed
- [ ] Documentation updated
- [ ] No hardcoded credentials
- [ ] Performance implications considered

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

Located in `.github/workflows/`:

1. **backend-ci.yml** - Backend testing and deployment
2. **frontend-ci.yml** - Frontend testing and deployment
3. **docker-compose.yml** - Docker build and push

### CI/CD Flow

```
Push to GitHub
   ↓
GitHub Actions triggered
   ↓
1. Install dependencies
   ↓
2. Run linting
   ↓
3. Run tests
   ↓
4. Build application
   ↓
5. Deploy to Railway/Docker Registry
   ↓
6. Run health checks
   ↓
Done ✅
```

### Manual Deployment

```bash
# Backend
cd backend
npm run prepare:prod    # Build, lint, test
npm run start:prod      # Start production server

# Frontend
npm run build           # Build for production
npm run preview         # Preview build
```

---

## 📊 Performance & Monitoring

### Backend Performance

#### Caching Strategy

```typescript
// Redis caching example
import redis from './config/redis';

// Cache expert list
const cacheKey = 'experts:list:page:1';
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const experts = await Expert.find().limit(12);
await redis.setex(cacheKey, 3600, JSON.stringify(experts)); // Cache for 1 hour
```

#### Database Optimization

```typescript
// ✅ Good - Use indexes
expertSchema.index({ specialization: 1, rating: -1 });
expertSchema.index({ 'userId': 1 });

// ✅ Good - Use lean() for read-only queries
const experts = await Expert.find().lean();

// ✅ Good - Pagination
const page = 1;
const limit = 12;
const experts = await Expert.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### Monitoring Tools

- **Winston** - Application logging
- **PM2** - Process monitoring
- **MongoDB Atlas** - Database monitoring
- **Railway** - Application metrics

### Logging

```typescript
import logger from './utils/logger';

// Different log levels
logger.info('User logged in', { userId: user.id });
logger.warn('High memory usage detected');
logger.error('Database connection failed', { error });
logger.debug('Detailed debug information');
```

### Health Check Endpoint

```bash
curl http://localhost:5000/api/v1/health

# Response
{
  "status": "healthy",
  "timestamp": "2026-03-10T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

---

## 🔒 Security Considerations

### Security Checklist

- [x] JWT-based authentication
- [x] Password hashing with bcrypt (12 rounds)
- [x] Rate limiting on all endpoints
- [x] CORS configuration
- [x] Helmet.js security headers
- [x] Input validation and sanitization
- [x] SQL injection prevention (Mongoose)
- [x] XSS protection
- [x] CSRF protection
- [x] HTTPS enforcement in production
- [x] Secure session management
- [x] File upload restrictions
- [x] Environment variable protection

### Security Best Practices

```typescript
// ✅ Sanitize user input
import { body } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().escape()
];

// ✅ Prevent NoSQL injection
User.findOne({ email: req.body.email }); // Safe with Mongoose

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Environment Variables Security

```bash
# ❌ Never commit .env files
# Add to .gitignore:
.env
.env.development
.env.production

# ✅ Use environment-specific files
.env.example        # Template (safe to commit)
.env.development    # Local development
.env.production     # Production (never commit)
```

---

## 📚 Additional Resources

### Documentation Files

- [README.md](README.md) - Project overview
- [DEVELOPER_HANDOFF.md](DEVELOPER_HANDOFF.md) - Complete handoff guide
- [backend/README.md](backend/README.md) - Backend documentation
- [backend/API_GUIDE.md](backend/API_GUIDE.md) - Complete API reference
- [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) - Deployment guide
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-launch checklist

### External Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Google Gemini AI](https://ai.google.dev/)

### Community & Support

- **GitHub Repository:** https://github.com/penchalatharun31-maker/Serene-Wellbeing
- **Issues:** https://github.com/penchalatharun31-maker/Serene-Wellbeing/issues
- **Email Support:** support@serenewellbeing.com

---

## 🎓 Learning Path for New Developers

### Week 1: Setup & Familiarization
- [ ] Clone repository and setup local environment
- [ ] Run application locally
- [ ] Explore codebase structure
- [ ] Read all documentation
- [ ] Run tests and understand test structure

### Week 2: Backend Deep Dive
- [ ] Understand Express.js routing
- [ ] Study Mongoose models and relationships
- [ ] Review authentication flow
- [ ] Examine API endpoints
- [ ] Test API with Postman/Insomnia

### Week 3: Frontend Deep Dive
- [ ] Understand React component structure
- [ ] Review routing and navigation
- [ ] Study state management (Context API)
- [ ] Examine API service layer
- [ ] Test user flows in browser

### Week 4: Advanced Features
- [ ] Socket.IO real-time features
- [ ] Payment integration (Stripe)
- [ ] AI integration (Gemini)
- [ ] File upload handling
- [ ] Caching with Redis

### Week 5: Testing & Deployment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Setup CI/CD pipeline
- [ ] Deploy to staging environment
- [ ] Performance testing

---

## 📞 Need Help?

### Quick Reference Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm test             # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript validation

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests

# Docker
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
docker-compose ps                 # Check status

# PM2
pm2 start ecosystem.config.js    # Start
pm2 restart serene-backend       # Restart
pm2 logs serene-backend          # Logs
pm2 monit                        # Monitor
```

### Contact

- **Technical Issues:** Create an issue on GitHub
- **Email:** support@serenewellbeing.com
- **Documentation:** This file + other docs in repo

---

**Version:** 2.0
**Last Updated:** March 10, 2026
**Maintained By:** Serene Wellbeing Development Team

**Happy Coding! 🚀**
