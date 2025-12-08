# Serene Wellbeing API Guide

Complete guide for integrating with the Serene Wellbeing API.

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.serenewellbeing.com/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Email is required",
  "statusCode": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Complete API Reference

### 1. Authentication

#### Register User
```http
POST /auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user", // optional: user | expert | company
  "phone": "+1234567890", // optional
  "dateOfBirth": "1990-01-01" // optional
}

Response: 201
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "credits": 0
  }
}
```

#### Login
```http
POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "success": true,
  "token": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "user": { ... },
  "expertProfile": { ... } // if role is expert
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>

Request Body:
{
  "name": "John Updated",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Change Password
```http
PUT /auth/password
Authorization: Bearer <token>

Request Body:
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

#### Forgot Password
```http
POST /auth/forgot-password

Request Body:
{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password

Request Body:
{
  "token": "reset_token_from_email",
  "password": "NewPassword123"
}
```

### 2. Experts

#### Get All Experts
```http
GET /experts?page=1&limit=12&specialization=Meditation&minRate=50&maxRate=200&minRating=4&search=john

Query Parameters:
- page: number (default: 1)
- limit: number (default: 12)
- specialization: string
- minRate: number
- maxRate: number
- minRating: number (1-5)
- language: string
- search: string (searches name)
- sort: string (default: -rating)

Response: 200
{
  "success": true,
  "count": 12,
  "total": 45,
  "page": 1,
  "pages": 4,
  "experts": [
    {
      "_id": "expert_id",
      "userId": {
        "name": "Dr. Sarah Smith",
        "avatar": "..."
      },
      "title": "Licensed Therapist",
      "specialization": ["CBT", "Anxiety"],
      "bio": "...",
      "experience": 10,
      "rating": 4.8,
      "reviewCount": 156,
      "hourlyRate": 150,
      "languages": ["English", "Spanish"]
    }
  ]
}
```

#### Get Expert by ID
```http
GET /experts/:id

Response: 200
{
  "success": true,
  "expert": { ... },
  "reviews": [ ... ]
}
```

#### Create Expert Profile
```http
POST /experts/profile
Authorization: Bearer <token>

Request Body:
{
  "title": "Licensed Therapist",
  "specialization": ["CBT", "Anxiety", "Depression"],
  "bio": "I am a licensed therapist with 10 years of experience...",
  "experience": 10,
  "hourlyRate": 150,
  "languages": ["English", "Spanish"],
  "certifications": [
    {
      "name": "Licensed Clinical Psychologist",
      "issuer": "State Board",
      "year": 2015
    }
  ],
  "education": [
    {
      "degree": "PhD in Clinical Psychology",
      "institution": "University Name",
      "year": 2013
    }
  ]
}

Response: 201
{
  "success": true,
  "expert": { ... }
}
```

#### Update Expert Profile
```http
PUT /experts/profile
Authorization: Bearer <expert_token>

Request Body: (all fields optional)
{
  "bio": "Updated bio...",
  "hourlyRate": 175,
  "isAcceptingClients": false
}
```

#### Update Availability
```http
PUT /experts/availability
Authorization: Bearer <expert_token>

Request Body:
{
  "availability": {
    "monday": [
      { "start": "09:00", "end": "12:00" },
      { "start": "14:00", "end": "18:00" }
    ],
    "tuesday": [ ... ],
    // ... other days
  }
}
```

#### Get Expert Stats
```http
GET /experts/stats/me
Authorization: Bearer <expert_token>

Response: 200
{
  "success": true,
  "stats": {
    "totalEarnings": 15000,
    "totalSessions": 120,
    "completedSessions": 110,
    "upcomingSessions": 8,
    "earningsThisMonth": 2500,
    "rating": 4.8
  },
  "recentReviews": [ ... ]
}
```

#### Get AI Recommendations
```http
POST /experts/recommendations
Authorization: Bearer <token>

Request Body:
{
  "concerns": ["anxiety", "stress", "sleep"],
  "preferences": "Looking for someone specializing in CBT"
}

Response: 200
{
  "success": true,
  "aiRecommendations": "Based on your concerns...",
  "experts": [ ... ]
}
```

