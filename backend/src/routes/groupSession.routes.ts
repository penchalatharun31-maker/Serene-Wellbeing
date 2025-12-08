import express from 'express';
import { body } from 'express-validator';
import {
  getAllGroupSessions,
  getGroupSessionById,
  createGroupSession,
  updateGroupSession,
  joinGroupSession,
  leaveGroupSession,
  cancelGroupSession,
  getExpertGroupSessions,
} from '../controllers/groupSession.controller';
import { protect, authorize, optional } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

const createGroupSessionValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('scheduledTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Time must be in HH:MM format'),
  body('duration')
    .isIn([30, 60, 90, 120])
    .withMessage('Duration must be 30, 60, 90, or 120 minutes'),
  body('maxParticipants')
    .isInt({ min: 2, max: 100 })
    .withMessage('Max participants must be between 2 and 100'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
];

// Public routes (with optional auth)
router.get('/', optional, getAllGroupSessions);
router.get('/:id', optional, getGroupSessionById);

// Protected routes
router.use(protect);

// User routes
router.post('/:id/join', joinGroupSession);
router.post('/:id/leave', leaveGroupSession);

// Expert routes
router.post(
  '/',
  authorize('expert'),
  validate(createGroupSessionValidation),
  createGroupSession
);
router.put('/:id', authorize('expert'), updateGroupSession);
router.post('/:id/cancel', authorize('expert', 'super_admin'), cancelGroupSession);
router.get('/expert/all', authorize('expert'), getExpertGroupSessions);

export default router;
