import { Response, NextFunction } from 'express';
import Expert from '../models/Expert';
import User from '../models/User';
import Review from '../models/Review';
import Session from '../models/Session';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import geminiService from '../services/gemini.service';
import logger from '../utils/logger';

export const getAllExperts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      specialization,
      minRate,
      maxRate,
      minRating,
      language,
      search,
      page = 1,
      limit = 12,
      sort = '-rating',
    } = req.query;

    const query: any = { isApproved: true, approvalStatus: 'approved', isAcceptingClients: true };

    // Apply filters
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    if (language) {
      query.languages = { $in: [language] };
    }

    // Build experts query
    let expertsQuery = Expert.find(query).populate('userId', 'name email avatar');

    // Apply search if provided
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: 'i' },
        role: 'expert',
      }).select('_id');

      const userIds = users.map((u) => u._id);
      expertsQuery = expertsQuery.where('userId').in(userIds);
    }

    // Apply sorting
    expertsQuery = expertsQuery.sort(sort as string);

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    expertsQuery = expertsQuery.skip(skip).limit(limitNum);

    const experts = await expertsQuery;
    const total = await Expert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: experts.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      experts,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findById(req.params.id).populate(
      'userId',
      'name email avatar phone'
    );

    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    // Get reviews
    const reviews = await Review.find({
      expertId: expert._id,
      isPublished: true,
    })
      .populate('userId', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    // Increment profile views
    expert.profileViews += 1;
    await expert.save();

    res.status(200).json({
      success: true,
      expert,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertByUserId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.params.userId }).populate(
      'userId',
      'name email avatar phone'
    );

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const createExpertProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      specialization,
      bio,
      experience,
      hourlyRate,
      languages,
      certifications,
      education,
    } = req.body;

    // Check if expert profile already exists
    const existingExpert = await Expert.findOne({ userId: req.user!._id });
    if (existingExpert) {
      throw new AppError('Expert profile already exists', 400);
    }

    // Update user role to expert
    await User.findByIdAndUpdate(req.user!._id, { role: 'expert' });

    const expert = await Expert.create({
      userId: req.user!._id,
      title,
      specialization,
      bio,
      experience,
      hourlyRate,
      languages,
      certifications,
      education,
      approvalStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpertProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fieldsToUpdate: any = {
      title: req.body.title,
      specialization: req.body.specialization,
      bio: req.body.bio,
      experience: req.body.experience,
      hourlyRate: req.body.hourlyRate,
      languages: req.body.languages,
      certifications: req.body.certifications,
      education: req.body.education,
      availability: req.body.availability,
      isAcceptingClients: req.body.isAcceptingClients,
      maxClientsPerDay: req.body.maxClientsPerDay,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const expert = await Expert.findOneAndUpdate(
      { userId: req.user!._id },
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { availability } = req.body;

    const expert = await Expert.findOneAndUpdate(
      { userId: req.user!._id },
      { availability },
      { new: true, runValidators: true }
    );

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    // Get session stats
    const sessions = await Session.find({ expertId: expert._id });

    const upcomingSessions = await Session.countDocuments({
      expertId: expert._id,
      status: { $in: ['pending', 'confirmed'] },
      scheduledDate: { $gte: new Date() },
    });

    const completedThisMonth = await Session.countDocuments({
      expertId: expert._id,
      status: 'completed',
      completedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    // Get earnings this month
    const earningsThisMonth = await Session.aggregate([
      {
        $match: {
          expertId: expert._id,
          status: 'completed',
          completedAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$metadata.expertCommission' },
        },
      },
    ]);

    // Get recent reviews
    const recentReviews = await Review.find({
      expertId: expert._id,
      isPublished: true,
    })
      .populate('userId', 'name avatar')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalEarnings: expert.totalEarnings,
        totalSessions: expert.totalSessions,
        completedSessions: expert.completedSessions,
        cancelledSessions: expert.cancelledSessions,
        upcomingSessions,
        completedThisMonth,
        earningsThisMonth: earningsThisMonth[0]?.total || 0,
        rating: expert.rating,
        reviewCount: expert.reviewCount,
        profileViews: expert.profileViews,
      },
      recentReviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { concerns, preferences } = req.body;

    // Get user's previous sessions
    const previousSessions = await Session.find({
      userId: req.user!._id,
      status: 'completed',
    }).populate('expertId');

    // Generate AI recommendations
    const recommendations = await geminiService.getExpertRecommendations({
      concerns,
      preferences,
      previousSessions,
    });

    // Get matching experts
    const matchingExperts = await Expert.find({
      isApproved: true,
      approvalStatus: 'approved',
      isAcceptingClients: true,
      specialization: { $in: concerns || [] },
    })
      .populate('userId', 'name avatar')
      .limit(6)
      .sort('-rating');

    res.status(200).json({
      success: true,
      aiRecommendations: recommendations,
      experts: matchingExperts,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeExpertProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    // Generate profile analysis using Gemini
    const analysis = await geminiService.analyzeExpertProfile({
      bio: expert.bio,
      specializations: expert.specialization,
      experience: expert.experience,
      rating: expert.rating,
    });

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, duration } = req.query;

    if (!date || !duration) {
      throw new AppError('Date and duration are required', 400);
    }

    const expert = await Expert.findById(id);

    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    if (!expert.isApproved || expert.approvalStatus !== 'approved') {
      throw new AppError('Expert is not available for booking', 400);
    }

    // Get day of week
    const targetDate = new Date(date as string);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[targetDate.getDay()] as keyof typeof expert.availability;
    const dayOfWeek = targetDate.getDay();

    // Get expert's availability for that day
    const dayAvailability = expert.availability[dayName] || [];

    if (dayAvailability.length === 0) {
      return res.status(200).json({
        success: true,
        date: date as string,
        availableSlots: [],
        message: 'Expert is not available on this day',
      });
    }

    // Get booked slots for that date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSessions = await Session.find({
      expertId: expert._id,
      scheduledDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $in: ['pending', 'confirmed'] },
    }).select('scheduledTime endTime');

    const bookedSlots = bookedSessions.map((s) => ({
      startTime: s.scheduledTime,
      endTime: s.endTime,
    }));

    // Import helper and generate available slots
    const { generateAvailableSlots } = await import('../utils/availabilityHelper');

    const availableSlots = generateAvailableSlots(
      dayAvailability,
      Number(duration),
      bookedSlots,
      expert.breakTimes || [],
      dayOfWeek,
      targetDate
    );

    res.status(200).json({
      success: true,
      date: date as string,
      duration: Number(duration),
      timezone: expert.timezone,
      availableSlots,
      totalSlots: availableSlots.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertAvailableDates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      throw new AppError('Year and month are required', 400);
    }

    const expert = await Expert.findById(id);

    if (!expert) {
      throw new AppError('Expert not found', 404);
    }

    if (!expert.isApproved || expert.approvalStatus !== 'approved') {
      throw new AppError('Expert is not available for booking', 400);
    }

    const targetYear = Number(year);
    const targetMonth = Number(month) - 1; // JavaScript months are 0-indexed

    // Get all booked sessions for the month
    const startOfMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const bookedSessions = await Session.find({
      expertId: expert._id,
      scheduledDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      status: { $in: ['pending', 'confirmed'] },
    }).select('scheduledDate scheduledTime endTime');

    // Group booked slots by date
    const bookedSlotsByDate = new Map<string, Array<{ startTime: string; endTime: string }>>();
    bookedSessions.forEach((session) => {
      const dateStr = session.scheduledDate.toISOString().split('T')[0];
      if (!bookedSlotsByDate.has(dateStr)) {
        bookedSlotsByDate.set(dateStr, []);
      }
      bookedSlotsByDate.get(dateStr)!.push({
        startTime: session.scheduledTime,
        endTime: session.endTime,
      });
    });

    // Import helper and get available dates
    const { getAvailableDatesInMonth } = await import('../utils/availabilityHelper');

    const availableDates = getAvailableDatesInMonth(
      targetYear,
      targetMonth,
      expert.availability,
      expert.slotDuration || 60,
      bookedSlotsByDate,
      expert.breakTimes || []
    );

    res.status(200).json({
      success: true,
      year: targetYear,
      month: targetMonth + 1,
      timezone: expert.timezone,
      availableDates,
      totalDays: availableDates.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpertAvailability = async (
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

    const { availability, timezone, slotDuration, breakTimes } = req.body;

    // Validate availability format
    if (availability) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      for (const day of dayNames) {
        if (availability[day]) {
          if (!Array.isArray(availability[day])) {
            throw new AppError(`Invalid availability format for ${day}`, 400);
          }
          for (const slot of availability[day]) {
            if (!slot.start || !slot.end) {
              throw new AppError(`Invalid time slot for ${day}`, 400);
            }
            if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
              throw new AppError(`Invalid time format for ${day}. Use HH:MM format`, 400);
            }
          }
        }
      }
    }

    // Update fields
    if (availability) expert.availability = availability;
    if (timezone) expert.timezone = timezone;
    if (slotDuration && [15, 30, 60].includes(slotDuration)) {
      expert.slotDuration = slotDuration;
    }
    if (breakTimes) expert.breakTimes = breakTimes;

    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        availability: expert.availability,
        timezone: expert.timezone,
        slotDuration: expert.slotDuration,
        breakTimes: expert.breakTimes,
      },
    });
  } catch (error) {
    next(error);
  }
};
