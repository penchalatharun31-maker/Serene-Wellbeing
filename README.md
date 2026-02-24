# 🌟 Serene Wellbeing Hub

> A comprehensive mental health and wellness platform connecting users with professional therapists and AI-powered support.

[![Backend CI](https://github.com/penchalatharun31-maker/Serene-Wellbeing/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/penchalatharun31-maker/Serene-Wellbeing/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/penchalatharun31-maker/Serene-Wellbeing/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/penchalatharun31-maker/Serene-Wellbeing/actions/workflows/frontend-ci.yml)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Serene Wellbeing Hub is a modern mental health platform designed to provide accessible, affordable, and evidence-based therapy services. The platform features:

- **Individual Therapy**: Connect with licensed therapists for one-on-one sessions
- **Corporate Wellness**: Comprehensive employee assistance programs (EAP)
- **AI Companion**: 24/7 support powered by Google Gemini AI
- **Mood Tracking**: Track your mental health journey with insights
- **Crisis Resources**: Immediate access to crisis support and resources

## ✨ Features

### For Users
- 🔐 Secure authentication with JWT and OAuth (Google)
- 💬 Real-time messaging with therapists via Socket.IO
- 📊 Mood tracking and analytics
- 🤖 AI-powered mental health companion
- 📅 Session booking and management
- 💳 Secure payments via Razorpay & Stripe
- 📱 Progressive Web App (PWA) with offline support

### For Therapists
- 📆 Availability and schedule management
- 💰 80% revenue share (industry-leading)
- 📈 Analytics dashboard
- 👥 Client management
- 💬 Secure messaging
- 💸 Automated payouts

### For Companies
- 🏢 Employee wellness programs
- 📊 Usage analytics and ROI tracking
- 🔒 Privacy-compliant reporting
- 🎯 Custom pricing tiers
- 📈 600% ROI based on research

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (inline styles)
- **Routing**: React Router v7
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **PWA**: vite-plugin-pwa
- **Testing**: Vitest, Playwright, React Testing Library

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: Passport.js, JWT
- **AI**: Google Gemini API
- **Payments**: Razorpay, Stripe
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **Process Manager**: PM2
- **Testing**: Jest, Supertest

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Railway.app
- **Monitoring**: Winston Logger
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
Serene-Wellbeing/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   ├── sockets/        # Socket.IO setup
│   │   └── server.ts       # Entry point
│   ├── dist/               # Compiled JavaScript
│   ├── uploads/            # File uploads
│   ├── logs/               # Application logs
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/               # Frontend React app
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   ├── context/           # React Context
│   ├── hooks/             # Custom hooks
│   ├── src/               # Additional source
│   ├── public/            # Static assets
│   ├── App.tsx            # Root component
│   ├── index.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── .github/               # GitHub Actions workflows
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── docker-compose.yml
│
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── .env.docker             # Docker environment variables
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 7.0 (or MongoDB Atlas)
- **Redis**: >= 7.0 (optional but recommended)
- **Docker** (optional): For containerized deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
   cd Serene-Wellbeing
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   Backend:
   ```bash
   cd backend
   cp .env.example .env.development
   # Edit .env.development with your values
   ```

   Frontend:
   ```bash
   cd frontend
   cp .env.example .env.development
   # Edit .env.development with your values
   ```

5. **Start MongoDB and Redis** (if running locally)
   ```bash
   # MongoDB
   mongod --dbpath /path/to/data

   # Redis
   redis-server
   ```

6. **Start the Development Servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

## 💻 Development

### Using Docker Compose (Recommended)

The easiest way to run the entire stack:

```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up

# With admin UIs (MongoDB Express & Redis Commander)
docker-compose -f docker-compose.dev.yml --profile with-admin-ui up

# Production mode
docker-compose up -d

# With Nginx reverse proxy
docker-compose --profile with-nginx up -d
```

Access the services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB Express**: http://localhost:8081 (admin/admin)
- **Redis Commander**: http://localhost:8082

### Backend Development

```bash
cd backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run tests
npm test
npm run test:watch
npm run test:integration

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
npm run test:watch
npm run test:e2e

# Linting
npm run lint
```

### API Documentation

- **API Guide**: See `backend/API_GUIDE.md`
- **Base URL**: `http://localhost:5000/api/v1`
- **Health Check**: `GET /api/v1/health`

### Testing

```bash
# Backend tests
cd backend
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests

# Frontend tests
cd frontend
npm test                    # Unit tests
npm run test:e2e           # Playwright E2E tests
npm run test:ui            # Vitest UI
```

## 🌐 Deployment

### Railway.app (Recommended)

Both frontend and backend are configured for Railway deployment.

1. **Backend Deployment**
   ```bash
   cd backend
   # Configure railway.json and .env.production
   railway up
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   # Configure railway.json and .env.production
   railway up
   ```

### Docker Deployment

```bash
# Build and deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. **Backend**
   ```bash
   cd backend
   npm run build
   npm run start:prod
   # Or with PM2
   npm run pm2:start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   # Serve dist/ folder with Nginx or any static server
   ```

## 🔐 Environment Variables

### Backend (.env)

Required variables:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
RAZORPAY_KEY_ID=your-razorpay-key
STRIPE_SECRET_KEY=your-stripe-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
FRONTEND_URL=https://your-frontend.com
```

See `backend/.env.example` for all variables.

### Frontend (.env)

Required variables:
```bash
VITE_API_URL=https://your-api.com
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

See `frontend/.env.example` for all variables.

## 📊 Architecture

### System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │   Backend   │ ──────> │   MongoDB   │
│   (React)   │ <────── │  (Express)  │ <────── │  (Database) │
└─────────────┘         └─────────────┘         └─────────────┘
                               │
                               │
                        ┌──────┴──────┐
                        │             │
                   ┌────▼────┐   ┌────▼────┐
                   │  Redis  │   │ Gemini  │
                   │ (Cache) │   │   AI    │
                   └─────────┘   └─────────┘
```

### Key Features

- **Scalable**: Horizontal scaling with Redis for session management
- **Secure**: Industry-standard authentication and authorization
- **Real-time**: WebSocket connections for instant messaging
- **Resilient**: Graceful error handling and automatic retries
- **Monitored**: Comprehensive logging and health checks

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Auto-format on save
- **Commits**: Use conventional commits

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For powering our AI companion
- **Railway.app**: For reliable hosting
- **MongoDB Atlas**: For database hosting
- **Razorpay & Stripe**: For payment processing

## 📧 Support

- **Email**: support@serenewellbeing.com
- **Issues**: [GitHub Issues](https://github.com/penchalatharun31-maker/Serene-Wellbeing/issues)
- **Documentation**: See `/backend/README.md` and `/backend/API_GUIDE.md`

## 🚀 Roadmap

- [ ] Video calling integration
- [ ] Mobile apps (iOS & Android)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with health wearables
- [ ] Group therapy sessions

---

Made with ❤️ by the Serene Wellbeing Team
