import { Response, NextFunction } from 'express';
import Payout from '../models/Payout';
import Expert from '../models/Expert';
import Session from '../models/Session';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

const PLATFORM_COMMISSION_RATE = parseFloat(
  process.env.PLATFORM_COMMISSION_RATE || '0.20'
);

// Get expert earnings and available balance
export const getExpertEarnings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const expert = await Expert.findOne({ userId: req.user._id });
    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    // Calculate total earnings from completed sessions
    const sessions = await Session.find({
      expertId: expert._id,
      status: 'completed',
      paymentStatus: 'paid',
    });

    let totalEarnings = 0;
    sessions.forEach((session) => {
      // Expert gets (100% - platform commission) of the session price
      const expertShare = session.price * (1 - PLATFORM_COMMISSION_RATE);
      totalEarnings += expertShare;
    });

    // Calculate total payouts (approved + processing + completed)
    const payouts = await Payout.find({
      expertId: expert._id,
      status: { $in: ['approved', 'processing', 'completed'] },
    });

    const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount, 0);

    // Calculate pending payouts
    const pendingPayouts = await Payout.find({
      expertId: expert._id,
      status: 'pending',
    });

    const pendingAmount = pendingPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    const availableBalance = totalEarnings - totalPayouts - pendingAmount;

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        totalPayouts,
        pendingPayouts: pendingAmount,
        availableBalance,
        completedSessions: expert.completedSessions || 0,
        currency: expert.currency || 'INR',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Request a payout
export const requestPayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { amount, paymentMethod, paymentDetails, notes } = req.body;

    if (!amount || amount <= 0) {
      throw new AppError('Invalid payout amount', 400);
    }

    if (!paymentMethod) {
      throw new AppError('Payment method is required', 400);
    }

    const expert = await Expert.findOne({ userId: req.user._id });
    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    // Calculate available balance
    const sessions = await Session.find({
      expertId: expert._id,
      status: 'completed',
      paymentStatus: 'paid',
    });

    let totalEarnings = 0;
    sessions.forEach((session) => {
      const expertShare = session.price * (1 - PLATFORM_COMMISSION_RATE);
      totalEarnings += expertShare;
    });

    const existingPayouts = await Payout.find({
      expertId: expert._id,
      status: { $in: ['approved', 'processing', 'completed', 'pending'] },
    });

    const totalPayouts = existingPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    const availableBalance = totalEarnings - totalPayouts;

    if (amount > availableBalance) {
      throw new AppError(
        `Insufficient balance. Available: ${expert.currency || 'INR'} ${availableBalance.toFixed(2)}`,
        400
      );
    }

    // Minimum payout amount check (e.g., 100 INR or 10 USD)
    const minAmount = expert.currency === 'USD' ? 10 : 100;
    if (amount < minAmount) {
      throw new AppError(
        `Minimum payout amount is ${expert.currency || 'INR'} ${minAmount}`,
        400
      );
    }

    // Create payout request
    const payout = await Payout.create({
      expertId: expert._id,
      amount,
      currency: expert.currency || 'INR',
      paymentMethod,
      paymentDetails,
      notes,
      status: 'pending',
    });

    // Create notification for admins
    const admins = await User.find({ role: 'super_admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        type: 'payout_requested',
        title: 'New Payout Request',
        message: `Expert ${expert.userId} requested payout of ${expert.currency || 'INR'} ${amount}`,
        link: `/admin/payouts`,
      });
    }

    logger.info(`Payout requested by expert ${expert._id}: ${amount} ${expert.currency || 'INR'}`);

    res.status(201).json({
      success: true,
      message: 'Payout request submitted successfully',
      data: payout,
    });
  } catch (error) {
    next(error);
  }
};

// Get expert's payout history
export const getExpertPayouts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const expert = await Expert.findOne({ userId: req.user._id });
    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    const payouts = await Payout.find({ expertId: expert._id })
      .sort('-requestedAt')
      .limit(50);

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all pending payout requests
export const getPendingPayouts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payouts = await Payout.find({ status: 'pending' })
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email',
        },
      })
      .sort('-requestedAt');

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve payout request
export const approvePayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { transactionId, notes } = req.body;

    const payout = await Payout.findById(id).populate({
      path: 'expertId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

    if (!payout) {
      throw new AppError('Payout request not found', 404);
    }

    if (payout.status !== 'pending') {
      throw new AppError(`Cannot approve payout with status: ${payout.status}`, 400);
    }

    payout.status = 'approved';
    payout.processedAt = new Date();
    payout.processedBy = req.user!._id;
    if (transactionId) payout.transactionId = transactionId;
    if (notes) payout.notes = notes;

    await payout.save();

    // Create notification for expert
    const expertUserId = (payout.expertId as any).userId._id;
    await Notification.create({
      userId: expertUserId,
      type: 'payout_approved',
      title: 'Payout Approved',
      message: `Your payout request of ${payout.currency} ${payout.amount} has been approved and will be processed shortly.`,
      link: `/dashboard/expert/earnings`,
    });

    logger.info(`Payout ${payout._id} approved by admin ${req.user!._id}`);

    res.status(200).json({
      success: true,
      message: 'Payout approved successfully',
      data: payout,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Reject payout request
export const rejectPayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new AppError('Rejection reason is required', 400);
    }

    const payout = await Payout.findById(id).populate({
      path: 'expertId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

    if (!payout) {
      throw new AppError('Payout request not found', 404);
    }

    if (payout.status !== 'pending') {
      throw new AppError(`Cannot reject payout with status: ${payout.status}`, 400);
    }

    payout.status = 'rejected';
    payout.processedAt = new Date();
    payout.processedBy = req.user!._id;
    payout.rejectionReason = reason;

    await payout.save();

    // Create notification for expert
    const expertUserId = (payout.expertId as any).userId._id;
    await Notification.create({
      userId: expertUserId,
      type: 'payout_rejected',
      title: 'Payout Rejected',
      message: `Your payout request of ${payout.currency} ${payout.amount} was rejected. Reason: ${reason}`,
      link: `/dashboard/expert/earnings`,
    });

    logger.info(`Payout ${payout._id} rejected by admin ${req.user!._id}`);

    res.status(200).json({
      success: true,
      message: 'Payout rejected',
      data: payout,
    });
  } catch (error) {
    next(error);
  }
};
