import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import BlogPost from '../models/BlogPost';
import logger from '../utils/logger';

// @desc    Get all published blog posts
// @route   GET /api/v1/blog
// @access  Public
export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = '-publishedAt'
    } = req.query;

    const query: any = { status: 'published' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Search in title, content, excerpt
    if (search) {
      query.$text = { $search: search as string };
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name avatar')
      .select('-content') // Exclude full content for list view
      .sort(sort as string)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    logger.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message,
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/v1/blog/:slug
// @access  Public
export const getPostBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug, status: 'published' })
      .populate('author', 'name avatar email')
      .populate('relatedPosts', 'title slug excerpt featuredImage category');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Increment views
    await post.incrementViews();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    logger.error('Get post by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message,
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/v1/blog
// @access  Private (Admin/Author)
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const postData = {
      ...req.body,
      author: req.user?._id,
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    });
  } catch (error: any) {
    logger.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message,
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/v1/blog/:id
// @access  Private (Admin/Author)
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    let post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'super_admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    post = await BlogPost.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error: any) {
    logger.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message,
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/v1/blog/:id
// @access  Private (Admin/Author)
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'super_admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    logger.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message,
    });
  }
};

// @desc    Like a blog post
// @route   POST /api/v1/blog/:id/like
// @access  Public
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.incrementLikes();

    res.status(200).json({
      success: true,
      data: { likes: post.likes },
      message: 'Post liked successfully',
    });
  } catch (error: any) {
    logger.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message,
    });
  }
};

// @desc    Get popular posts
// @route   GET /api/v1/blog/popular
// @access  Public
export const getPopularPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await (BlogPost as any).getPopularPosts(Number(limit));

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    logger.error('Get popular posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular posts',
      error: error.message,
    });
  }
};

// @desc    Get recent posts
// @route   GET /api/v1/blog/recent
// @access  Public
export const getRecentPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await (BlogPost as any).getRecentPosts(Number(limit));

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    logger.error('Get recent posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent posts',
      error: error.message,
    });
  }
};

// @desc    Get posts by category
// @route   GET /api/v1/blog/category/:category
// @access  Public
export const getPostsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const posts = await (BlogPost as any).getPostsByCategory(category, Number(limit));

    res.status(200).json({
      success: true,
      data: posts,
      category,
    });
  } catch (error: any) {
    logger.error('Get posts by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts by category',
      error: error.message,
    });
  }
};

// @desc    Get all categories with post counts
// @route   GET /api/v1/blog/categories
// @access  Public
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
      })),
    });
  } catch (error: any) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// @desc    Get all tags with post counts
// @route   GET /api/v1/blog/tags
// @access  Public
export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      success: true,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count,
      })),
    });
  } catch (error: any) {
    logger.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags',
      error: error.message,
    });
  }
};
