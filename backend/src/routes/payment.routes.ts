import express from 'express';
import { body } from 'express-validator';
import {
  createPaymentOrder,
  verifyPayment,
  purchaseCredits,
  verifyCreditPurchase,
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

const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
];

const purchaseCreditsValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be at least 1'),
];

router.post('/create-intent', validate(createPaymentValidation), createPaymentIntent);
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/create-order', createRazorpayOrder); // Alias for BookSessionModal compatibility
router.post('/verify', verifyRazorpayPayment); // Razorpay payment verification
router.post('/confirm', confirmPayment);
router.post('/credits/purchase', validate(purchaseCreditsValidation), purchaseCredits);
router.post('/credits/verify', verifyCreditPurchase);

// Other routes
router.get('/history', getPaymentHistory);
router.post('/refund', requestRefund);

export default router;
