# 📅 Session Booking Flow - Detailed Implementation Plan

**Feature:** Complete end-to-end session booking with payment
**Priority:** 🔴 Critical (Highest ROI)
**Estimated Time:** 16-20 hours
**Dependencies:** Razorpay account, email service

---

## 🎯 User Story

**As a customer**, I want to:
1. Browse experts and view their profiles
2. Select an available date/time slot
3. Confirm booking details
4. Pay securely via Razorpay
5. Receive confirmation email
6. See the session in my dashboard
7. Join the video call when it's time

**As an expert**, I want to:
1. Set my availability (working hours)
2. Receive booking notifications
3. See upcoming sessions in my dashboard
4. Accept or reject booking requests (optional feature)

---

## 🏗️ Architecture Overview

### Data Flow
```
┌─────────────┐
│   User      │
│  Browses    │
│  Experts    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Expert Profile  │
│ Click "Book"    │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ BookSessionModal     │
│ - Select Date        │
│ - Select Time        │
│ - Choose Duration    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Show Available Slots │
│ (API: GET /expert/   │
│  :id/availability)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Confirm Booking      │
│ - Expert info        │
│ - Date/Time          │
│ - Price              │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ PaymentModal         │
│ Razorpay Integration │
└──────┬───────────────┘
       │
       ├─SUCCESS─────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ Create      │   │  Update      │
│ Session     │   │  Payment     │
│ in DB       │   │  Status      │
└──────┬──────┘   └──────┬───────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │ Send Emails     │
       │ - User confirm  │
       │ - Expert notify │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │ Success Page    │
       │ Show booking ID │
       │ Next steps      │
       └─────────────────┘
```

---

## 📦 Components to Create

### 1. BookSessionModal.tsx
**Location:** `/components/BookSessionModal.tsx`
**Size:** ~300-400 lines

**Props:**
```typescript
interface BookSessionModalProps {
  expert: {
    id: string;
    name: string;
    avatar: string;
    category: string;
    rate: number;
    currency: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
}
```

**State:**
```typescript
const [step, setStep] = useState<'select-date' | 'select-time' | 'confirm' | 'payment'>('select-date');
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [selectedTime, setSelectedTime] = useState<string | null>(null);
const [duration, setDuration] = useState<30 | 60 | 90 | 120>(60);
const [availableSlots, setAvailableSlots] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [totalPrice, setTotalPrice] = useState(0);
```

**Features:**
- Multi-step wizard (Date → Time → Confirm → Payment)
- Real-time availability checking
- Price calculation based on duration
- Responsive design (mobile + desktop)
- Loading states
- Error handling

**API Calls:**
```typescript
// 1. Fetch expert availability
GET /api/v1/experts/:expertId/availability?date=2026-01-15

// 2. Create session (after payment success)
POST /api/v1/sessions
{
  expertId: string,
  scheduledDate: string,
  scheduledTime: string,
  duration: number,
  paymentId: string
}
```

---

### 2. CalendarPicker.tsx
**Location:** `/components/CalendarPicker.tsx`
**Size:** ~150-200 lines

**Props:**
```typescript
interface CalendarPickerProps {
  expertId: string;
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
}
```

**Features:**
- Month view calendar
- Disable past dates
- Highlight available dates (fetch from API)
- Show busy/available indicators
- Responsive mobile view

**Libraries:**
```bash
npm install react-day-picker date-fns
```

**API Integration:**
```typescript
// Fetch expert's available dates for the month
GET /api/v1/experts/:expertId/available-dates?month=2026-01&year=2026
Response: { availableDates: ['2026-01-15', '2026-01-16', ...] }
```

---

### 3. TimeSlotPicker.tsx
**Location:** `/components/TimeSlotPicker.tsx`
**Size:** ~100-150 lines

**Props:**
```typescript
interface TimeSlotPickerProps {
  expertId: string;
  selectedDate: Date;
  duration: 30 | 60 | 90 | 120;
  onSelectTime: (time: string) => void;
  selectedTime: string | null;
}
```

**Features:**
- Grid of available time slots
- Visual distinction between available/booked/break
- Timezone display
- 15-minute slot intervals

**API Call:**
```typescript
GET /api/v1/experts/:expertId/availability?date=2026-01-15&duration=60
Response: {
  availableSlots: [
    { time: '09:00', available: true },
    { time: '09:15', available: false },
    { time: '10:00', available: true },
    ...
  ]
}
```

