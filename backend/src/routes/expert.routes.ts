import express from 'express';
import { body } from 'express-validator';
import {
  getAllExperts,
  getExpertById,
  getExpertByUserId,
  createExpertProfile,
  updateExpertProfile,
  updateAvailability,
  getExpertStats,
  getExpertRecommendations,
  analyzeExpertProfile,
  getExpertAvailability,
} from '../controllers/expert.controller';
import { protect, authorize, optional } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation rules
const createExpertValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('specialization')
    .isArray({ min: 1 })
    .withMessage('At least one specialization is required'),
  body('bio')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Bio must be between 50 and 2000 characters'),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive number'),
  body('hourlyRate')
    .isFloat({ min: 10, max: 1000 })
    .withMessage('Hourly rate must be between $10 and $1000'),
];

// Public routes (with optional auth)
router.get('/', optional, getAllExperts);
router.get('/availability', getExpertAvailability);
router.get('/:id', optional, getExpertById);
router.get('/user/:userId', optional, getExpertByUserId);

// Protected routes
router.use(protect);

// User routes
router.post('/recommendations', getExpertRecommendations);

// Expert routes
router.post(
  '/profile',
  authorize('expert', 'user'),
  validate(createExpertValidation),
  createExpertProfile
);
router.put('/profile', authorize('expert'), updateExpertProfile);
router.put('/availability', authorize('expert'), updateAvailability);
router.get('/stats/me', authorize('expert'), getExpertStats);
router.post('/profile/analyze', authorize('expert'), analyzeExpertProfile);

export default router;
