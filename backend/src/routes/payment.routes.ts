import express from 'express';
import { body } from 'express-validator';
import {
  createPaymentIntent,
  confirmPayment,
  purchaseCredits,
  confirmCreditPurchase,
  getPaymentHistory,
  requestRefund,
  webhookHandler,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Webhook route (must be before body parser)
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Protected routes
router.use(protect);

const createPaymentValidation = [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
];

const purchaseCreditsValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be at least 1'),
];

router.post('/create-intent', validate(createPaymentValidation), createPaymentIntent);
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);
router.post('/confirm', confirmPayment);
router.post('/credits/purchase', validate(purchaseCreditsValidation), purchaseCredits);
router.post('/credits/confirm', confirmCreditPurchase);
router.get('/history', getPaymentHistory);
router.post('/refund', requestRefund);

export default router;
