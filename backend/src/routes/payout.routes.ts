import express from 'express';
import { body } from 'express-validator';
import {
  getExpertEarnings,
  requestPayout,
  getExpertPayouts,
  getPendingPayouts,
  approvePayout,
  rejectPayout,
} from '../controllers/payout.controller';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation rules
const requestPayoutValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod')
    .isIn(['bank_transfer', 'upi', 'paypal', 'stripe'])
    .withMessage('Invalid payment method'),
  body('paymentDetails').isObject().withMessage('Payment details are required'),
];

const approvePayoutValidation = [
  body('transactionId').optional().isString(),
  body('notes').optional().isString(),
];

const rejectPayoutValidation = [
  body('reason').notEmpty().withMessage('Rejection reason is required'),
];

// All routes require authentication
router.use(protect);

// Expert routes
router.get('/earnings', authorize('expert'), getExpertEarnings);
router.post('/', authorize('expert'), validate(requestPayoutValidation), requestPayout);
router.get('/my-payouts', authorize('expert'), getExpertPayouts);

// Admin routes
router.get('/pending', authorize('super_admin'), getPendingPayouts);
router.put('/:id/approve', authorize('super_admin'), validate(approvePayoutValidation), approvePayout);
router.put('/:id/reject', authorize('super_admin'), validate(rejectPayoutValidation), rejectPayout);

export default router;
