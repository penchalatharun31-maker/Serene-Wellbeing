import { Response, NextFunction } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Session from '../models/Session';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Create Razorpay Order for Session Booking
 */
export const createPaymentOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId, amount } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Verify user owns this session
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (INR smallest unit)
      currency: 'INR',
      receipt: `session_${session._id.toString()}`,
      notes: {
        sessionId: session._id.toString(),
        userId: req.user!._id.toString(),
      },
    });

    // Update session with order ID
    session.paymentOrderId = order.id;
    await session.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    logger.error('Payment order creation failed:', error);
    next(new AppError('Payment processing failed', 500));
  }
};

/**
 * Verify Razorpay Payment Signature
 */
export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Find session by order ID
    const session = await Session.findOne({ paymentOrderId: razorpay_order_id });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Update session
    session.paymentStatus = 'paid';
    session.status = 'confirmed';
    session.razorpayPaymentId = razorpay_payment_id;
    await session.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
      { sessionId: session._id },
      {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        processedAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      session,
    });
  } catch (error: any) {
    logger.error('Payment verification failed:', error);
    next(new AppError('Payment verification failed', 500));
  }
};

/**
 * Purchase Credits (Company/User)
 */
export const purchaseCredits = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, credits } = req.body;

    if (!amount || !credits) {
      throw new AppError('Amount and credits are required', 400);
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `credits_${req.user!._id.toString()}_${Date.now()}`,
      notes: {
        userId: req.user!._id.toString(),
        credits: credits.toString(),
        type: 'credit_purchase',
      },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    logger.error('Credit purchase failed:', error);
    next(new AppError('Credit purchase failed', 500));
  }
};

/**
 * Verify Credit Purchase Payment
 */
export const verifyCreditPurchase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, credits } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      throw new AppError('Payment not successful', 400);
    }

    // Update user credits
    const user = await User.findById(req.user!._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.credits += credits;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: 'credit_purchase',
      amount: payment.amount / 100,
      currency: 'INR',
      status: 'completed',
      paymentMethod: payment.method,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      metadata: {
        description: `Purchased ${credits} credits`,
      },
      processedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Credits purchased successfully',
      credits: user.credits,
    });
  } catch (error: any) {
    logger.error('Credit purchase verification failed:', error);
    next(new AppError('Credit purchase verification failed', 500));
  }
};

/**
 * Get Payment History
 */
export const getPaymentHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find({ userId: req.user!._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .populate('expertId')
      .populate('sessionId');

    const total = await Transaction.countDocuments({ userId: req.user!._id });

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Refund
 */
export const requestRefund = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId, reason } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Verify ownership
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Check if eligible for refund
    if (session.paymentStatus === 'refunded') {
      throw new AppError('Session already refunded', 400);
    }

    if (!session.razorpayPaymentId) {
      throw new AppError('No payment found for this session', 400);
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(session.razorpayPaymentId);

    // Process refund through Razorpay
    const refund = await razorpay.payments.refund(session.razorpayPaymentId, {
      amount: payment.amount, // Full refund
      notes: {
        reason,
        sessionId: session._id.toString(),
      },
    });

    // Update session
    session.paymentStatus = 'refunded';
    session.status = 'refunded';
    await session.save();

    // Create refund transaction
    await Transaction.create({
      userId: session.userId,
      expertId: session.expertId,
      sessionId: session._id,
      type: 'refund',
      amount: refund.amount / 100,
      currency: 'INR',
      status: 'completed',
      paymentMethod: payment.method,
      razorpayPaymentId: refund.id,
      metadata: {
        description: `Refund for session: ${reason}`,
        originalPaymentId: session.razorpayPaymentId,
      },
      processedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refund,
    });
  } catch (error: any) {
    logger.error('Refund failed:', error);
    next(new AppError('Refund processing failed', 500));
  }
};

/**
 * Razorpay Webhook Handler
 */
export const webhookHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers['x-razorpay-signature'] as string;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.error('Webhook signature verification failed');
      res.status(400).send('Invalid signature');
      return;
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle the event
    switch (event) {
      case 'payment.captured':
        logger.info(`Payment ${payload.payment.entity.id} captured`);

        // Auto-confirm payment if not already confirmed
        const session = await Session.findOne({
          paymentOrderId: payload.payment.entity.order_id,
        });

        if (session && session.paymentStatus !== 'paid') {
          session.paymentStatus = 'paid';
          session.status = 'confirmed';
          session.razorpayPaymentId = payload.payment.entity.id;
          await session.save();
        }
        break;

      case 'payment.failed':
        logger.error(`Payment ${payload.payment.entity.id} failed`);

        // Update session status
        const failedSession = await Session.findOne({
          paymentOrderId: payload.payment.entity.order_id,
        });

        if (failedSession) {
          failedSession.paymentStatus = 'failed';
          await failedSession.save();
        }
        break;

      case 'refund.created':
        logger.info(`Refund ${payload.refund.entity.id} created`);
        break;

      default:
        logger.info(`Unhandled event type ${event}`);
    }

    res.json({ success: true });
  } catch (error: any) {
    logger.error('Webhook handling failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
