import { Response, NextFunction } from 'express';
import Message from '../models/Message';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';

export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { receiverId, content, type = 'text', fileUrl, fileName } = req.body;

    if (!receiverId || !content) {
      throw new AppError('Receiver and content are required', 400);
    }

    // Create conversation ID (sorted user IDs to ensure consistency)
    const userIds = [req.user!._id.toString(), receiverId].sort();
    const conversationId = userIds.join('_');

    const message = await Message.create({
      conversationId,
      senderId: req.user!._id,
      receiverId,
      content,
      type,
      fileUrl,
      fileName,
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message`,
      link: `/messages`,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name avatar')
      .populate('receiverId', 'name avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get all unique conversations for the user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user!._id },
            { receiverId: req.user!._id },
          ],
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', req.user!._id] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    // Populate user details
    const conversations = await Message.populate(messages, [
      {
        path: 'lastMessage.senderId',
        select: 'name avatar',
      },
      {
        path: 'lastMessage.receiverId',
        select: 'name avatar',
      },
    ]);

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Create conversation ID
    const userIds = [req.user!._id.toString(), userId].sort();
    const conversationId = userIds.join('_');

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .populate('senderId', 'name avatar')
      .populate('receiverId', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: req.user!._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      messages: messages.reverse(), // Reverse to show oldest first
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: req.user!._id,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    // Check authorization
    if (message.senderId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized to delete this message', 403);
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user!._id,
      isRead: false,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};
