import { Response, NextFunction } from 'express';
import Session from '../models/Session';
import Expert from '../models/Expert';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { sendBookingConfirmation } from '../utils/email';
import logger from '../utils/logger';

const PLATFORM_COMMISSION_RATE = parseFloat(
  process.env.PLATFORM_COMMISSION_RATE || '0.20'
);

export const createSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expertId, scheduledDate, scheduledTime, duration, notes, useCredits } =
      req.body;

    // Validate expert
    const expert = await Expert.findById(expertId).populate('userId');
    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    if (!expert.isApproved || expert.approvalStatus !== 'approved') {
      throw new AppError('Expert is not approved', 400);
    }

    if (!expert.isAcceptingClients) {
      throw new AppError('Expert is not accepting new clients', 400);
    }

    // Check for scheduling conflicts
    const conflictingSession = await Session.findOne({
      expertId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflictingSession) {
      throw new AppError('This time slot is already booked', 409);
    }

    // Calculate price
    const durationHours = duration / 60;
    const totalPrice = expert.hourlyRate * durationHours;
    const platformCommission = totalPrice * PLATFORM_COMMISSION_RATE;
    const expertCommission = totalPrice - platformCommission;

    // Check if user wants to use credits
    let creditsUsed = 0;
    let amountToPay = totalPrice;

    if (useCredits) {
      const user = await User.findById(req.user!._id);
      if (user && user.credits > 0) {
        creditsUsed = Math.min(user.credits, totalPrice);
        amountToPay = totalPrice - creditsUsed;

        // Deduct credits
        user.credits -= creditsUsed;
        await user.save();
      }
    }

    // Create session
    const session = await Session.create({
      userId: req.user!._id,
      expertId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      price: totalPrice,
      notes,
      paymentStatus: amountToPay === 0 ? 'paid' : 'pending',
      status: 'pending',
      metadata: {
        expertCommission,
        platformCommission,
        userCreditsUsed: creditsUsed,
      },
    });

    // Create transaction record
    await Transaction.create({
      userId: req.user!._id,
      expertId,
      sessionId: session._id,
      type: 'payment',
      amount: totalPrice,
      status: amountToPay === 0 ? 'completed' : 'pending',
      paymentMethod: useCredits ? 'credits' : 'card',
      metadata: {
        platformFee: platformCommission,
        expertEarnings: expertCommission,
        description: `Session booking with ${(expert.userId as any).name}`,
      },
    });

    // Send notifications
    await Notification.create({
      userId: expert.userId,
      type: 'booking_confirmed',
      title: 'New Booking Request',
      message: `You have a new booking request for ${new Date(
        scheduledDate
      ).toLocaleDateString()} at ${scheduledTime}`,
      link: `/dashboard/expert`,
    });

    // Send confirmation email
    const user = await User.findById(req.user!._id);
    if (user) {
      sendBookingConfirmation(user.email, user.name, {
        expertName: (expert.userId as any).name,
        date: new Date(scheduledDate).toLocaleDateString(),
        time: scheduledTime,
        duration,
        price: totalPrice,
      }).catch((err) => logger.error('Confirmation email failed:', err));
    }

    const populatedSession = await Session.findById(session._id)
      .populate('userId', 'name email avatar')
      .populate('expertId');

    res.status(201).json({
      success: true,
      session: populatedSession,
      amountToPay,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { userId: req.user!._id };

    if (status) {
      query.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sessions = await Session.find(query)
      .populate('expertId')
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email avatar',
        },
      })
      .sort('-scheduledDate -scheduledTime')
      .skip(skip)
      .limit(limitNum);

    const total = await Session.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { expertId: expert._id };

    if (status) {
      query.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sessions = await Session.find(query)
      .populate('userId', 'name email avatar phone')
      .sort('-scheduledDate -scheduledTime')
      .skip(skip)
      .limit(limitNum);

    const total = await Session.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('userId', 'name email avatar phone')
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email avatar phone',
        },
      });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Check authorization
    const expert = await Expert.findById(session.expertId);
    if (
      session.userId.toString() !== req.user!._id.toString() &&
      expert?.userId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'super_admin'
    ) {
      throw new AppError('Not authorized to view this session', 403);
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, meetingLink, notes } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Check authorization (expert can update)
    const expert = await Expert.findById(session.expertId);
    if (
      expert?.userId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'super_admin'
    ) {
      throw new AppError('Not authorized to update this session', 403);
    }

    if (status) session.status = status;
    if (meetingLink) session.meetingLink = meetingLink;
    if (notes) session.notes = notes;

    if (status === 'completed') {
      session.completedAt = new Date();

      // Update expert stats
      if (expert) {
        expert.completedSessions += 1;
        expert.totalSessions += 1;
        expert.totalEarnings += session.metadata.expertCommission;
        await expert.save();
      }

      // Create notification for user
      await Notification.create({
        userId: session.userId,
        type: 'session_reminder',
        title: 'Session Completed',
        message: 'Please rate your recent session',
        link: `/rate-session/${session._id}`,
      });
    }

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('userId', 'name email avatar')
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email avatar',
        },
      });

    res.status(200).json({
      success: true,
      session: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cancelReason } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Check if session can be cancelled
    if (session.status === 'completed') {
      throw new AppError('Cannot cancel completed session', 400);
    }

    if (session.status === 'cancelled') {
      throw new AppError('Session is already cancelled', 400);
    }

    // Check authorization
    const expert = await Expert.findById(session.expertId);
    if (
      session.userId.toString() !== req.user!._id.toString() &&
      expert?.userId.toString() !== req.user!._id.toString()
    ) {
      throw new AppError('Not authorized to cancel this session', 403);
    }

    // Calculate refund (full refund if more than 24 hours before session)
    const sessionDateTime = new Date(session.scheduledDate);
    const hoursUntilSession =
      (sessionDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    let refundAmount = 0;
    if (hoursUntilSession >= 24) {
      refundAmount = session.price;
    } else if (hoursUntilSession >= 12) {
      refundAmount = session.price * 0.5; // 50% refund
    }
    // No refund if less than 12 hours

    // Update session
    session.status = 'cancelled';
    session.cancelReason = cancelReason;
    session.cancelledBy = req.user!._id;
    session.cancelledAt = new Date();
    await session.save();

    // Process refund
    if (refundAmount > 0) {
      const user = await User.findById(session.userId);
      if (user) {
        // Refund as credits
        user.credits += refundAmount;
        await user.save();

        // Create refund transaction
        await Transaction.create({
          userId: session.userId,
          expertId: session.expertId,
          sessionId: session._id,
          type: 'refund',
          amount: refundAmount,
          status: 'completed',
          paymentMethod: 'credits',
          metadata: {
            description: 'Session cancellation refund',
          },
        });
      }
    }

    // Update expert stats if cancelled by user
    if (expert && session.userId.toString() === req.user!._id.toString()) {
      expert.cancelledSessions += 1;
      await expert.save();
    }

    // Send notifications
    const notifyUserId =
      session.userId.toString() === req.user!._id.toString()
        ? expert?.userId
        : session.userId;

    if (notifyUserId) {
      await Notification.create({
        userId: notifyUserId,
        type: 'session_cancelled',
        title: 'Session Cancelled',
        message: `A session scheduled for ${new Date(
          session.scheduledDate
        ).toLocaleDateString()} has been cancelled`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      refundAmount,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const rateSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rating, review } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Check authorization
    if (session.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized to rate this session', 403);
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      throw new AppError('Can only rate completed sessions', 400);
    }

    // Check if already rated
    if (session.rating) {
      throw new AppError('Session already rated', 400);
    }

    // Update session
    session.rating = rating;
    session.review = review;
    session.reviewedAt = new Date();
    await session.save();

    // Update expert rating
    const expert = await Expert.findById(session.expertId);
    if (expert) {
      const totalRating = expert.rating * expert.reviewCount + rating;
      expert.reviewCount += 1;
      expert.rating = totalRating / expert.reviewCount;
      await expert.save();

      // Create notification for expert
      await Notification.create({
        userId: expert.userId,
        type: 'review_received',
        title: 'New Review',
        message: `You received a ${rating}-star review`,
        link: `/dashboard/expert`,
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessions = await Session.find({
      userId: req.user!._id,
      status: { $in: ['pending', 'confirmed'] },
      scheduledDate: { $gte: new Date() },
    })
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name avatar',
        },
      })
      .sort('scheduledDate scheduledTime')
      .limit(5);

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};