#### Check Expert Availability
```http
GET /experts/availability?expertId=expert_id&date=2025-01-15

Response: 200
{
  "success": true,
  "availability": [
    { "start": "09:00", "end": "10:00" },
    { "start": "10:00", "end": "11:00" }
  ],
  "bookedSlots": ["09:00", "14:00"]
}
```

### 3. Sessions

#### Create Session/Booking
```http
POST /sessions
Authorization: Bearer <token>

Request Body:
{
  "expertId": "expert_id",
  "scheduledDate": "2025-01-15",
  "scheduledTime": "14:00",
  "duration": 60, // 30, 60, 90, or 120
  "notes": "I'd like to discuss...", // optional
  "useCredits": false // optional
}

Response: 201
{
  "success": true,
  "session": { ... },
  "amountToPay": 150
}
```

#### Get User Sessions
```http
GET /sessions/user/all?status=completed&page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: pending | confirmed | completed | cancelled | refunded
- page: number
- limit: number

Response: 200
{
  "success": true,
  "count": 10,
  "total": 45,
  "sessions": [ ... ]
}
```

#### Get Upcoming Sessions
```http
GET /sessions/user/upcoming
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 3,
  "sessions": [ ... ]
}
```

#### Get Expert Sessions
```http
GET /sessions/expert/all?status=confirmed&page=1
Authorization: Bearer <expert_token>
```

#### Get Session by ID
```http
GET /sessions/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "session": {
    "_id": "session_id",
    "userId": { ... },
    "expertId": { ... },
    "status": "confirmed",
    "scheduledDate": "2025-01-15T00:00:00.000Z",
    "scheduledTime": "14:00",
    "duration": 60,
    "price": 150,
    "paymentStatus": "paid",
    "meetingLink": "https://meet.example.com/..."
  }
}
```

#### Update Session (Expert only)
```http
PUT /sessions/:id
Authorization: Bearer <expert_token>

Request Body:
{
  "status": "confirmed",
  "meetingLink": "https://zoom.us/j/..."
}
```

#### Cancel Session
```http
POST /sessions/:id/cancel
Authorization: Bearer <token>

Request Body:
{
  "cancelReason": "Schedule conflict"
}

Response: 200
{
  "success": true,
  "message": "Session cancelled successfully",
  "refundAmount": 150,
  "session": { ... }
}

Refund Policy:
- 24+ hours before: 100% refund
- 12-24 hours: 50% refund
- < 12 hours: No refund
```

#### Rate Session
```http
POST /sessions/:id/rate
Authorization: Bearer <token>

Request Body:
{
  "rating": 5, // 1-5
  "review": "Excellent session! Very helpful..."
}

Response: 200
{
  "success": true,
  "session": { ... }
}
```

### 4. Payments

#### Create Payment Intent
```http
POST /payments/create-intent
Authorization: Bearer <token>

Request Body:
{
  "sessionId": "session_id",
  "amount": 150
}

Response: 200
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx"
}

// Use clientSecret with Stripe.js on frontend
```

#### Confirm Payment
```http
POST /payments/confirm
Authorization: Bearer <token>

Request Body:
{
  "paymentIntentId": "pi_xxx"
}

Response: 200
{
  "success": true,
  "message": "Payment confirmed",
  "session": { ... }
}
```

#### Purchase Credits
```http
POST /payments/credits/purchase
Authorization: Bearer <token>

Request Body:
{
  "amount": 100, // USD
  "credits": 100
}

Response: 200
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### Confirm Credit Purchase
```http
POST /payments/credits/confirm
Authorization: Bearer <token>

Request Body:
{
  "paymentIntentId": "pi_xxx"
}

Response: 200
{
  "success": true,
  "message": "Credits purchased successfully",
  "credits": 150
}
```

#### Get Payment History
```http
GET /payments/history?page=1&limit=10
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 10,
  "total": 28,
  "transactions": [
    {
      "_id": "transaction_id",
      "type": "payment",
      "amount": 150,
      "status": "completed",
      "createdAt": "...",
      "metadata": {
        "description": "Session booking"
      }
    }
  ]
}
```

#### Request Refund
```http
POST /payments/refund
Authorization: Bearer <token>

Request Body:
{
  "sessionId": "session_id",
  "reason": "Service not as expected"
}

