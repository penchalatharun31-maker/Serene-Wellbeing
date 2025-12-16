import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Session from '../models/Session';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

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

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        sessionId: session._id.toString(),
        userId: req.user!._id.toString(),
      },
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
