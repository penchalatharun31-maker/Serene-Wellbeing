import { Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Session from "../models/Session";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../utils/errors";
import logger from "../utils/logger";
import {
  isValidCurrency,
  validateAmount,
  getCurrencyMultiplier,
} from "../utils/payment";
import { isValidTimezone } from "../utils/timezone";

// Initialize Razorpay (non-blocking - will fail gracefully if not configured)
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logger.info("Razorpay initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Razorpay:", error);
  }
} else {
  logger.warn(
    "Razorpay credentials not configured - payment features will be disabled"
  );
}

/**
 * Create Razorpay Order for Session Booking
 * Supports multiple currencies and timezones
 */
export const createPaymentOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!razorpay) {
    return next(new AppError("Payment service is not configured", 503));
  }
  try {
    const { sessionId, amount, currency, timezone } = req.body;

    // Validate session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }

    // Verify user owns this session
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    // Fetch user to get preferred currency/timezone if not provided
    const user = await User.findById(req.user!._id);
    const finalCurrency =
      currency ||
      user?.preferredCurrency ||
      process.env.DEFAULT_CURRENCY ||
      "INR";
    const finalTimezone =
      timezone || user?.timezone || process.env.DEFAULT_TIMEZONE || "UTC";

    // Validate currency
    if (!isValidCurrency(finalCurrency)) {
      throw new AppError(`Currency ${finalCurrency} is not supported`, 400);
    }

    // Validate amount
    const amountValidation = validateAmount(amount, finalCurrency);
    if (!amountValidation.isValid) {
      throw new AppError(amountValidation.error!, 400);
    }

    // Validate timezone
    if (!isValidTimezone(finalTimezone)) {
      throw new AppError(`Invalid timezone: ${finalTimezone}`, 400);
    }

    // Convert amount to smallest currency unit
    const currencyMultiplier = getCurrencyMultiplier(finalCurrency);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * currencyMultiplier),
      currency: finalCurrency.toUpperCase(),
      receipt: `session_${session._id.toString()}`,
      notes: {
        sessionId: session._id.toString(),
        userId: req.user!._id.toString(),
        timezone: finalTimezone,
      },
    });

    // Update session with order ID, currency, and timezone
    session.paymentOrderId = order.id;
    session.currency = finalCurrency;
    session.timezone = finalTimezone;
    await session.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    // Handle Razorpay-specific errors
    if (error.error?.code === "BAD_REQUEST_ERROR") {
      logger.error("Razorpay bad request:", error);
      return next(new AppError("Invalid payment details", 400));
    }
    if (error.error?.code === "GATEWAY_ERROR") {
      logger.error("Razorpay gateway error:", error);
      return next(new AppError("Payment gateway temporarily unavailable", 503));
    }
    if (error.statusCode === 429) {
      logger.error("Razorpay rate limit:", error);
      return next(
        new AppError("Too many requests, please try again later", 429)
      );
    }

    logger.error("Payment order creation failed:", error);
    next(
      error instanceof AppError
        ? error
        : new AppError("Payment processing failed", 500)
    );
  }
};

// Note: getCurrencyMultiplier is imported from ../utils/payment

/**
 * Verify Razorpay Payment Signature
 */
export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!razorpay) {
    return next(new AppError("Payment service is not configured", 503));
  }
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError("Missing required payment fields", 400);
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError("Invalid payment signature", 400);
    }

    // Find session by order ID
    const session = await Session.findOne({
      paymentOrderId: razorpay_order_id,
    });

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    // Verify user owns this session
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Not authorized to verify this payment", 403);
    }

    // Check if payment already verified (prevent double verification)
    if (session.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        session,
      });
    }

    // Update session
    session.paymentStatus = "paid";
    session.status = "confirmed";
    session.razorpayPaymentId = razorpay_payment_id;
    await session.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
      { sessionId: session._id },
      {
        status: "completed",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        processedAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      session,
    });
  } catch (error: any) {
    logger.error("Payment verification failed:", error);
    next(new AppError("Payment verification failed", 500));
  }
};

/**
 * Purchase Credits (Company/User)
 * Supports multiple currencies
 */
