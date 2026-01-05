import express from 'express';
import { body } from 'express-validator';
import {
  createSession,
  getUserSessions,
  getExpertSessions,
  getSessionById,
  updateSession,
  cancelSession,
  rateSession,
  getUpcomingSessions,
  acceptSession,
  rejectSession,
} from '../controllers/session.controller';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation rules
const createSessionValidation = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('scheduledTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Time must be in HH:MM format'),
  body('duration')
    .isIn([30, 60, 90, 120])
    .withMessage('Duration must be 30, 60, 90, or 120 minutes'),
];

const rateSessionValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review cannot exceed 1000 characters'),
];

// Protected routes
router.use(protect);

// User routes
router.post('/', validate(createSessionValidation), createSession);
router.get('/user/all', getUserSessions);
router.get('/user/upcoming', getUpcomingSessions);
router.post('/:id/rate', validate(rateSessionValidation), rateSession);

// Expert routes
router.get('/expert/all', authorize('expert'), getExpertSessions);
router.post('/:id/accept', authorize('expert'), acceptSession);
router.post('/:id/reject', authorize('expert'), rejectSession);

// Shared routes
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.post('/:id/cancel', cancelSession);

export default router;
