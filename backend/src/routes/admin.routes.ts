import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllUsers,
  getPendingExperts,
  approveExpert,
  rejectExpert,
  getAllSessions,
  deleteUser,
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  getRevenueReport,
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// All routes require super_admin role
router.use(protect);
router.use(authorize('super_admin'));

const createPromoValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Code must be between 3 and 20 characters'),
  body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be positive'),
  body('maxUses').isInt({ min: 1 }).withMessage('Max uses must be at least 1'),
  body('validFrom').isISO8601().withMessage('Valid from date is required'),
  body('validUntil').isISO8601().withMessage('Valid until date is required'),
];

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

// Expert management
router.get('/experts/pending', getPendingExperts);
router.put('/experts/:expertId/approve', approveExpert);
router.put('/experts/:expertId/reject', rejectExpert);

// Session management
router.get('/sessions', getAllSessions);

// Promo codes
router.get('/promo-codes', getAllPromoCodes);
router.post('/promo-codes', validate(createPromoValidation), createPromoCode);
router.put('/promo-codes/:promoId', updatePromoCode);
router.delete('/promo-codes/:promoId', deletePromoCode);

// Reports
router.get('/reports/revenue', getRevenueReport);

export default router;
