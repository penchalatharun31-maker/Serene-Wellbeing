# B2C User Flow Documentation

## Table of Contents
1. [User Roles](#user-roles)
2. [Authentication & Registration](#authentication--registration)
3. [Dashboard Access Control](#dashboard-access-control)
4. [Payment Gateway](#payment-gateway)
5. [Complete User Journey](#complete-user-journey)

---

## User Roles

### Defined Roles
The platform supports 4 distinct user roles, each with specific permissions and dashboard access:

#### 1. **User Role (`user`)** - B2C Customer
- **Purpose**: End consumers who book sessions with experts
- **Dashboard**: `/dashboard/user`
- **Capabilities**:
  - Browse and book sessions with experts
  - Purchase credits via Razorpay
  - View booking history
  - Manage profile settings
  - Join video sessions
  - Access AI companion, mood tracker, journal
- **Model Definition**: `backend/src/models/User.ts:8`

#### 2. **Expert Role (`expert`)** - Service Provider
- **Purpose**: Wellness professionals who provide sessions
- **Dashboard**: `/dashboard/expert`
- **Capabilities**:
  - Manage availability and bookings
  - Accept/reject session requests
  - Track earnings
  - Request payouts
  - Manage client relationships
- **Approval Required**: Yes, must be approved by admin

#### 3. **Company Role (`company`)** - B2B Customer
- **Purpose**: Organizations purchasing services for employees
- **Dashboard**: `/dashboard/company`
- **Capabilities**:
  - Manage employee access
  - Purchase bulk credits
  - View company-wide analytics
  - Invite and manage employees

#### 4. **Super Admin Role (`super_admin`)** - Platform Administrator
- **Purpose**: Platform management and oversight
- **Dashboard**: `/dashboard/admin`
- **Capabilities**:
  - Approve/reject experts
  - Manage all companies
  - View platform analytics
  - Handle disputes and payouts
  - Manage promo codes and CMS

---

## Authentication & Registration

### Registration Flow
**Location**: `context/AuthContext.tsx:76-115`

```typescript
signup(name, email, password, role='user', country, currency)
  → authService.register()
  → Store tokens in localStorage
  → Redirect to /dashboard/{role}
```

### Login Flow
**Location**: `context/AuthContext.tsx:50-74`

```typescript
login(email, password)
  → authService.login()
  → Store tokens in localStorage
  → Redirect to /dashboard/{role}
```

### Role Assignment
- Default role: `user` (B2C customer)
- Expert role: Set during registration via `/signup` with `role='expert'`
- Company role: Set during company onboarding
- Super admin: Manually assigned in database

---

## Dashboard Access Control

### Route Protection
**Location**: `components/ProtectedRoute.tsx:10-25`

The platform enforces strict role-based access control:

```typescript
<ProtectedRoute allowedRoles={['user']}>
  <DashboardLayout type="user" />
</ProtectedRoute>
```

### Access Rules
- ✅ **Authenticated users** can access their own role's dashboard
- ❌ **Unauthorized users** are redirected to `/login`
- ❌ **Wrong role users** are redirected to their correct dashboard
  - Example: If an `expert` tries to access `/dashboard/user`, they are redirected to `/dashboard/expert`

### Dashboard Routes
**Location**: `App.tsx:96-164`

| Route | Allowed Role | Components |
|-------|--------------|------------|
| `/dashboard/user/*` | `user` | UserDashboard, UserSessions, UserSettings |
| `/dashboard/expert/*` | `expert` | ExpertDashboard, ExpertBookings, ExpertEarnings, etc. |
| `/dashboard/company/*` | `company` | CompanyDashboard, CompanyEmployees, CompanyCredits, etc. |
| `/dashboard/admin/*` | `super_admin` | AdminOverview, ExpertApprovals, PayoutsManagement, etc. |

---

## Payment Gateway

### Primary Gateway: Razorpay (B2C)
**Location**: `backend/src/controllers/payment.controller.ts:1-20`

#### Why Razorpay for B2C?
- ✅ Native support for Indian payment methods (UPI, Cards, NetBanking)
- ✅ INR currency support
- ✅ Lower fees for Indian transactions
- ✅ Better user experience for Indian customers

#### Payment Flow
```
User Dashboard
  ↓
Click "Top Up Credits"
  ↓
Select Credit Pack (50, 150, 500 credits)
  ↓
Choose Payment Method (UPI/Card)
  ↓
POST /api/payments/create-razorpay-order
  ↓
Razorpay Checkout Opens
  ↓
User Completes Payment
  ↓
Razorpay Callback
  ↓
POST /api/payments/verify (signature verification)
  ↓
Credits Added to User Account
  ↓
Success Screen
```

#### Key Endpoints
- **Create Order**: `POST /api/payments/create-razorpay-order`
  - Request: `{ amount, currency }`
  - Response: `{ order: { id, amount, currency } }`

- **Verify Payment**: `POST /api/payments/verify`
  - Request: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
  - Response: `{ success: true, paymentId, orderId }`

#### Frontend Integration
**Location**: `components/PaymentModal.tsx:119-163`

```typescript
// 1. Create Razorpay order
const res = await fetch('/api/payments/create-razorpay-order', {
  method: 'POST',
  body: JSON.stringify({ amount, currency })
});

// 2. Initialize Razorpay checkout
const options = {
  key: process.env.RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  order_id: order.id,
  handler: function(response) {
    // Payment successful - verify signature
  }
};
const rzp = new Razorpay(options);
rzp.open();
```

### Secondary Gateway: Stripe (Future International Expansion)
**Location**: `backend/src/controllers/payment.controller.ts:36-82`

- **Purpose**: Reserved for international users (USD, EUR, etc.)
- **Status**: Currently available but not primary for B2C
- **Endpoints**: `/create-intent`, `/confirm`

---

## Complete User Journey

### 1. New User Registration (B2C Customer)
```
1. Visit Landing Page (/)
2. Click "Sign Up"
3. Fill registration form
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "********"
   - Role: Automatically set to "user"
   - Country: "India"
   - Currency: "INR"
4. Submit → POST /api/auth/register
5. Auto-login and redirect to /dashboard/user
6. See User Dashboard with:
   - Credit balance: 0
   - Upcoming sessions: Empty
   - "Top Up Credits" button
```

### 2. Purchase Credits
```
1. Click "Top Up Credits" button
2. Payment Modal opens
3. Select credit pack:
   - 50 credits for ₹499
   - 150 credits for ₹1,299
   - 500 credits for ₹3,999
4. Choose payment method: UPI or Card
5. Click "Continue to Pay"
6. Enter payment details
7. Razorpay checkout opens
8. Complete payment in Razorpay
9. Return to app → Credits updated
10. See success message
```

### 3. Book a Session
```
1. Click "Book New Session" or visit /browse
2. Browse experts by category
3. Select an expert → /expert/:id
4. View expert profile and availability
5. Select date and time slot
6. Credits deducted from balance
7. Session booked → Status: "pending"
8. Expert receives booking notification
9. Expert accepts → Status: "confirmed"
10. User receives confirmation email
11. On session day, click "Join Video" button
12. Redirected to /session/:sessionId/video
```

### 4. Expert Approval Flow
```
Expert Registration:
1. Sign up with role="expert"
2. Redirected to /expert-onboarding
3. Complete profile (qualifications, specializations, etc.)
4. Submit profile
5. Status: "pending" → Redirected to /under-review
6. Admin reviews in /dashboard/admin/experts
7. Admin approves → Expert status: "approved"
8. Expert can now access /dashboard/expert
9. Expert sets availability
10. Expert visible in /browse for users to book
```

---

## Security & Best Practices

### Role Enforcement
✅ **Backend Middleware**: `backend/src/middleware/auth.ts:67-84`
```typescript
export const authorize = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized', 403);
    }
    next();
  };
};
```

✅ **Frontend Route Protection**: `components/ProtectedRoute.tsx`
```typescript
if (allowedRoles && !allowedRoles.includes(user.role)) {
  return <Navigate to={`/dashboard/${user.role}`} replace />;
}
```

### Payment Security
✅ **Razorpay Signature Verification**: `backend/src/controllers/payment.controller.ts:127-148`
```typescript
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  throw new AppError('Payment verification failed', 400);
}
```

✅ **JWT Token Authentication**: All API requests require valid JWT token in Authorization header

---

## Testing the Complete Flow

### Test User Registration
```bash
# Using curl or Postman
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "user",
  "country": "India",
  "currency": "INR"
}

# Expected Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "role": "user",
    "name": "Test User",
    ...
  }
}
```

### Test Credit Purchase
```bash
POST http://localhost:5000/api/payments/create-razorpay-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 499,
  "currency": "INR"
}

# Expected Response:
{
  "success": true,
  "order": {
    "id": "order_xyz",
    "amount": 49900,
    "currency": "INR"
  }
}
```

---

## Troubleshooting

### User Cannot Access Dashboard
**Problem**: User redirected to login after successful authentication
**Solution**: Check if JWT token is stored in localStorage
```javascript
localStorage.getItem('token') // Should return valid JWT
localStorage.getItem('user')  // Should return user JSON
```

### Wrong Dashboard Access
**Problem**: User role can access other role dashboards
**Solution**: Verify ProtectedRoute has `allowedRoles` prop
```typescript
// ❌ Wrong
<ProtectedRoute><DashboardLayout /></ProtectedRoute>

// ✅ Correct
<ProtectedRoute allowedRoles={['user']}>
  <DashboardLayout type="user" />
</ProtectedRoute>
```

### Payment Not Processing
**Problem**: Razorpay order creation fails
**Solution**: Check environment variables
```bash
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## Summary

✅ **User Roles**: Clearly defined with 4 distinct roles
✅ **Role-Based Access**: Enforced at both frontend (routing) and backend (middleware)
✅ **Payment Gateway**: Razorpay as primary for B2C, Stripe as secondary
✅ **No Confusion**: Single source of truth for authentication, routing, and payments
✅ **Secure**: JWT authentication, payment signature verification, role validation

**Key Files**:
- User Model: `backend/src/models/User.ts`
- Auth Middleware: `backend/src/middleware/auth.ts`
- Auth Context: `context/AuthContext.tsx`
- Protected Routes: `components/ProtectedRoute.tsx`
- App Routing: `App.tsx`
- Payment Controller: `backend/src/controllers/payment.controller.ts`
- Payment Modal: `components/PaymentModal.tsx`
