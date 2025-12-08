import { Response, NextFunction } from 'express';
import User from '../models/User';
import Expert from '../models/Expert';
import Session from '../models/Session';
import Transaction from '../models/Transaction';
import PromoCode from '../models/PromoCode';
import Company from '../models/Company';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { sendEmail } from '../utils/email';
import logger from '../utils/logger';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // User stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalExperts = await Expert.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const activeExperts = await Expert.countDocuments({
      isApproved: true,
      isAcceptingClients: true,
    });

    // Session stats
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({
      status: 'completed',
    });
    const sessionsThisMonth = await Session.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const sessionsLastMonth = await Session.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Revenue stats
    const revenueData = await Transaction.aggregate([
      {
        $match: {
          type: 'payment',
          status: 'completed',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          platformFees: { $sum: '$metadata.platformFee' },
        },
      },
    ]);

    const lastMonthRevenue = await Transaction.aggregate([
      {
        $match: {
          type: 'payment',
          status: 'completed',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    // Pending approvals
    const pendingExperts = await Expert.countDocuments({
      approvalStatus: 'pending',
    });

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          experts: totalExperts,
          companies: totalCompanies,
          activeExperts,
        },
        sessions: {
          total: totalSessions,
          completed: completedSessions,
          thisMonth: sessionsThisMonth,
          lastMonth: sessionsLastMonth,
          growth:
            sessionsLastMonth > 0
              ? ((sessionsThisMonth - sessionsLastMonth) / sessionsLastMonth) *
                100
              : 0,
        },
        revenue: {
          thisMonth: revenueData[0]?.totalRevenue || 0,
          lastMonth: lastMonthRevenue[0]?.totalRevenue || 0,
          platformFees: revenueData[0]?.platformFees || 0,
          growth:
            lastMonthRevenue[0]?.totalRevenue > 0
              ? ((revenueData[0]?.totalRevenue -
                  lastMonthRevenue[0]?.totalRevenue) /
                  lastMonthRevenue[0]?.totalRevenue) *
                100
              : 0,
        },
        pendingApprovals: pendingExperts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingExperts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const experts = await Expert.find({ approvalStatus: 'pending' })
      .populate('userId', 'name email avatar phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: experts.length,
      experts,
    });
  } catch (error) {
    next(error);
  }
};

export const approveExpert = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expertId } = req.params;

    const expert = await Expert.findById(expertId).populate('userId');

    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    expert.isApproved = true;
    expert.approvalStatus = 'approved';
    await expert.save();

    // Send notification
    await Notification.create({
      userId: expert.userId,
      type: 'expert_approved',
      title: 'Expert Profile Approved',
      message: 'Your expert profile has been approved! You can now start accepting clients.',
      link: '/dashboard/expert',
    });

    // Send email
    const user = expert.userId as any;
    if (user.email) {
      sendEmail({
        to: user.email,
        subject: 'Expert Profile Approved - Serene Wellbeing',
        html: `
          <h1>Congratulations!</h1>
          <p>Your expert profile has been approved and is now live on Serene Wellbeing.</p>
          <p>You can start accepting client bookings right away!</p>
          <a href="${process.env.FRONTEND_URL}/dashboard/expert">Go to Dashboard</a>
        `,
      }).catch((err) => logger.error('Approval email failed:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Expert approved successfully',
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectExpert = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expertId } = req.params;
    const { reason } = req.body;

    const expert = await Expert.findById(expertId).populate('userId');

    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    expert.isApproved = false;
    expert.approvalStatus = 'rejected';
    expert.rejectionReason = reason;
    await expert.save();

    // Send notification
    await Notification.create({
      userId: expert.userId,
      type: 'system',
      title: 'Expert Profile Update Required',
      message: `Your expert profile needs some updates. Reason: ${reason}`,
      link: '/dashboard/expert',
    });

    res.status(200).json({
      success: true,
      message: 'Expert rejected',
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sessions = await Session.find(query)
      .populate('userId', 'name email')
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email',
        },
      })
      .sort('-scheduledDate')
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

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow deleting super admins
    if (user.role === 'super_admin') {
      throw new AppError('Cannot delete super admin users', 403);
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    // If expert, also deactivate expert profile
    if (user.role === 'expert') {
      await Expert.findOneAndUpdate(
        { userId: user._id },
        { isApproved: false, isAcceptingClients: false }
      );
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const createPromoCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      code,
      type,
      value,
      maxUses,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      applicableFor,
    } = req.body;

    const promoCode = await PromoCode.create({
      code,
      type,
      value,
      maxUses,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableFor,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      success: true,
      promoCode,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPromoCodes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isActive } = req.query;

    const query: any = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const promoCodes = await PromoCode.find(query)
      .sort('-createdAt')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: promoCodes.length,
      promoCodes,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePromoCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { promoId } = req.params;

    const promoCode = await PromoCode.findByIdAndUpdate(promoId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!promoCode) {
      throw new AppError('Promo code not found', 404);
    }

    res.status(200).json({
      success: true,
      promoCode,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePromoCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { promoId } = req.params;

    const promoCode = await PromoCode.findByIdAndDelete(promoId);

    if (!promoCode) {
      throw new AppError('Promo code not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Promo code deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const match: any = {
      type: 'payment',
      status: 'completed',
    };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate as string);
      if (endDate) match.createdAt.$lte = new Date(endDate as string);
    }

    const revenueByDay = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalRevenue: { $sum: '$amount' },
          platformFees: { $sum: '$metadata.platformFee' },
          expertEarnings: { $sum: '$metadata.expertEarnings' },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: revenueByDay,
    });
  } catch (error) {
    next(error);
  }
};