Response: 200
{
  "success": true,
  "message": "Refund processed successfully",
  "refund": { ... }
}
```

### 5. Messages

#### Send Message
```http
POST /messages
Authorization: Bearer <token>

Request Body:
{
  "receiverId": "user_id",
  "content": "Hello, I have a question...",
  "type": "text", // text | image | file
  "fileUrl": "https://...", // optional for image/file
  "fileName": "document.pdf" // optional for file
}

Response: 201
{
  "success": true,
  "message": { ... }
}
```

#### Get Conversations
```http
GET /messages/conversations
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 5,
  "conversations": [
    {
      "_id": "conversation_id",
      "lastMessage": {
        "content": "Thank you!",
        "createdAt": "...",
        "senderId": { ... },
        "receiverId": { ... }
      },
      "unreadCount": 2
    }
  ]
}
```

#### Get Messages with User
```http
GET /messages/:userId?page=1&limit=50
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 50,
  "total": 123,
  "messages": [ ... ]
}
```

#### Mark Messages as Read
```http
POST /messages/mark-read
Authorization: Bearer <token>

Request Body:
{
  "messageIds": ["msg_id_1", "msg_id_2"]
}
```

#### Get Unread Count
```http
GET /messages/unread-count
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 5
}
```

### 6. Group Sessions

#### Get All Group Sessions
```http
GET /group-sessions?category=Meditation&status=upcoming&page=1

Response: 200
{
  "success": true,
  "count": 12,
  "groupSessions": [ ... ]
}
```

#### Get Group Session by ID
```http
GET /group-sessions/:id

Response: 200
{
  "success": true,
  "groupSession": {
    "_id": "group_session_id",
    "title": "Morning Meditation",
    "description": "...",
    "expertId": { ... },
    "scheduledDate": "...",
    "scheduledTime": "08:00",
    "maxParticipants": 20,
    "currentParticipants": 15,
    "price": 25,
    "participants": [ ... ]
  }
}
```

#### Create Group Session (Expert)
```http
POST /group-sessions
Authorization: Bearer <expert_token>

Request Body:
{
  "title": "Morning Meditation",
  "description": "Start your day with mindfulness...",
  "category": "Meditation",
  "scheduledDate": "2025-01-20",
  "scheduledTime": "08:00",
  "duration": 60,
  "maxParticipants": 20,
  "price": 25,
  "tags": ["meditation", "mindfulness"]
}
```

#### Join Group Session
```http
POST /group-sessions/:id/join
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Successfully joined group session",
  "groupSession": { ... }
}
```

#### Leave Group Session
```http
POST /group-sessions/:id/leave
Authorization: Bearer <token>
```

### 7. Resources

#### Get All Resources
```http
GET /resources?type=article&category=Mental Health&search=anxiety&page=1

Query Parameters:
- type: article | video | audio | pdf
- category: string
- search: string
- page: number
- limit: number

Response: 200
{
  "success": true,
  "count": 12,
  "resources": [ ... ]
}
```

#### Get Resource by ID
```http
GET /resources/:id

Response: 200
{
  "success": true,
  "resource": {
    "_id": "resource_id",
    "title": "Understanding Anxiety",
    "description": "...",
    "type": "article",
    "content": "Full article content...",
    "author": {
      "name": "Dr. Smith",
      "avatar": "..."
    },
    "views": 1542,
    "likes": 89
  }
}
```

#### Like Resource
```http
POST /resources/:id/like
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "likes": 90
}
```

#### Generate AI Content (Admin/Expert)
```http
POST /resources/generate/content
Authorization: Bearer <expert_token>

Request Body:
{
  "topic": "Managing Workplace Stress",
  "type": "article" // article | tips | guide
}

Response: 200
{
  "success": true,
  "content": "Generated content..."
}
```

### 8. Analytics

#### Get User Analytics
```http
GET /analytics/user?period=30d
Authorization: Bearer <token>

Query Parameters:
- period: 7d | 30d | 90d

Response: 200
{
  "success": true,
  "analytics": {
    "completedSessions": 12,
    "spendingByCategory": [ ... ],
    "sessionsByMonth": [ ... ],
    "aiInsights": "Based on your wellness journey..."
  }
}
```

#### Get Expert Analytics
```http
GET /analytics/expert?period=30d
Authorization: Bearer <expert_token>

