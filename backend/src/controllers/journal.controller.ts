import { Response, NextFunction } from 'express';
import Journal from '../models/Journal';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

// POST /journal - Create a new journal entry
export const createJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, mood, emotions, tags } = req.body;

    const entry = await Journal.create({
      userId: req.user!._id,
      title: title || undefined,
      content,
      mood: mood || undefined,
      emotions: emotions || [],
      tags: tags || [],
      isPrivate: true,
      favorited: false,
    });

    logger.info(`Journal entry created: ${entry._id} by user ${req.user!._id}`);

    res.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

// GET /journal - List user's journal entries
export const getJournalEntries = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 20, search, mood, favorited } = req.query;

    const query: any = { userId: req.user!._id };

    if (search && typeof search === 'string') {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (mood) {
      query.mood = mood;
    }

    if (favorited === 'true') {
      query.favorited = true;
    }

    const pageNum = Number(page);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const entries = await Journal.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Journal.countDocuments(query);

    res.status(200).json({
      success: true,
      entries,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// GET /journal/:id - Get a single journal entry
export const getJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!entry) {
      throw new AppError('Journal entry not found', 404);
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /journal/:id - Update a journal entry
export const updateJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!entry) {
      throw new AppError('Journal entry not found', 404);
    }

    const { title, content, mood, emotions, tags } = req.body;

    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood !== undefined) entry.mood = mood;
    if (emotions !== undefined) entry.emotions = emotions;
    if (tags !== undefined) entry.tags = tags;

    await entry.save();

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /journal/:id - Delete a journal entry
export const deleteJournalEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!entry) {
      throw new AppError('Journal entry not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Journal entry deleted',
    });
  } catch (error) {
    next(error);
  }
};

// PUT /journal/:id/favorite - Toggle favorite
export const toggleFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!entry) {
      throw new AppError('Journal entry not found', 404);
    }

    entry.favorited = !entry.favorited;
    await entry.save();

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    next(error);
  }
};
