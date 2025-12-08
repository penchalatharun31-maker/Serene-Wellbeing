import { Response, NextFunction } from 'express';
import Session from '../models/Session';
import Expert from '../models/Expert';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import geminiService from '../services/gemini.service';

export const getExpertAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Revenue by day
    const revenueByDay = await Session.aggregate([
      {
        $match: {
          expertId: expert._id,
          status: 'completed',
          completedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          revenue: { $sum: '$metadata.expertCommission' },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Sessions by status
    const sessionsByStatus = await Session.aggregate([
      {
        $match: {
          expertId: expert._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Average rating trend
    const ratingTrend = await Session.aggregate([
      {
        $match: {
          expertId: expert._id,
          status: 'completed',
          rating: { $exists: true },
          completedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Peak booking hours
    const peakHours = await Session.aggregate([
      {
        $match: {
          expertId: expert._id,
          status: { $in: ['confirmed', 'completed'] },
          scheduledDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $substr: ['$scheduledTime', 0, 2] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        revenueByDay,
        sessionsByStatus,
        ratingTrend,
        peakHours,
        summary: {
          totalRevenue: revenueByDay.reduce((sum, day) => sum + day.revenue, 0),
          totalSessions: revenueByDay.reduce(
            (sum, day) => sum + day.sessions,
            0
          ),
          avgRevenue:
            revenueByDay.length > 0
              ? revenueByDay.reduce((sum, day) => sum + day.revenue, 0) /
                revenueByDay.length
              : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { period = '30d' } = req.query;

    const now = new Date();
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Sessions completed
    const completedSessions = await Session.find({
      userId: req.user!._id,
      status: 'completed',
      completedAt: { $gte: startDate },
    })
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name',
        },
      })
      .select('rating review completedAt expertId');

    // Spending by category
    const spendingByCategory = await Session.aggregate([
      {
        $match: {
          userId: req.user!._id,
          status: 'completed',
          completedAt: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: 'experts',
          localField: 'expertId',
          foreignField: '_id',
          as: 'expert',
        },
      },
      { $unwind: '$expert' },
      { $unwind: '$expert.specialization' },
      {
        $group: {
          _id: '$expert.specialization',
          amount: { $sum: '$price' },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    // Session frequency
    const sessionsByMonth = await Session.aggregate([
      {
        $match: {
          userId: req.user!._id,
          status: 'completed',
          completedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$completedAt' },
          },
          count: { $sum: 1 },
          spent: { $sum: '$price' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate AI insights
    let aiInsights = null;
    if (completedSessions.length > 0) {
      const sessionTypes = [
        ...new Set(
          completedSessions.flatMap((s: any) => s.expertId?.specialization || [])
        ),
      ];
      const ratings = completedSessions
        .filter((s: any) => s.rating)
        .map((s: any) => s.rating);

      // Calculate journey duration in months
      const firstSession = completedSessions[completedSessions.length - 1];
      const monthsDiff = Math.ceil(
        (now.getTime() - new Date(firstSession.completedAt).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );

      aiInsights = await geminiService.generateWellnessInsights({
        completedSessions: completedSessions.length,
        sessionTypes: sessionTypes as string[],
        ratings,
        duration: monthsDiff,
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        completedSessions: completedSessions.length,
        spendingByCategory,
        sessionsByMonth,
        aiInsights,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatformAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const match: any = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate as string);
      if (endDate) match.createdAt.$lte = new Date(endDate as string);
    }

    // User growth
    const userGrowth = await User.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Session trends
    const sessionTrends = await Session.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          bookings: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue trends
    const revenueTrends = await Transaction.aggregate([
      {
        $match: {
          ...match,
          type: 'payment',
          status: 'completed',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          platformFees: { $sum: '$metadata.platformFee' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top experts
    const topExperts = await Session.aggregate([
      {
        $match: {
          status: 'completed',
          ...match,
        },
      },
      {
        $group: {
          _id: '$expertId',
          totalSessions: { $sum: 1 },
          totalRevenue: { $sum: '$metadata.expertCommission' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'experts',
          localField: '_id',
          foreignField: '_id',
          as: 'expert',
        },
      },
      { $unwind: '$expert' },
      {
        $lookup: {
          from: 'users',
          localField: 'expert.userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          expertName: '$user.name',
          specialization: '$expert.specialization',
          totalSessions: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Popular categories
    const popularCategories = await Session.aggregate([
      {
        $match: {
          status: 'completed',
          ...match,
        },
      },
      {
        $lookup: {
          from: 'experts',
          localField: 'expertId',
          foreignField: '_id',
          as: 'expert',
        },
      },
      { $unwind: '$expert' },
      { $unwind: '$expert.specialization' },
      {
        $group: {
          _id: '$expert.specialization',
          sessions: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { sessions: -1 } },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        userGrowth,
        sessionTrends,
        revenueTrends,
        topExperts,
        popularCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};
