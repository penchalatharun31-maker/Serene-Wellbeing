# 🌿 Serene Wellbeing Hub

A comprehensive mental health and wellbeing platform connecting users with licensed mental health experts, powered by Google Gemini AI for personalized recommendations and insights.

[![CI/CD](https://github.com/yourrepo/serene-wellbeing/workflows/Full%20Stack%20CI/CD/badge.svg)](https://github.com/yourrepo/serene-wellbeing/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19.2.0-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue)](https://www.typescriptlang.org/)

## 🎯 Features

### For Users
- 🔍 **AI-Powered Expert Matching** - Find the perfect mental health expert using Google Gemini AI
- 📅 **Smart Booking System** - Schedule sessions with conflict detection and automated reminders
- 💬 **Real-time Chat** - Secure messaging with experts via Socket.IO
- 📊 **Progress Tracking** - Monitor your mental health journey with personalized analytics
- 💳 **Secure Payments** - Stripe integration with credit system and transparent pricing
- 📚 **Resource Library** - Access curated articles, videos, and wellness content
- 👥 **Group Sessions** - Join group therapy sessions and workshops

### For Experts
- 🗓️ **Calendar Management** - Manage availability and bookings effortlessly
- 💰 **Automated Payouts** - Weekly payouts with transparent commission tracking
- 📈 **Performance Analytics** - Track earnings, ratings, and session statistics
- 🤖 **AI-Powered Insights** - Get profile optimization suggestions from Gemini AI
- ⭐ **Review System** - Build reputation through client feedback
- 📝 **Session Notes** - Secure note-taking with AI-generated summaries

### For Companies
- 👔 **Corporate Wellness** - Bulk employee access with custom pricing
- 📊 **Usage Analytics** - Monitor employee engagement and utilization
- 💼 **Credit Management** - Flexible credit allocation system
- 🔐 **HIPAA Compliant** - Enterprise-grade security and privacy

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │────────▶│  Express Backend │────────▶│    MongoDB      │
│  (Vite + TS)    │         │  (Node.js + TS)  │         │                 │
│                 │         │                  │         └─────────────────┘
└─────────────────┘         └──────────────────┘                  │
        │                            │                             │
        │                            │                    ┌────────▼────────┐
        │                    ┌───────▼────────┐          │     Redis       │
        │                    │  Google Gemini │          │   (Caching)     │
        │                    │      AI        │          └─────────────────┘
        │                    └────────────────┘
        │                            │
        │                    ┌───────▼────────┐
        └───────────────────▶│   Socket.IO    │
                             │  (WebSocket)   │
                             └────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB 7.0+
- Redis 7+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourrepo/serene-wellbeing.git
   cd serene-wellbeing
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your credentials

   # Frontend
   cp .env.example .env.development
   # Edit .env.development
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

   Or manually:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend (new terminal)
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api/v1/docs

### Using the Root Package Manager

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run both services in development mode
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build both for production
npm run build
```

## 📚 Documentation

- **[Setup & Run Guide](SETUP_AND_RUN_GUIDE.md)** - Detailed setup instructions
- **[Backend Implementation](BACKEND_IMPLEMENTATION_SUMMARY.md)** - Backend architecture overview
- **[API Documentation](backend/API_GUIDE.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Production Checklist](PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist
- **[Backend README](backend/README.md)** - Backend-specific documentation

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 🏭 Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# On production server
git clone https://github.com/yourrepo/serene-wellbeing.git
cd serene-wellbeing

# Configure environment
cp backend/.env.example backend/.env
nano backend/.env

# Deploy
docker-compose up -d --build
```

### Option 2: CI/CD with GitHub Actions

Push to `main` branch and GitHub Actions will automatically:
- Run tests
- Build Docker images
- Deploy to production
- Run health checks

See [Deployment Guide](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database
- **Redis** - Caching & sessions
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Google Gemini AI** - AI features
- **Nodemailer** - Email service
- **Winston** - Logging
- **Jest + Supertest** - Testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD
- **Certbot** - SSL certificates

## 📊 Project Structure

```
serene-wellbeing/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   ├── __tests__/          # Backend tests
│   ├── Dockerfile          # Backend Docker image
│   └── package.json
├── src/                    # Frontend source
├── components/             # React components
├── pages/                  # Page components
├── context/                # React context
├── hooks/                  # Custom hooks
├── services/               # API client services
├── e2e/                    # E2E tests
├── .github/                # GitHub Actions workflows
├── scripts/                # Deployment scripts
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── Dockerfile              # Frontend Docker image
```

## 🔒 Security

- JWT-based authentication with refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting on all endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- File upload restrictions
- XSS protection
- CSRF protection
- HTTPS enforcement in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- Stripe for secure payment processing
- MongoDB for robust data storage
- All contributors and supporters

## 📞 Support

- **Email:** support@serene-wellbeing.com
- **Documentation:** https://docs.serene-wellbeing.com
- **Issues:** https://github.com/yourrepo/serene-wellbeing/issues

## 🗺️ Roadmap

- [ ] Video call integration
- [ ] Mobile apps (iOS & Android)
- [ ] Multi-language support
- [ ] Advanced AI chatbot
- [ ] Wearable device integration
- [ ] Community forums
- [ ] Peer support groups
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for mental health and wellbeing**
