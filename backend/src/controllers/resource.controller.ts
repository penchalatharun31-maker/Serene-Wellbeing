import { Response, NextFunction } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import geminiService from '../services/gemini.service';

export const getAllResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, category, search, page = 1, limit = 12 } = req.query;

    const query: any = { isPublished: true };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find(query)
      .sort('-publishedAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      resources,
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      type,
      category,
      tags,
      content,
      url,
      thumbnailUrl,
      duration,
      author,
      isPremium,
    } = req.body;

    const resource = await Resource.create({
      title,
      description,
      type,
      category,
      tags,
      content,
      url,
      thumbnailUrl,
      duration,
      author,
      isPremium,
      createdBy: req.user!._id,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check authorization
    if (
      resource.createdBy.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'super_admin'
    ) {
      throw new AppError('Not authorized to update this resource', 403);
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      resource: updatedResource,
    });
  } catch (error) {
    next(error);
  }
};

export const publishResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    resource.isPublished = true;
    resource.publishedAt = new Date();
    await resource.save();

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check authorization
    if (
      resource.createdBy.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'super_admin'
    ) {
      throw new AppError('Not authorized to delete this resource', 403);
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const likeResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    resource.likes += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      likes: resource.likes,
    });
  } catch (error) {
    next(error);
  }
};

export const generateResourceContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic, type } = req.body;

    if (!topic || !type) {
      throw new AppError('Topic and type are required', 400);
    }

    const content = await geminiService.generateWellnessContent(topic, type);

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    next(error);
  }
};
