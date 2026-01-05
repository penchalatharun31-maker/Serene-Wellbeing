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
  getExpertAvailableDates,
  updateExpertAvailability,
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
router.get('/:id', optional, getExpertById);
router.get('/user/:userId', optional, getExpertByUserId);

// Availability routes (public - for users browsing/booking)
router.get('/:id/availability', getExpertAvailability); // GET /api/v1/experts/:id/availability?date=2026-01-15&duration=60
router.get('/:id/available-dates', getExpertAvailableDates); // GET /api/v1/experts/:id/available-dates?year=2026&month=1

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
router.put('/availability', authorize('expert'), updateAvailability); // Legacy - keeping for backward compatibility
router.put('/my-availability', authorize('expert'), updateExpertAvailability); // New enhanced availability
router.get('/stats/me', authorize('expert'), getExpertStats);
router.post('/profile/analyze', authorize('expert'), analyzeExpertProfile);

export default router;