Response: 200
{
  "success": true,
  "analytics": {
    "revenueByDay": [ ... ],
    "sessionsByStatus": [ ... ],
    "ratingTrend": [ ... ],
    "peakHours": [ ... ],
    "summary": {
      "totalRevenue": 5000,
      "totalSessions": 45,
      "avgRevenue": 111
    }
  }
}
```

### 9. Notifications

#### Get Notifications
```http
GET /notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 20,
  "total": 45,
  "unreadCount": 8,
  "notifications": [ ... ]
}
```

#### Mark Notification as Read
```http
PUT /notifications/:notificationId/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "count": 8
}
```

### 10. File Upload

#### Upload Image
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: (image file, max 5MB)

Response: 200
{
  "success": true,
  "file": {
    "filename": "uuid.jpg",
    "originalName": "avatar.jpg",
    "mimetype": "image/jpeg",
    "size": 123456,
    "url": "https://api.example.com/uploads/uuid.jpg"
  }
}
```

#### Upload Document
```http
POST /upload/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: (PDF/DOC file, max 10MB)
```

### 11. Admin APIs

All admin endpoints require `super_admin` role.

#### Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "stats": {
    "users": {
      "total": 5423,
      "experts": 156,
      "activeExperts": 142
    },
    "sessions": {
      "total": 12456,
      "thisMonth": 834,
      "growth": 12.5
    },
    "revenue": {
      "thisMonth": 125000,
      "platformFees": 25000,
      "growth": 8.3
    },
    "pendingApprovals": 8
  }
}
```

#### Get Pending Experts
```http
GET /admin/experts/pending
Authorization: Bearer <admin_token>
```

#### Approve Expert
```http
PUT /admin/experts/:expertId/approve
Authorization: Bearer <admin_token>
```

#### Reject Expert
```http
PUT /admin/experts/:expertId/reject
Authorization: Bearer <admin_token>

Request Body:
{
  "reason": "Incomplete certifications"
}
```

#### Create Promo Code
```http
POST /admin/promo-codes
Authorization: Bearer <admin_token>

Request Body:
{
  "code": "WELCOME20",
  "type": "percentage", // percentage | fixed
  "value": 20,
  "maxUses": 100,
  "minPurchaseAmount": 50,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "applicableFor": "all" // all | individual_sessions | group_sessions | credits
}
```

## WebSocket Events (Socket.IO)

### Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Send Message
```javascript
socket.emit('message:send', {
  receiverId: 'user_id',
  content: 'Hello!',
  type: 'text'
});
```

#### Receive Message
```javascript
socket.on('message:received', (message) => {
  console.log('New message:', message);
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('typing:start', {
  conversationId: 'conv_id',
  receiverId: 'user_id'
});

// Stop typing
socket.emit('typing:stop', {
  conversationId: 'conv_id',
  receiverId: 'user_id'
});

// Listen for typing
socket.on('typing:user', ({ userId, conversationId }) => {
  // Show typing indicator
});
```

#### User Online/Offline
```javascript
socket.on('user:online', ({ userId }) => {
  // Update UI
});

socket.on('user:offline', ({ userId }) => {
  // Update UI
});
```

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **File uploads**: 10 uploads per 15 minutes
- **Messaging**: 20 messages per minute

## Error Codes

| Code | Description |
|------|-------------|
| `ValidationError` | Invalid input data |
| `AuthenticationError` | Invalid credentials |
| `AuthorizationError` | Insufficient permissions |
| `NotFoundError` | Resource not found |
| `ConflictError` | Resource conflict |
| `PaymentError` | Payment processing failed |
| `TooManyRequests` | Rate limit exceeded |
| `ServerError` | Internal server error |

## Best Practices

1. **Always handle errors gracefully**
2. **Implement retry logic for failed requests**
3. **Cache responses when appropriate**
4. **Use pagination for large datasets**
5. **Validate data on client before sending**
6. **Store tokens securely (not in localStorage)**
7. **Implement request timeouts**
8. **Log API errors for debugging**

## Support

For API support:
- Email: api-support@serenewellbeing.com
- Documentation: https://docs.serenewellbeing.com
- Status Page: https://status.serenewellbeing.com
