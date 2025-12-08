# Serene Wellbeing Hub 🧘‍♀️

A comprehensive mental wellbeing platform connecting users with wellness experts for personalized sessions, powered by Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [License](#license)

## 🌟 Overview

Serene Wellbeing Hub is a full-stack mental wellness platform that enables users to:
- Browse and book sessions with verified wellness experts
- Participate in individual or group wellness sessions
- Access curated wellness resources
- Track their wellness journey with AI-powered insights
- Communicate with experts through real-time messaging

## ✨ Features

### For Users
- 🔍 **Browse Experts** - Find the perfect wellness expert by specialization, rating, and availability
- 📅 **Book Sessions** - Schedule individual or group sessions with instant booking confirmation
- 💬 **Real-time Messaging** - Chat directly with experts
- 📊 **Analytics Dashboard** - Track your wellness journey with AI-generated insights
- 🎟️ **Credit System** - Flexible payment options with credits or direct payment
- 📚 **Resource Library** - Access articles, videos, and audio content
- ⭐ **Rate & Review** - Share your experience and help others

### For Experts
- 📋 **Professional Profiles** - Showcase certifications, education, and expertise
- 📅 **Availability Management** - Set and manage your schedule
- 💰 **Earnings Dashboard** - Track revenue, sessions, and performance
- 📊 **Analytics** - Understand your peak hours, ratings, and client trends
- 🤖 **AI-Powered Insights** - Get profile optimization suggestions
- 📝 **Session Management** - Manage bookings and client information

### Powered by Google Gemini AI 🤖
- **Smart Recommendations** - AI matches users with perfect experts
- **Wellness Insights** - Personalized journey analysis
- **Content Generation** - AI-created wellness articles and tips
- **Profile Optimization** - AI suggestions for expert profiles
- **Feedback Analysis** - Extract insights from reviews
- **Chat Assistance** - AI-powered support for users

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router 7** - Navigation
- **Recharts 3.5** - Analytics charts
- **Socket.IO Client** - Real-time features

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Google Gemini AI** - AI integration
- **Nodemailer** - Email service

## 📁 Project Structure

```
Serene-Wellbeing/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js backend API
│   ├── src/                 # Source code
│   ├── package.json
│   ├── README.md            # Backend docs
│   ├── API_GUIDE.md         # API reference
│   └── DEPLOYMENT.md        # Deployment guide
│
├── SETUP_AND_RUN_GUIDE.md   # How to run
└── package.json             # Root scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Google Gemini API Key
- Stripe Account (test mode)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/penchalatharun31-maker/Serene-Wellbeing.git
cd Serene-Wellbeing

# 2. Install all dependencies
npm run install:all

# 3. Configure backend environment
cd backend
cp .env.example .env
# Edit .env with your credentials

# 4. Configure frontend environment
cd ../frontend
touch .env.local
# Add: VITE_API_URL=http://localhost:5000/api/v1

# 5. Run both frontend and backend
cd ..
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- Health Check: http://localhost:5000/api/v1/health

## 📖 Documentation

- **[Setup & Run Guide](SETUP_AND_RUN_GUIDE.md)** - Complete setup instructions
- **[Backend README](backend/README.md)** - Backend documentation
- **[API Guide](backend/API_GUIDE.md)** - Complete API reference
- **[Deployment Guide](backend/DEPLOYMENT.md)** - Production deployment
- **[Implementation Summary](BACKEND_IMPLEMENTATION_SUMMARY.md)** - Backend overview

## 🔧 Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build for production
npm run build
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- SQL injection prevention
- XSS protection

## 📦 Building for Production

```bash
# Build both
npm run build

# Or separately
npm run build:backend
npm run build:frontend
```

## 🚀 Deployment

See [DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment options:
- **Backend**: AWS EC2, DigitalOcean, Railway, Heroku
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: MongoDB Atlas

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powering intelligent recommendations
- Stripe for secure payment processing
- MongoDB for flexible data storage
- All the amazing open-source libraries used in this project

---

**Built with ❤️ for mental wellbeing**

**For detailed setup instructions, see [SETUP_AND_RUN_GUIDE.md](SETUP_AND_RUN_GUIDE.md)**
