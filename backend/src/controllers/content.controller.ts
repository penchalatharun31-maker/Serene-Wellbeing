import { Response, NextFunction } from 'express';
import Content from '../models/Content';
import ContentProgress from '../models/ContentProgress';
import { AuthRequest } from '../middleware/auth';

// GET /content - list content with search + filter
export const getContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, category, search, page = '1', limit = '20' } = req.query;
    const query: any = { isPublished: true };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      const escaped = (search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.title = { $regex: escaped, $options: 'i' };
    }

    const content = await Content.find(query)
      .sort({ 'stats.plays': -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const total = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      content,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /content/featured - get featured content
export const getFeaturedContent = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const featured = await Content.find({ isFeatured: true, isPublished: true })
      .sort({ 'stats.avgRating': -1 })
      .limit(5);

    res.status(200).json({ success: true, content: featured });
  } catch (error) {
    next(error);
  }
};

// GET /content/:id - get single content item
export const getContentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    // Increment plays
    content.stats.plays += 1;
    await content.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

// POST /content/:id/progress - update user's progress on a content item
export const updateContentProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPosition, progress } = req.body;

    let contentProgress = await ContentProgress.findOne({
      userId: req.user!._id,
      contentId: req.params.id,
    });

    if (!contentProgress) {
      contentProgress = await ContentProgress.create({
        userId: req.user!._id,
        contentId: req.params.id,
        status: 'in_progress',
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      });
    }

    if (currentPosition !== undefined) contentProgress.currentPosition = currentPosition;
    if (progress !== undefined) contentProgress.progress = progress;
    contentProgress.lastAccessedAt = new Date();

    if (progress && progress >= 100) {
      contentProgress.status = 'completed';
      contentProgress.completedAt = new Date();

      // Increment completions on content
      await Content.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.completions': 1 },
      });
    } else {
      contentProgress.status = 'in_progress';
    }

    await contentProgress.save();

    res.status(200).json({ success: true, contentProgress });
  } catch (error) {
    next(error);
  }
};

// PUT /content/:id/favorite - toggle favorite
export const toggleFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let contentProgress = await ContentProgress.findOne({
      userId: req.user!._id,
      contentId: req.params.id,
    });

    if (!contentProgress) {
      contentProgress = await ContentProgress.create({
        userId: req.user!._id,
        contentId: req.params.id,
        isFavorite: true,
        lastAccessedAt: new Date(),
      });
    } else {
      contentProgress.isFavorite = !contentProgress.isFavorite;
      await contentProgress.save();
    }

    res.status(200).json({ success: true, isFavorite: contentProgress.isFavorite });
  } catch (error) {
    next(error);
  }
};