---

### 4. PaymentModal.tsx
**Location:** `/components/PaymentModal.tsx`
**Size:** ~200-250 lines

**Props:**
```typescript
interface PaymentModalProps {
  amount: number;
  currency: string;
  bookingDetails: {
    expertName: string;
    date: string;
    time: string;
    duration: number;
  };
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (error: string) => void;
  onClose: () => void;
}
```

**Razorpay Integration:**
```typescript
// 1. Create order
POST /api/v1/payments/create-order
{
  amount: 1500,
  currency: 'INR',
  notes: { expertId, sessionDate, sessionTime }
}
Response: { orderId: 'order_xxx', amount: 1500 }

// 2. Initialize Razorpay
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY_ID,
  amount: 1500 * 100, // paise
  currency: 'INR',
  order_id: 'order_xxx',
  name: 'Serene Wellbeing',
  description: 'Therapy Session with Dr. Name',
  handler: (response) => {
    // Verify payment on backend
    verifyPayment(response);
  },
  prefill: {
    name: user.name,
    email: user.email,
    contact: user.phone
  },
  theme: { color: '#3b82f6' }
};

// 3. Verify payment
POST /api/v1/payments/verify
{
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
```

**Script Loading:**
```html
<!-- Add to index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

### 5. PaymentSuccess.tsx
**Location:** `/pages/PaymentSuccess.tsx`
**Size:** ~100-150 lines

**URL:** `/booking/success?sessionId=xxx&paymentId=xxx`

**Features:**
- Success animation (checkmark icon)
- Booking details summary
- Expert info
- Next steps (join session, add to calendar)
- Download receipt button
- Navigate to dashboard

**Data Source:**
```typescript
GET /api/v1/sessions/:sessionId
Response: {
  id: string,
  expert: { name, avatar, category },
  scheduledDate: string,
  scheduledTime: string,
  duration: number,
  amount: number,
  paymentId: string,
  status: 'confirmed'
}
```

---

### 6. PaymentFailed.tsx
**Location:** `/pages/PaymentFailed.tsx`
**Size:** ~80-100 lines

**URL:** `/booking/failed?error=xxx`

**Features:**
- Error message display
- Retry payment button
- Contact support link
- Navigate back to expert profile

---

## 🔌 Backend API Endpoints

### New Endpoints Needed

#### 1. Expert Availability

```typescript
// GET /api/v1/experts/:expertId/availability
// Query params: date, duration (optional)
// Response: Available time slots for the date

router.get('/experts/:expertId/availability',
  validate(availabilityValidation),
  getExpertAvailability
);

Controller:
export const getExpertAvailability = async (req, res) => {
  const { expertId } = req.params;
  const { date, duration = 60 } = req.query;

  // 1. Get expert's working hours from Expert model
  const expert = await Expert.findById(expertId);

  // 2. Get existing sessions for that date
  const existingSessions = await Session.find({
    expertId,
    scheduledDate: date,
    status: { $in: ['pending', 'confirmed', 'in-progress'] }
  });

  // 3. Calculate available slots
  const availableSlots = calculateAvailableSlots(
    expert.workingHours[dayOfWeek],
    existingSessions,
    duration
  );

  res.json({ success: true, availableSlots });
};
```

#### 2. Get Available Dates for Month

```typescript
// GET /api/v1/experts/:expertId/available-dates
// Query params: month, year
// Response: Array of dates with availability

router.get('/experts/:expertId/available-dates',
  validate(availableDatesValidation),
  getAvailableDates
);

Controller:
export const getAvailableDates = async (req, res) => {
  const { expertId } = req.params;
  const { month, year } = req.query;

  // Get expert working days
  const expert = await Expert.findById(expertId);

  // Get all dates in month where expert works
  const availableDates = getDatesInMonth(year, month)
    .filter(date => expert.workingDays.includes(date.getDay()));

  res.json({ success: true, availableDates });
};
```

#### 3. Create Session (Enhanced)

```typescript
// POST /api/v1/sessions
// Body: { expertId, scheduledDate, scheduledTime, duration, paymentId }

