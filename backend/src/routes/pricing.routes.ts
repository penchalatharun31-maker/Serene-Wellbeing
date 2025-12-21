import express from 'express';
import {
  getAllPricingPlans,
  getIndividualPricing,
  getCorporatePricing,
  getSubscriptionPricing,
  getPricingPlan,
  calculateCorporateROI,
  getExpertCommission,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from '../controllers/pricing.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllPricingPlans);
router.get('/individual', getIndividualPricing);
router.get('/corporate', getCorporatePricing);
router.get('/subscription', getSubscriptionPricing);
router.get('/expert-commission', getExpertCommission);
router.get('/:id', getPricingPlan);
router.post('/calculate-roi', calculateCorporateROI);

// Admin routes
router.post('/', protect, authorize('super_admin'), createPricingPlan);
router.put('/:id', protect, authorize('super_admin'), updatePricingPlan);
router.delete('/:id', protect, authorize('super_admin'), deletePricingPlan);

export default router;