export const purchaseCredits = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!razorpay) {
    return next(new AppError("Payment service is not configured", 503));
  }
  try {
    const { amount, credits, currency } = req.body;

    // Validate required fields
    if (!amount || !credits) {
      throw new AppError("Amount and credits are required", 400);
    }

    // Validate amount is positive
    if (amount <= 0) {
      throw new AppError("Amount must be greater than 0", 400);
    }

    // Validate credits is positive integer
    if (credits <= 0 || !Number.isInteger(credits)) {
      throw new AppError("Credits must be a positive integer", 400);
    }

    // Fetch user to get preferred currency
    const user = await User.findById(req.user!._id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const finalCurrency =
      currency ||
      user?.preferredCurrency ||
      process.env.DEFAULT_CURRENCY ||
      "INR";

    // Validate currency
    if (!isValidCurrency(finalCurrency)) {
      throw new AppError(`Currency ${finalCurrency} is not supported`, 400);
    }

    // Validate amount with currency-specific min/max
    const amountValidation = validateAmount(amount, finalCurrency);
    if (!amountValidation.isValid) {
      throw new AppError(amountValidation.error!, 400);
    }

    const currencyMultiplier = getCurrencyMultiplier(finalCurrency);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * currencyMultiplier),
      currency: finalCurrency.toUpperCase(),
      receipt: `credits_${req.user!._id.toString()}_${Date.now()}`,
      notes: {
        userId: req.user!._id.toString(),
        credits: credits.toString(),
        type: "credit_purchase",
        currency: finalCurrency,
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
    // Handle Razorpay-specific errors
    if (error.error?.code === "BAD_REQUEST_ERROR") {
      logger.error("Razorpay bad request:", error);
      return next(new AppError("Invalid payment details", 400));
    }
    if (error.error?.code === "GATEWAY_ERROR") {
      logger.error("Razorpay gateway error:", error);
      return next(new AppError("Payment gateway temporarily unavailable", 503));
    }
    if (error.statusCode === 429) {
      logger.error("Razorpay rate limit:", error);
      return next(
        new AppError("Too many requests, please try again later", 429)
      );
    }

    logger.error("Credit purchase failed:", error);
    next(
      error instanceof AppError
        ? error
        : new AppError("Credit purchase failed", 500)
    );
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
  if (!razorpay) {
    return next(new AppError("Payment service is not configured", 503));
  }
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      credits,
    } = req.body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !credits
    ) {
      throw new AppError("Missing required fields", 400);
    }

    // Validate credits is positive integer
    if (credits <= 0 || !Number.isInteger(credits)) {
      throw new AppError("Credits must be a positive integer", 400);
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError("Invalid payment signature", 400);
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured" && payment.status !== "authorized") {
      throw new AppError("Payment not successful", 400);
    }

    // Check if payment was already processed (prevent double credit)
    const existingTransaction = await Transaction.findOne({
      razorpay_payment_id,
    });
    if (existingTransaction) {
      throw new AppError("Payment already processed", 400);
    }

    // Update user credits
    const user = await User.findById(req.user!._id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.credits += credits;
    await user.save();

    // Get currency from payment
    const paymentCurrency = payment.currency || "INR";
    const currencyMultiplier = getCurrencyMultiplier(paymentCurrency);

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: "credit_purchase",
      amount: payment.amount / currencyMultiplier,
      currency: paymentCurrency.toUpperCase(),
      status: "completed",
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
      message: "Credits purchased successfully",
      credits: user.credits,
    });
  } catch (error: any) {
    logger.error("Credit purchase verification failed:", error);
    next(new AppError("Credit purchase verification failed", 500));
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

    // Validate pagination parameters
    if (isNaN(pageNum) || pageNum < 1) {
      throw new AppError("Invalid page number", 400);
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new AppError("Limit must be between 1 and 100", 400);
    }

    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find({ userId: req.user!._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum)
      .populate("expertId")
      .populate("sessionId");

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
  if (!razorpay) {
    return next(new AppError("Payment service is not configured", 503));
  }
  try {
    const { sessionId, reason } = req.body;

    // Validate required fields
    if (!sessionId || !reason) {
      throw new AppError("Session ID and reason are required", 400);
    }

    // Validate reason is not empty
    if (typeof reason !== "string" || reason.trim().length === 0) {
      throw new AppError("Reason must be a non-empty string", 400);
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    // Verify ownership
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    // Check if eligible for refund
    if (session.paymentStatus === "refunded") {
      throw new AppError("Session already refunded", 400);
    }

    if (!session.razorpayPaymentId) {
      throw new AppError("No payment found for this session", 400);
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
    session.paymentStatus = "refunded";
    session.status = "refunded";
    await session.save();

    // Get currency from payment
    const paymentCurrency = payment.currency || session.currency || "INR";
    const currencyMultiplier = getCurrencyMultiplier(paymentCurrency);

    // Create refund transaction
    await Transaction.create({
      userId: session.userId,
      expertId: session.expertId,
      sessionId: session._id,
      type: "refund",
      amount: refund.amount / currencyMultiplier,
      currency: paymentCurrency.toUpperCase(),
      status: "completed",
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
      message: "Refund processed successfully",
      refund,
    });
  } catch (error: any) {
    logger.error("Refund failed:", error);
    next(new AppError("Refund processing failed", 500));
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
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Check webhook secret is configured
    if (!secret) {
      logger.error("Webhook secret not configured");
      res.status(500).send("Webhook not configured");
      return;
    }

    const signature = req.headers["x-razorpay-signature"] as string;

    // Check signature header exists
    if (!signature) {
      logger.error("Missing webhook signature");
      res.status(400).send("Missing signature");
      return;
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.error("Webhook signature verification failed");
      res.status(400).send("Invalid signature");
      return;
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Validate event and payload exist
    if (!event || !payload) {
      logger.error("Invalid webhook payload");
      res.status(400).send("Invalid payload");
      return;
    }

    // Handle the event
    switch (event) {
      case "payment.captured":
        logger.info(`Payment ${payload.payment.entity.id} captured`);

        // Auto-confirm payment if not already confirmed
        const session = await Session.findOne({
          paymentOrderId: payload.payment.entity.order_id,
        });

        if (session && session.paymentStatus !== "paid") {
          session.paymentStatus = "paid";
          session.status = "confirmed";
          session.razorpayPaymentId = payload.payment.entity.id;
          await session.save();
        }
        break;

      case "payment.failed":
        logger.error(`Payment ${payload.payment.entity.id} failed`);

        // Update session status
        const failedSession = await Session.findOne({
          paymentOrderId: payload.payment.entity.order_id,
        });

        if (failedSession) {
          failedSession.paymentStatus = "failed";
          await failedSession.save();
        }
        break;

      case "refund.created":
        logger.info(`Refund ${payload.refund.entity.id} created`);
        break;

      default:
        logger.info(`Unhandled event type ${event}`);
    }

    res.json({ success: true });
  } catch (error: any) {
    logger.error("Webhook handling failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