export const createSession = async (req, res) => {
  const { expertId, scheduledDate, scheduledTime, duration, paymentId } = req.body;

  // 1. Verify payment
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.status !== 'success') {
    throw new AppError('Invalid payment', 400);
  }

  // 2. Check slot still available (race condition)
  const existing = await Session.findOne({
    expertId,
    scheduledDate,
    scheduledTime,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existing) {
    throw new AppError('Slot no longer available', 409);
  }

  // 3. Create session
  const session = await Session.create({
    userId: req.user._id,
    expertId,
    scheduledDate,
    scheduledTime,
    duration,
    amount: payment.amount,
    paymentId,
    status: 'confirmed'
  });

  // 4. Send confirmation emails
  await sendBookingConfirmationEmails(session);

  res.status(201).json({ success: true, session });
};
```

#### 4. Set Expert Availability (Admin/Expert Only)

```typescript
// PUT /api/v1/experts/availability
// Body: { workingHours, workingDays, breakTimes }

router.put('/experts/availability',
  protect,
  authorize('expert'),
  validate(setAvailabilityValidation),
  setExpertAvailability
);

Controller:
export const setExpertAvailability = async (req, res) => {
  const { workingHours, workingDays, breakTimes } = req.body;

  const expert = await Expert.findOne({ userId: req.user._id });

  expert.workingHours = workingHours;
  expert.workingDays = workingDays;
  expert.breakTimes = breakTimes;

  await expert.save();

  res.json({ success: true, expert });
};
```

---

## 🗄️ Database Schema Updates

### Expert Model Enhancement

```typescript
// Add to Expert schema
{
  // Existing fields...

  // NEW FIELDS for availability
  workingHours: {
    type: Map,
    of: {
      start: String,  // "09:00"
      end: String,    // "17:00"
      enabled: Boolean
    },
    default: {
      '0': { start: '09:00', end: '17:00', enabled: false }, // Sunday
      '1': { start: '09:00', end: '17:00', enabled: true },  // Monday
      '2': { start: '09:00', end: '17:00', enabled: true },
      '3': { start: '09:00', end: '17:00', enabled: true },
      '4': { start: '09:00', end: '17:00', enabled: true },
      '5': { start: '09:00', end: '17:00', enabled: true },
      '6': { start: '09:00', end: '17:00', enabled: false }  // Saturday
    }
  },

  breakTimes: [{
    start: String,   // "12:00"
    end: String,     // "13:00"
    days: [Number]   // [1, 2, 3, 4, 5] = Mon-Fri
  }],

  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },

  slotDuration: {
    type: Number,
    default: 15,  // 15-minute slots
    enum: [15, 30, 60]
  }
}
```

### Session Model Enhancement

```typescript
// Add/update in Session schema
{
  // Existing fields...

  scheduledDate: {
    type: Date,
    required: true
  },

  scheduledTime: {
    type: String,  // "14:30"
    required: true
  },

  duration: {
    type: Number,
    required: true,
    enum: [30, 60, 90, 120]  // minutes
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },

  // Video session details
  roomId: String,
  joinUrl: String,

  // Ratings (filled after session)
  rating: Number,
  review: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📧 Email Notifications

### 1. Booking Confirmation Email (User)

**Trigger:** After successful payment
**Template:** `booking-confirmation-user.html`

```html
Subject: Your session with {expertName} is confirmed! 🎉

Hi {userName},

Great news! Your therapy session has been confirmed.

Session Details:
- Expert: {expertName}
- Date: {date}
- Time: {time}
- Duration: {duration} minutes
- Amount Paid: {currency} {amount}

What's Next?
1. Add to your calendar: [Add to Calendar Button]
2. You'll receive a reminder 24 hours before
3. Join the session from your dashboard

[View in Dashboard] [Download Receipt]

Questions? Reply to this email or contact support.

Best regards,
Serene Wellbeing Team
```

### 2. New Booking Notification (Expert)

**Trigger:** After successful payment
**Template:** `new-booking-expert.html`

```html
Subject: New Booking Alert - {userName} 📅

Hi {expertName},

You have a new session booking!

Client Details:
- Name: {userName}
- Date: {date}
- Time: {time}
- Duration: {duration} minutes
- Amount: {currency} {amount}

[View Client Profile] [View in Dashboard]

Best regards,
Serene Wellbeing Team
```

### 3. Session Reminder (24 hours before)

**Trigger:** Cron job (24 hours before session)
**Template:** `session-reminder.html`

```html
Subject: Reminder: Your session with {expertName} is tomorrow

Hi {userName},

This is a friendly reminder about your upcoming session:

- Date: Tomorrow, {date}
- Time: {time}
- Expert: {expertName}

[Prepare for Session] [Join Now (when time)]

Need to reschedule? Contact us at least 24 hours in advance.
```

---

## 🎨 UI/UX Design

### BookSessionModal Design

```
┌─────────────────────────────────────────────┐
│  Book a Session with Dr. Sarah Khan    ✕   │
├─────────────────────────────────────────────┤
│                                             │
│  Step 1 of 4: Select Date                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │     January 2026                    │   │
│  │  S  M  T  W  T  F  S               │   │
│  │           1  2  3  4  5            │   │
│  │  6  7  8  9 10 11 12               │   │
│  │ 13 14 [15] 16 17 18 19             │   │
│  │ 20 21 22 23 24 25 26               │   │
│  │ 27 28 29 30 31                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⓘ Available dates are highlighted         │
│                                             │
│              [Cancel]  [Next →]             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Book a Session with Dr. Sarah Khan    ✕   │
├─────────────────────────────────────────────┤
│                                             │
│  Step 2 of 4: Select Time                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                             │
│  January 15, 2026                          │
│                                             │
│  Duration:                                  │
│  ○ 30 min (₹750)                           │
│  ● 60 min (₹1500)  ← Selected              │
│  ○ 90 min (₹2250)                          │
│                                             │
│  Available Slots:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │09:00 │ │10:00 │ │11:00 │ │      │      │
│  └──────┘ └──────┘ └──────┘ │Booked│      │
│                              └──────┘      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │14:00 │ │15:00 │ │16:00 │ │17:00 │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│              [← Back]  [Next →]             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Book a Session with Dr. Sarah Khan    ✕   │
├─────────────────────────────────────────────┤
│                                             │
│  Step 3 of 4: Confirm Booking              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ [Avatar] Dr. Sarah Khan            │    │
│  │          Clinical Psychologist     │    │
│  └────────────────────────────────────┘    │
│                                             │
│  📅 Date: January 15, 2026                 │
│  🕐 Time: 2:00 PM - 3:00 PM IST            │
│  ⏱️  Duration: 60 minutes                  │
│  💰 Amount: ₹1,500                         │
│                                             │
│  ℹ️ Cancellation policy:                   │
│  Free cancellation up to 24 hours before.  │
│                                             │
│              [← Back]  [Proceed to Pay →]  │
└─────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] CalendarPicker renders correctly
- [ ] TimeSlotPicker shows available slots
- [ ] Payment amount calculation correct
- [ ] Date/time validation works

### Integration Tests
- [ ] Full booking flow works end-to-end
- [ ] Payment success creates session in DB
- [ ] Email notifications sent
- [ ] Session appears in user dashboard
- [ ] Session appears in expert dashboard

### Edge Cases
- [ ] Slot becomes unavailable during booking (race condition)
- [ ] Payment fails halfway
- [ ] User closes modal during payment
- [ ] Network error during booking
- [ ] Expert has no availability
- [ ] Past dates cannot be selected
- [ ] Duplicate payment prevention

### Browser Testing
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive (iOS Safari, Chrome Android)
- [ ] Razorpay popup works on mobile

---

## 📝 Implementation Steps (Ordered)

### Phase 1: Backend Setup (4-5 hours)

**Step 1:** Update Expert model
```bash
1. Add workingHours, breakTimes, timezone fields
2. Create migration script to set defaults for existing experts
3. Test in MongoDB
```

**Step 2:** Create availability endpoints
```bash
1. POST /api/v1/experts/availability (set working hours)
2. GET /api/v1/experts/:id/availability (get slots)
3. GET /api/v1/experts/:id/available-dates (get dates)
4. Add validation schemas
5. Add unit tests
```

**Step 3:** Enhance session creation endpoint
```bash
1. Add payment verification
2. Add slot availability check (prevent race condition)
3. Add email notification triggers
4. Update response format
```

**Step 4:** Set up email service
```bash
1. Install nodemailer or SendGrid SDK
2. Create email templates
3. Create email service with sendBookingConfirmation()
4. Test email sending
```

---

### Phase 2: Frontend Components (6-8 hours)

**Step 5:** Create CalendarPicker component
```bash
1. Install react-day-picker, date-fns
2. Build calendar UI
3. Integrate API to fetch available dates
4. Add loading states
5. Style with Tailwind
6. Mobile responsive
```

**Step 6:** Create TimeSlotPicker component
```bash
1. Build slot grid UI
2. Integrate availability API
3. Handle slot selection
4. Show booked/available states
5. Add timezone display
```

**Step 7:** Create BookSessionModal component
```bash
1. Set up multi-step wizard (4 steps)
2. Integrate CalendarPicker
3. Integrate TimeSlotPicker
4. Add confirmation step
5. Add validation
6. Connect to payment modal
7. Handle errors
```

**Step 8:** Create PaymentModal component
```bash
1. Add Razorpay script to index.html
2. Create payment order API call
3. Initialize Razorpay checkout
4. Handle success callback
5. Handle failure callback
6. Verify payment on backend
7. Redirect to success page
```

**Step 9:** Create PaymentSuccess page
```bash
1. Fetch session details by ID
2. Display booking summary
3. Add "Add to Calendar" button
4. Add "Download Receipt" button
5. Add "Go to Dashboard" CTA
```

**Step 10:** Create PaymentFailed page
```bash
1. Display error message
2. Add retry button
3. Add support contact link
```

---

### Phase 3: Integration (3-4 hours)

**Step 11:** Integrate with ExpertProfile page
```bash
1. Add "Book Session" button
2. Open BookSessionModal on click
3. Pass expert data to modal
4. Handle modal close
5. Refresh page on success
```

**Step 12:** Update User Dashboard
```bash
1. Fetch user's upcoming sessions
2. Display session cards
3. Add "Join Session" button (for VideoSession)
4. Add "Cancel Session" option
```

**Step 13:** Update Expert Dashboard
```bash
1. Fetch expert's upcoming sessions
2. Display client bookings
3. Add session details
4. Show earnings for each session
```

---

### Phase 4: Testing & Polish (2-3 hours)

**Step 14:** End-to-end testing
```bash
1. Test complete booking flow
2. Test payment success scenario
3. Test payment failure scenario
4. Test email notifications
5. Test on mobile devices
```

**Step 15:** Error handling & edge cases
```bash
1. Add proper error messages
2. Handle network failures gracefully
3. Prevent duplicate bookings
4. Add loading indicators everywhere
```

**Step 16:** Polish & UX improvements
```bash
1. Add animations (modal transitions, success checkmark)
2. Optimize mobile layout
3. Add accessibility (ARIA labels, keyboard navigation)
4. Final styling tweaks
```

---

## 📊 Success Metrics

**After implementation, we should see:**
- ✅ Users can book sessions in < 2 minutes
- ✅ Payment success rate > 95%
- ✅ Email delivery rate > 98%
- ✅ Mobile booking works smoothly
- ✅ Zero race condition booking conflicts
- ✅ Expert calendars update in real-time

---

## 🚀 Deployment Checklist

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxx

# Backend (.env)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
EMAIL_FROM=noreply@serenewellbeing.com
SENDGRID_API_KEY=SG.xxx
FRONTEND_URL=https://serenewellbeing.com
```

### Pre-launch
- [ ] Test Razorpay in production mode
- [ ] Test email delivery from production
- [ ] Verify SSL certificates
- [ ] Test on real mobile devices
- [ ] Load test payment endpoints
- [ ] Set up error monitoring (Sentry)
- [ ] Create admin panel to view bookings

---

## 💰 Razorpay Setup

### Test Mode (Development)
1. Create Razorpay account
2. Get test API keys
3. Use test card: 4111 1111 1111 1111
4. CVV: Any 3 digits
5. Expiry: Any future date

### Live Mode (Production)
1. Complete KYC verification
2. Add bank account details
3. Get live API keys
4. Enable auto-settlements
5. Set up webhook for payment.success

---

## 🎯 Next Steps After This Feature

Once booking flow is complete:
1. ✅ Expert can set availability (Week 2)
2. ✅ Expert can accept/reject bookings (Week 2)
3. ✅ Session reminder emails (Week 3)
4. ✅ Cancellation/rescheduling flow (Week 3)
5. ✅ Post-session rating (Week 4)

---

**Ready to start implementation?**

Recommended approach:
1. **Backend first** (Steps 1-4) - Get APIs ready
2. **Frontend components** (Steps 5-10) - Build UI
3. **Integration** (Steps 11-13) - Connect everything
4. **Testing** (Steps 14-16) - Polish and ship!

Let me know if you want me to:
- **Start building now** (I'll implement step-by-step)
- **Review/modify the plan** (any changes needed?)
- **Provide more details** on any specific component

Which would you prefer? 🚀
