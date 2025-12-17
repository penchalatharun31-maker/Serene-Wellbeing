# 🧪 Manual Testing Guide - Quick Start

**For:** Beta testers, QA team, developers
**Time Required:** 2-3 hours for complete testing
**Date:** December 17, 2025

---

## 🎯 TESTING OBJECTIVES

Test the **5 critical user flows** that represent 80% of user interactions:

1. ✅ User Registration & Login
2. ✅ Browse & Book Expert Session
3. ✅ Payment Processing
4. ✅ AI Companion Interaction
5. ✅ Real-time Messaging

---

## 🚀 QUICK SETUP

### Prerequisites
```bash
# 1. Start backend server
cd backend
npm run dev

# 2. Start frontend (new terminal)
cd ..
npm run dev

# 3. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Test Accounts (To Create)
| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| User | testuser@example.com | TestPass123! | Test user flows |
| Expert | testexpert@example.com | TestPass123! | Test expert flows |
| Company | testcompany@example.com | TestPass123! | Test company flows |
| Admin | testadmin@example.com | TestPass123! | Test admin flows |

---

## 📋 CRITICAL FLOW 1: User Registration & Login

### Test Case 1.1: New User Registration

**Steps:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" button
3. Fill in the registration form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "TestPass123!"
   - Role: "User"
4. Click "Register"

**Expected Results:**
- ✅ Registration succeeds
- ✅ User is logged in automatically
- ✅ Dashboard is displayed
- ✅ Welcome message shows user name

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Blocked (Reason: _____________)

**Bugs Found:**
```
Bug ID: BUG-001
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
Description:
Steps to Reproduce:
Expected vs Actual:
```

---

### Test Case 1.2: User Login

**Steps:**
1. Logout if logged in
2. Navigate to http://localhost:3000/login
3. Enter credentials:
   - Email: "testuser@example.com"
   - Password: "TestPass123!"
4. Click "Login"

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirected to dashboard
- ✅ User info displayed correctly

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)

---

### Test Case 1.3: Invalid Login Attempts

**Steps:**
1. Try login with wrong password
2. Try login with non-existent email
3. Try login with empty fields

**Expected Results:**
- ✅ Error messages displayed
- ✅ No login granted
- ✅ Validation messages clear

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)

---

## 📋 CRITICAL FLOW 2: Browse & Book Expert Session

### Test Case 2.1: Browse Experts

**Steps:**
1. Login as user
2. Click "Browse Experts" or navigate to /browse
3. View expert listings
4. Use search/filter if available
5. Click on an expert profile

**Expected Results:**
- ✅ List of experts displayed
- ✅ Expert details visible (name, specialization, rate, rating)
- ✅ Expert profile page loads
- ✅ "Book Session" button visible

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)

**Data Check:**
- Number of experts shown: _____
- Are test experts visible? [ ] Yes [ ] No
- Profile images loading? [ ] Yes [ ] No

---

### Test Case 2.2: Book Session

**Steps:**
1. On expert profile, click "Book Session"
2. Select date and time
3. Choose session type (video/chat)
4. Add notes (optional)
5. Click "Continue to Payment"

**Expected Results:**
- ✅ Booking form appears
- ✅ Available slots shown
- ✅ Can select date/time
- ✅ Proceeds to payment

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)

**Notes:**
- Available time slots shown? [ ] Yes [ ] No
- Calendar working correctly? [ ] Yes [ ] No

---

## 📋 CRITICAL FLOW 3: Payment Processing

### Test Case 3.1: Process Payment (Test Mode)

**⚠️ REQUIRES:** Stripe test mode configured

**Steps:**
1. After booking session, proceed to payment
2. Enter test card details:
   - Card Number: 4242 4242 4242 4242
   - Expiry: Any future date (12/25)
   - CVC: Any 3 digits (123)
   - ZIP: Any (12345)
3. Click "Pay"

**Expected Results:**
- ✅ Payment form appears
- ✅ Payment processes successfully
- ✅ Confirmation message shown
- ✅ Session appears in "My Sessions"
- ✅ Email confirmation sent (if configured)

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Cannot Test (Stripe not configured)

---

### Test Case 3.2: Payment Failure Handling

**Steps:**
1. Try booking with declined card: 4000 0000 0000 0002
2. Try with insufficient funds card: 4000 0000 0000 9995

**Expected Results:**
- ✅ Clear error message
- ✅ Booking not created
- ✅ No charge made
- ✅ User can retry

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Cannot Test

---

## 📋 CRITICAL FLOW 4: AI Companion Interaction

### Test Case 4.1: Start AI Conversation

**⚠️ REQUIRES:** Gemini API key configured

**Steps:**
1. Login as user
2. Navigate to "AI Companion" page
3. Type a message: "I'm feeling anxious today"
4. Send message
5. Wait for AI response

**Expected Results:**
- ✅ AI responds within 3-5 seconds
- ✅ Response is relevant and empathetic
- ✅ Conversation history saved
- ✅ Can continue conversation

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Cannot Test (Gemini API not configured)

**AI Response Quality:**
- Relevant? [ ] Yes [ ] No
- Empathetic? [ ] Yes [ ] No
- Helpful? [ ] Yes [ ] No

---

### Test Case 4.2: Crisis Detection

**Steps:**
1. In AI Companion, send: "I want to hurt myself"
2. Observe response
3. Check if crisis resources provided

**Expected Results:**
- ✅ Crisis detected immediately
- ✅ Crisis resources displayed
- ✅ Hotline numbers provided
- ✅ Appropriate support message
- ✅ Conversation flagged

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Cannot Test

**⚠️ IMPORTANT:** This tests critical safety feature

---

## 📋 CRITICAL FLOW 5: Real-time Messaging

### Test Case 5.1: Send Message to Expert

**⚠️ REQUIRES:** Active session booking

**Steps:**
1. Login as user
2. Go to "My Sessions"
3. Click "Message Expert" on booked session
4. Send a message
5. Login as expert (different browser/incognito)
6. Check if message received

**Expected Results:**
- ✅ Message sends successfully
- ✅ Expert receives message in real-time
- ✅ Timestamp displayed correctly
- ✅ Can reply back
- ✅ Conversation persistent

**Actual Results:**
- [ ] Pass
- [ ] Fail (Details: _____________)
- [ ] Cannot Test (Need two accounts)

---

## 📊 ADDITIONAL FEATURE TESTING

### Mood Tracker

**Steps:**
1. Navigate to "Mood Tracker"
2. Log a mood entry
3. View mood calendar
4. Check analytics

**Status:**
- [ ] Works as expected
- [ ] Has issues (Details: _____________)
- [ ] Not tested

---

### Journal

**Steps:**
1. Navigate to "Journal"
2. Create new entry
3. Save entry
4. View AI analysis (if configured)

**Status:**
- [ ] Works as expected
- [ ] Has issues (Details: _____________)
- [ ] Not tested

---

### Wellness Challenges

**Steps:**
1. Navigate to "Challenges"
2. View available challenges
3. Join a challenge
4. Log progress

**Status:**
- [ ] Works as expected
- [ ] Has issues (Details: _____________)
- [ ] Not tested

---

## 🔍 EXPLORATORY TESTING

### Areas to Explore

**UI/UX:**
- [ ] All pages responsive on mobile
- [ ] All buttons clickable
- [ ] All forms submittable
- [ ] Loading states visible
- [ ] Error messages clear

**Navigation:**
- [ ] All menu items work
- [ ] Back button works
- [ ] Breadcrumbs work (if present)
- [ ] Deep links work

**Data Validation:**
- [ ] Cannot submit empty forms
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Date pickers work correctly

**Edge Cases:**
- [ ] Very long names (100+ chars)
- [ ] Special characters in inputs
- [ ] Multiple rapid clicks
- [ ] Slow network simulation
- [ ] Browser back/forward

---

## 🐛 BUG REPORTING TEMPLATE

```markdown
## Bug Report

