# Serene Wellbeing Backend API

A comprehensive backend API for the Serene Wellbeing Hub platform, built with Node.js, Express, TypeScript, MongoDB, and Google Gemini AI.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👨‍⚕️ **Expert Management** - Expert profiles, availability, approval workflows
- 📅 **Booking System** - Individual and group session booking with conflict detection
- 💳 **Payment Processing** - Stripe integration for payments and credits
- 💬 **Real-time Messaging** - Socket.IO powered chat system
- 📊 **Analytics** - Comprehensive analytics for users, experts, and admins
- 🤖 **AI Integration** - Google Gemini AI for recommendations and insights
- 📧 **Email Notifications** - Automated email system for booking confirmations, reminders
- 🔔 **Push Notifications** - Real-time in-app notifications
- 📁 **File Upload** - Secure file upload for avatars, documents, resources
- 🎟️ **Promo Codes** - Discount code management
- 📈 **Revenue Tracking** - Transaction management and commission calculations
- 🔄 **Cron Jobs** - Automated tasks for reminders, cleanups, and statistics

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO
- **Payment**: Stripe
- **AI**: Google Gemini AI
- **Email**: Nodemailer
- **Security**: Helmet, bcrypt, express-rate-limit
- **Validation**: express-validator
- **Logging**: Winston

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Google Gemini API Key
- Stripe Account (for payments)
- SMTP Server (for emails)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/serene-wellbeing

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Other Commands
```bash
# Lint code
npm run lint

# Run tests
npm test
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Expert Endpoints

#### Get All Experts
```http
GET /api/v1/experts?specialization=Meditation&page=1&limit=12
```

#### Get Expert by ID
```http
GET /api/v1/experts/:id
```

#### Create Expert Profile
```http
POST /api/v1/experts/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Licensed Therapist",
  "specialization": ["CBT", "Anxiety"],
  "bio": "I specialize in cognitive behavioral therapy...",
  "experience": 5,
  "hourlyRate": 150
}
```

#### Get Expert Recommendations (AI)
```http
POST /api/v1/experts/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "concerns": ["anxiety", "stress"],
  "preferences": "Looking for CBT specialist"
}
```

### Session Endpoints

#### Create Booking
```http
POST /api/v1/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "expertId": "expert_id",
  "scheduledDate": "2025-01-15",
  "scheduledTime": "14:00",
  "duration": 60,
  "useCredits": false
}
```

#### Get User Sessions
```http
GET /api/v1/sessions/user/all?status=completed&page=1
Authorization: Bearer <token>
```

#### Cancel Session
```http
POST /api/v1/sessions/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancelReason": "Schedule conflict"
}
```

#### Rate Session
```http
POST /api/v1/sessions/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "review": "Excellent session!"
}
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/v1/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session_id",
  "amount": 150
}
```

#### Purchase Credits
```http
POST /api/v1/payments/credits/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "credits": 100
}
```

### Message Endpoints

#### Send Message
```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user_id",
  "content": "Hello, I have a question about..."
}
```

#### Get Conversations
```http
GET /api/v1/messages/conversations
Authorization: Bearer <token>
```

#### Get Messages
```http
GET /api/v1/messages/:userId?page=1&limit=50
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get User Analytics
```http
GET /api/v1/analytics/user?period=30d
Authorization: Bearer <token>
```

#### Get Expert Analytics
```http
GET /api/v1/analytics/expert?period=30d
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer <admin_token>
```

#### Approve Expert
```http
PUT /api/v1/admin/experts/:expertId/approve
Authorization: Bearer <admin_token>
```

#### Create Promo Code
```http
POST /api/v1/admin/promo-codes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "WELCOME20",
  "type": "percentage",
  "value": 20,
  "maxUses": 100,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31"
}
```

## Socket.IO Events

### Client to Server

- `conversation:join` - Join a conversation room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark messages as read
- `call:initiate` - Start video call
- `call:answer` - Answer video call

### Server to Client

- `message:received` - New message in conversation
- `message:new` - New message notification
- `typing:user` - User is typing
- `typing:stopped` - User stopped typing
- `user:online` - User came online
- `user:offline` - User went offline
- `call:incoming` - Incoming video call
- `session:updated` - Session status updated

## Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human readable error message",
  "statusCode": 400
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour
- File uploads: 10 uploads per 15 minutes
- Messaging: 20 messages per minute

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all endpoints
- Input validation and sanitization
- Helmet.js for security headers
- CORS configuration
- SQL injection prevention (using Mongoose)
- XSS protection

## Database Models

- **User** - User accounts (users, experts, companies, admins)
- **Expert** - Expert profiles and statistics
- **Session** - Booking sessions
- **GroupSession** - Group session events
- **Message** - Chat messages
- **Notification** - In-app notifications
- **Transaction** - Payment transactions
- **Review** - Session reviews and ratings
- **Resource** - Wellness resources (articles, videos)
- **Company** - Company accounts
- **PromoCode** - Promotional discount codes

## Cron Jobs

- **Hourly**: Send session reminders (24 hours before)
- **Every 30 min**: Auto-complete past sessions
- **Daily midnight**: Clean up old notifications
- **Daily 1 AM**: Update expert statistics
- **Weekly**: Check inactive users and send re-engagement

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Docker Deployment (Coming Soon)

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment to production:
```bash
export NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

### Recommended Services

- **Backend Hosting**: AWS EC2, DigitalOcean, Heroku, Railway
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3, Cloudinary
- **Email**: SendGrid, AWS SES
- **Monitoring**: PM2, New Relic, DataDog

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@serenewellbeing.com

## Authors

Serene Wellbeing Development Team
