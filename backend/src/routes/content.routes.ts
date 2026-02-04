import express from 'express';
import {
  getContent,
  getFeaturedContent,
  getContentById,
  updateContentProgress,
  toggleFavorite,
} from '../controllers/content.controller';
import { protect, optional } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', optional, getContent);
router.get('/featured', getFeaturedContent);
router.get('/:id', optional, getContentById);

// Authenticated routes
router.use(protect);
router.post('/:id/progress', updateContentProgress);
router.put('/:id/favorite', toggleFavorite);

export default router;
