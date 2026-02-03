/**
 * PAYMENT GATEWAY ARCHITECTURE (B2C)
 *
 * PRIMARY PAYMENT GATEWAY: Razorpay
 * - Used for all B2C transactions (credit purchases, session bookings)
 * - Supports UPI, Cards, NetBanking for Indian users
 * - Main endpoints: /create-razorpay-order, /verify
 *
 * SECONDARY PAYMENT GATEWAY: Stripe (kept for future international expansion)
 * - Currently used as fallback for international users
 * - Main endpoints: /create-intent, /confirm
 *
 * B2C USER FLOW:
 * 1. User selects credits/session
 * 2. Frontend calls /create-razorpay-order
 * 3. Razorpay checkout opens
 * 4. User completes payment
 * 5. Frontend calls /verify to confirm payment
 * 6. Credits/session status updated
 */

import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Session from '../models/Session';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

// Stripe instance (for international transactions if needed)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export const createPaymentIntent = async (
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

    // Determine currency: prioritize session currency, fallback to 'inr' (for Razorpay compliance if needed)
    const currency = session.currency ? session.currency.toLowerCase() : 'inr';

    // Create payment intent using Stripe (keeping existing logic for now, but dynamic)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/paise
      currency: currency,
      metadata: {
        sessionId: session._id.toString(),
        userId: req.user!._id.toString(),
      },
      // Note: For India (INR), description and shipping address might be required by Stripe regulations
      description: `Session with Expert ${session.expertId}`,
    });

    // Update session with payment intent
    session.paymentIntentId = paymentIntent.id;
    await session.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    logger.error('Payment intent creation failed:', error);
    next(new AppError('Payment processing failed', 500));
  }
};

const Razorpay = require('razorpay');

/**
 * PRIMARY B2C PAYMENT METHOD - RAZORPAY
 * Creates a Razorpay order for credit purchase or session booking
 * This is the main payment endpoint for all B2C users
 */
export const createRazorpayOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId, amount, currency } = req.body;

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_stub',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
    });

    const options = {
      amount: Math.round(amount * 100), // amount in lowest denomination (paise)
      currency: currency || 'INR',
      receipt: sessionId || `rcpt_${Date.now()}`,
      notes: {
        userId: req.user ? req.user._id.toString() : 'guest'
      }
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Razorpay order creation failed:', error);
    next(new AppError('Payment processing failed', 500));
  }
};

/**
 * Verify Razorpay payment signature after checkout
 * Confirms the payment was genuinely processed by Razorpay
 */
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError('Missing payment verification fields', 400);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'secret';
    const generatedSignature = require('crypto')
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      throw new AppError('Payment signature verification failed', 400);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not successful', 400);
    }

    // Update session
    const session = await Session.findOne({ paymentIntentId });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    session.paymentStatus = 'paid';
    session.status = 'confirmed';
    await session.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
      { sessionId: session._id },
      {
        status: 'completed',
        stripeChargeId: paymentIntent.id,
        processedAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      session,
    });
  } catch (error: any) {
    logger.error('Payment confirmation failed:', error);
    next(new AppError('Payment confirmation failed', 500));
  }
};

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

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: req.user!._id.toString(),
        credits: credits.toString(),
        type: 'credit_purchase',
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    logger.error('Credit purchase failed:', error);
    next(new AppError('Credit purchase failed', 500));
  }
};

export const confirmCreditPurchase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not successful', 400);
    }

    const credits = parseInt(paymentIntent.metadata.credits);

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
      amount: paymentIntent.amount / 100,
      currency: 'usd',
      status: 'completed',
      paymentMethod: 'card',
      stripeChargeId: paymentIntent.id,
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
    logger.error('Credit purchase confirmation failed:', error);
    next(new AppError('Credit purchase confirmation failed', 500));
  }
};

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

    if (!session.paymentIntentId) {
      throw new AppError('No payment found for this session', 400);
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: session.paymentIntentId,
      reason: 'requested_by_customer',
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
      amount: session.price,
      status: 'completed',
      paymentMethod: 'card',
      stripeChargeId: refund.id,
      metadata: {
        description: `Refund for session: ${reason}`,
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

export const webhookHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logger.info(`PaymentIntent ${paymentIntent.id} succeeded`);

      // Auto-confirm payment if not already confirmed
      const session = await Session.findOne({
        paymentIntentId: paymentIntent.id,
      });

      if (session && session.paymentStatus !== 'paid') {
        session.paymentStatus = 'paid';
        session.status = 'confirmed';
        await session.save();
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      logger.error(`PaymentIntent ${failedPayment.id} failed`);

      // Update session status
      const failedSession = await Session.findOne({
        paymentIntentId: failedPayment.id,
      });

      if (failedSession) {
        failedSession.paymentStatus = 'failed';
        await failedSession.save();
      }
      break;

    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
