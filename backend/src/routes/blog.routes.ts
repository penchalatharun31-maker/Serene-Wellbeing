import { Router } from 'express';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPopularPosts,
  getRecentPosts,
  getPostsByCategory,
  getCategories,
  getTags,
} from '../controllers/blog.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllPosts);
router.get('/popular', getPopularPosts);
router.get('/recent', getRecentPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/category/:category', getPostsByCategory);
router.get('/:slug', getPostBySlug);
router.post('/:id/like', likePost);

// Protected routes (Admin/Author only)
router.post('/', protect, authorize('super_admin', 'expert'), createPost);
router.put('/:id', protect, authorize('super_admin', 'expert'), updatePost);
router.delete('/:id', protect, authorize('super_admin', 'expert'), deletePost);

export default router;
