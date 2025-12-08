import express from 'express';
import {
  getExpertAnalytics,
  getUserAnalytics,
  getPlatformAnalytics,
} from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/user', getUserAnalytics);
router.get('/expert', authorize('expert'), getExpertAnalytics);
router.get('/platform', authorize('super_admin'), getPlatformAnalytics);

export default router;
