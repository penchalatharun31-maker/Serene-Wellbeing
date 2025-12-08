import express from 'express';
import { body } from 'express-validator';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  publishResource,
  deleteResource,
  likeResource,
  generateResourceContent,
} from '../controllers/resource.controller';
import { protect, authorize, optional } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

const createResourceValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('type')
    .isIn(['article', 'video', 'audio', 'pdf'])
    .withMessage('Invalid resource type'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Public routes (with optional auth)
router.get('/', optional, getAllResources);
router.get('/:id', optional, getResourceById);

// Protected routes
router.use(protect);

router.post('/:id/like', likeResource);

// Admin/Expert routes
router.post(
  '/',
  authorize('super_admin', 'expert'),
  validate(createResourceValidation),
  createResource
);
router.put('/:id', authorize('super_admin', 'expert'), updateResource);
router.put('/:id/publish', authorize('super_admin'), publishResource);
router.delete('/:id', authorize('super_admin', 'expert'), deleteResource);

// AI content generation
router.post('/generate/content', authorize('super_admin', 'expert'), generateResourceContent);

export default router;