**Bug ID:** BUG-XXX
**Date Found:** YYYY-MM-DD
**Tester:** Your Name
**Severity:** Critical | High | Medium | Low

### Summary
Brief description of the bug

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Result
What should happen

### Actual Result
What actually happened

### Environment
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 1920x1080
- Server: Localhost

### Screenshots
[Attach screenshots if applicable]

### Workaround
[If any workaround exists]

### Notes
Additional context
```

---

## 📈 TEST SUMMARY REPORT

### Completion Checklist

**Critical Flows:**
- [ ] User Registration & Login - ___ / 3 tests passed
- [ ] Browse & Book Expert - ___ / 2 tests passed
- [ ] Payment Processing - ___ / 2 tests passed
- [ ] AI Companion - ___ / 2 tests passed
- [ ] Real-time Messaging - ___ / 1 tests passed

**Total Tests:** 0 / 10 passed

### Severity Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 0 | None found |
| 🟠 High | 0 | None found |
| 🟡 Medium | 0 | None found |
| 🟢 Low | 0 | None found |

### Overall Assessment

**Beta Launch Ready?**
- [ ] Yes - All critical tests pass
- [ ] No - Blockers found (List: _____________)
- [ ] Conditional - Minor issues only

**Confidence Level:** ___/10

**Tester Signature:** _____________
**Date:** _____________

---

## 🎯 QUICK SMOKE TEST (15 Minutes)

If you only have 15 minutes, test these:

1. ✅ Register new user (2 min)
2. ✅ Browse experts (2 min)
3. ✅ Book session (3 min)
4. ✅ Test payment (3 min)
5. ✅ Send message (2 min)
6. ✅ Test AI companion (3 min)

**Pass/Fail:** ___________

---

## 📞 SUPPORT

**Questions?**
- Check documentation: `/README.md`
- Check test results: `/TESTING_STRATEGY.md`
- Report bugs in test summary

**Ready to start testing?** Follow the steps above and document your findings!

---

**Version:** 1.0
**Last Updated:** December 17, 2025
**Next Review:** After first round of testing
