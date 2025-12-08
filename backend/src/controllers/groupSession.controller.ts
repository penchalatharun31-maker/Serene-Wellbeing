import { Response, NextFunction } from 'express';
import GroupSession from '../models/GroupSession';
import Expert from '../models/Expert';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';

export const getAllGroupSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 12 } = req.query;

    const query: any = { status: status || 'upcoming' };

    if (category) {
      query.category = category;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const groupSessions = await GroupSession.find(query)
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name avatar',
        },
      })
      .sort('scheduledDate scheduledTime')
      .skip(skip)
      .limit(limitNum);

    const total = await GroupSession.countDocuments(query);

    res.status(200).json({
      success: true,
      count: groupSessions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      groupSessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupSessionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groupSession = await GroupSession.findById(req.params.id)
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name avatar email',
        },
      })
      .populate('participants.userId', 'name avatar');

    if (!groupSession) {
      throw new AppError('Group session not found', 404);
    }

    res.status(200).json({
      success: true,
      groupSession,
    });
  } catch (error) {
    next(error);
  }
};

export const createGroupSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      scheduledDate,
      scheduledTime,
      duration,
      maxParticipants,
      price,
      imageUrl,
      tags,
    } = req.body;

    // Get expert profile
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    if (!expert.isApproved) {
      throw new AppError('Expert profile not approved', 403);
    }

    const groupSession = await GroupSession.create({
      expertId: expert._id,
      title,
      description,
      category,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      maxParticipants,
      price,
      imageUrl,
      tags,
    });

    res.status(201).json({
      success: true,
      groupSession,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGroupSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groupSession = await GroupSession.findById(req.params.id).populate(
      'expertId'
    );

    if (!groupSession) {
      throw new AppError('Group session not found', 404);
    }

    // Check authorization
    const expert = groupSession.expertId as any;
    if (expert.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized to update this session', 403);
    }

    const updatedSession = await GroupSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      groupSession: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

export const joinGroupSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groupSession = await GroupSession.findById(req.params.id);

    if (!groupSession) {
      throw new AppError('Group session not found', 404);
    }

    // Check if already joined
    const alreadyJoined = groupSession.participants.some(
      (p) => p.userId.toString() === req.user!._id.toString()
    );

    if (alreadyJoined) {
      throw new AppError('Already joined this session', 400);
    }

    // Check if session is full
    if (groupSession.currentParticipants >= groupSession.maxParticipants) {
      throw new AppError('Session is full', 400);
    }

    // Add participant
    groupSession.participants.push({
      userId: req.user!._id,
      joinedAt: new Date(),
      paymentStatus: 'pending',
    });

    groupSession.currentParticipants += 1;
    await groupSession.save();

    // Create notification for expert
    await Notification.create({
      userId: (groupSession.expertId as any).userId,
      type: 'booking_confirmed',
      title: 'New Group Session Participant',
      message: `Someone joined your group session: ${groupSession.title}`,
      link: `/dashboard/expert`,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully joined group session',
      groupSession,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveGroupSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groupSession = await GroupSession.findById(req.params.id);

    if (!groupSession) {
      throw new AppError('Group session not found', 404);
    }

    // Find participant
    const participantIndex = groupSession.participants.findIndex(
      (p) => p.userId.toString() === req.user!._id.toString()
    );

    if (participantIndex === -1) {
      throw new AppError('You are not a participant of this session', 400);
    }

    // Remove participant
    groupSession.participants.splice(participantIndex, 1);
    groupSession.currentParticipants -= 1;
    await groupSession.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left group session',
    });
  } catch (error) {
    next(error);
  }
};

export const cancelGroupSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groupSession = await GroupSession.findById(req.params.id).populate(
      'expertId'
    );

    if (!groupSession) {
      throw new AppError('Group session not found', 404);
    }

    // Check authorization
    const expert = groupSession.expertId as any;
    if (
      expert.userId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'super_admin'
    ) {
      throw new AppError('Not authorized to cancel this session', 403);
    }

    groupSession.status = 'cancelled';
    await groupSession.save();

    // Notify all participants
    for (const participant of groupSession.participants) {
      await Notification.create({
        userId: participant.userId,
        type: 'session_cancelled',
        title: 'Group Session Cancelled',
        message: `The group session "${groupSession.title}" has been cancelled`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Group session cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertGroupSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const expert = await Expert.findOne({ userId: req.user!._id });

    if (!expert) {
      throw new AppError('Expert profile not found', 404);
    }

    const groupSessions = await GroupSession.find({ expertId: expert._id })
      .sort('-scheduledDate')
      .populate('participants.userId', 'name avatar email');

    res.status(200).json({
      success: true,
      count: groupSessions.length,
      groupSessions,
    });
  } catch (error) {
    next(error);
  }
};
