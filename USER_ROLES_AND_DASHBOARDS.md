# User Roles and Dashboard Bifurcation

## Overview
Serene Wellbeing platform supports 4 distinct user roles, each with their own dashboard and workflows.

---

## 1. 👤 B2C Customer (`role: 'user'`)

### Description
Individual users booking mental health sessions with experts.

### How They Join
- **Onboarding Flow** (`/onboarding`) - 6-step guided flow
  1. Emotional entry (select concern)
  2. Assessment (frequency, support type)
  3. Preferences (communication style, language, budget)
  4. Expert matching results
  5. Account creation
  6. Book session with payment
- **Direct Signup** (`/signup`) with role='user'

### Dashboard Route
```
/dashboard/user
```

### Key Features
- ✅ Browse and search experts
- ✅ Book sessions with Razorpay payment
- ✅ View upcoming/past sessions
- ✅ Manage personal profile
- ✅ View session history
- ✅ Access session recordings/notes
- ✅ Rate and review experts

### Redirect After Login
```typescript
navigate('/dashboard/user')
```

---

## 2. 🎓 Expert (`role: 'expert'`)

### Description
Mental health professionals providing sessions to customers.

### How They Join
- **Expert Application** (`/apply-expert`) - Multi-step application form
- **Admin Approval Required** - Super Admin reviews and approves
- Account created with role='expert'

### Dashboard Route
```
/dashboard/expert
```

### Key Features
- ✅ Manage availability calendar
- ✅ View pending booking requests
- ✅ Accept/reject session bookings
- ✅ View upcoming sessions
- ✅ Track earnings and request payouts
- ✅ Manage expert profile
- ✅ View session history
- ✅ Access patient notes (if applicable)

### Redirect After Login
```typescript
navigate('/dashboard/expert')
```

### Sub-Sections
1. **Overview** - Stats, upcoming sessions
2. **Availability** - Set available time slots
3. **Bookings** - Pending requests, upcoming sessions
4. **Earnings** - View earnings, request payouts
5. **Profile** - Manage expert profile
6. **Settings** - Account settings

---

## 3. 🏢 Company/B2B (`role: 'company'`)

### Description
Organizations purchasing credits for employee mental health benefits.

### How They Join
- **Company Signup** (`/signup`) with role='company'
- Or **Custom B2B Onboarding** (if implemented)

### Dashboard Route
```
/dashboard/company
```

### Key Features
- ✅ Purchase credit packages
- ✅ Invite employees
- ✅ Manage employee access
- ✅ View company-wide usage analytics
- ✅ Track credit balance
- ✅ Download invoices
- ✅ Add/remove admin users

### Redirect After Login
```typescript
navigate('/dashboard/company')
```

### Sub-Sections
1. **Overview** - Credits balance, employee usage
2. **Credits & Billing** - Purchase credits, payment history
3. **Employees** - Invite/manage employees
4. **Settings** - Company details, billing info
5. **Analytics** - Usage reports (if implemented)

---

## 4. 👑 Super Admin (`role: 'super_admin'`)

### Description
Platform administrators managing the entire ecosystem.

### How They Join
- **Created via Backend** - Manual creation by developers
- Or **First Admin Signup** (if implemented)

### Dashboard Route
```
/dashboard/super_admin`
```

### Key Features
- ✅ Review and approve expert applications
- ✅ Approve/reject payout requests
- ✅ View platform-wide analytics
- ✅ Manage all users
- ✅ View all sessions
- ✅ Handle disputes
- ✅ Manage promo codes
- ✅ CMS content management

### Redirect After Login
```typescript
navigate('/dashboard/super_admin')
```

### Sub-Sections
1. **Overview** - Platform stats, recent activity
2. **Expert Approvals** - Review pending expert applications
3. **Payouts Management** - Approve/reject payout requests
4. **Users** - Manage all users
5. **Sessions** - View all platform sessions
6. **Disputes** - Handle user disputes
7. **Promo Codes** - Create/manage promo codes
8. **CMS** - Edit homepage content

---

## Role-Based Routing Logic

### Authentication Context (`context/AuthContext.tsx`)

```typescript
const login = async (email: string, password: string) => {
  const response = await authService.login({ email, password });

  // Store user data
  setUser(response.user);

  // Navigate based on role
  navigate(`/dashboard/${response.user.role}`);
};
```

### Role Mapping
| User Role      | Dashboard Route          | Primary Use Case           |
|----------------|-------------------------|----------------------------|
| `user`         | `/dashboard/user`       | B2C customer booking       |
| `expert`       | `/dashboard/expert`     | Mental health professional |
| `company`      | `/dashboard/company`    | B2B organization           |
| `super_admin`  | `/dashboard/super_admin`| Platform administrator     |

---

## Current Implementation Status

### ✅ Fully Implemented
- [x] User (B2C) dashboard
- [x] Expert dashboard
- [x] Company dashboard
- [x] Super Admin dashboard
- [x] Role-based routing in AuthContext
- [x] Protected routes by role

### ⚠️ Needs Verification
- [ ] User onboarding creates accounts with role='user' correctly
- [ ] All login flows respect user roles
- [ ] Dashboard components check user role
- [ ] Navigation guards prevent unauthorized access

### 🐛 Known Issues (Fixed in This Commit)
- ❌ **FIXED:** Onboarding flow hardcoded redirect to `/dashboard/user`
- ❌ **FIXED:** BookSessionModal didn't respect user role on success
- ✅ **NOW:** Dynamic role-based routing after booking

---

## Testing Each Role

### Test User (B2C Customer)
```bash
1. Go to /onboarding
2. Complete 6-step flow
3. Should create account with role='user'
4. After booking payment → Should redirect to /dashboard/user
5. Should see booked sessions in "My Sessions"
```

### Test Expert
```bash
1. Login with expert credentials
2. Should redirect to /dashboard/expert
3. Should see "Availability", "Bookings", "Earnings" tabs
4. Should NOT see company or admin features
```

### Test Company (B2B)
```bash
1. Login with company credentials
2. Should redirect to /dashboard/company
3. Should see "Credits", "Employees", "Billing" tabs
4. Should NOT see expert or admin features
```

### Test Super Admin
```bash
1. Login with super_admin credentials
2. Should redirect to /dashboard/super_admin
3. Should see "Expert Approvals", "Payouts", "Analytics" tabs
4. Should have access to all platform features
```

---

## Security Considerations

### Route Protection
All dashboard routes should be protected:
```typescript
<Route path="/dashboard/user" element={
  <ProtectedRoute requiredRole="user">
    <UserDashboard />
  </ProtectedRoute>
} />
```

### Role Validation
Backend APIs should verify user role:
```typescript
router.get('/payouts/pending',
  protect,
  authorize('super_admin'), // Only super_admin can access
  getPendingPayouts
);
```

---

## Future Enhancements

1. **Role Permissions System**
   - Granular permissions beyond roles
   - Custom permission sets

2. **Multi-Role Support**
   - Users with multiple roles (e.g., expert + company admin)
   - Role switcher in UI

3. **Sub-Admin Roles**
   - Company admins (manage company, not full platform)
   - Support admins (handle disputes, no financial access)

4. **Audit Logs**
   - Track all role-based actions
   - Admin activity monitoring

---

**Last Updated:** 2026-01-04
**Version:** 1.0
**Status:** Active - Role bifurcation implemented
