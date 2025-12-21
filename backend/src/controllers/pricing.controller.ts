import { Request, Response, NextFunction } from 'express';
import PricingPlan from '../models/PricingPlan';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

// Get all pricing plans
export const getAllPricingPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query;

    const filter: any = { isActive: true };
    if (type) {
      filter.type = type;
    }

    const plans = await PricingPlan.find(filter).sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    next(error);
  }
};

// Get individual pricing plans
export const getIndividualPricing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plans = await PricingPlan.find({
      type: 'individual',
      isActive: true,
    }).sort({ sessions: 1 });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    next(error);
  }
};

// Get corporate pricing plans
export const getCorporatePricing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plans = await PricingPlan.find({
      type: 'corporate',
      isActive: true,
    }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    next(error);
  }
};

// Get subscription pricing plans
export const getSubscriptionPricing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plans = await PricingPlan.find({
      type: 'subscription',
      isActive: true,
    }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    next(error);
  }
};

// Get single pricing plan
export const getPricingPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plan = await PricingPlan.findById(req.params.id);

    if (!plan) {
      throw new AppError('Pricing plan not found', 404);
    }

    res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

// Calculate ROI for corporate plans
export const calculateCorporateROI = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { planId, employees } = req.body;

    if (!planId || !employees) {
      throw new AppError('Plan ID and number of employees are required', 400);
    }

    const plan = await PricingPlan.findById(planId);

    if (!plan || plan.type !== 'corporate') {
      throw new AppError('Invalid corporate plan', 400);
    }

    // Calculate costs
    const annualCost = plan.price * employees;

    // ROI calculations based on industry research
    const medicalSavingsMultiplier = 3.27; // $3.27 saved per $1 spent
    const absenteeismSavingsMultiplier = 2.73; // $2.73 saved per $1 spent

    const medicalSavings = annualCost * medicalSavingsMultiplier;
    const absenteeismSavings = annualCost * absenteeismSavingsMultiplier;
    const totalSavings = medicalSavings + absenteeismSavings;
    const netSavings = totalSavings - annualCost;
    const roi = ((netSavings / annualCost) * 100).toFixed(1);

    res.status(200).json({
      success: true,
      roi: {
        employees,
        annualCost,
        monthlyCost: annualCost / 12,
        costPerEmployee: plan.price,
        savings: {
          medical: medicalSavings,
          absenteeism: absenteeismSavings,
          total: totalSavings,
          net: netSavings,
        },
        roiPercentage: parseFloat(roi),
        breakEvenMonths: Math.ceil((annualCost / totalSavings) * 12),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get expert commission breakdown
export const getExpertCommission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionPrice } = req.query;

    // Default commission split: 80% expert, 20% platform
    const platformCommission = 0.2;
    const expertCommission = 0.8;

    const price = sessionPrice ? parseFloat(sessionPrice as string) : 80;

    // Get all individual pricing plans for examples
    const plans = await PricingPlan.find({
      type: 'individual',
      isActive: true,
    }).sort({ sessions: 1 });

    const examples = plans.map((plan) => ({
      planName: plan.name,
      totalPrice: plan.price,
      sessions: plan.sessions,
      pricePerSession: plan.pricePerSession,
      expertEarnings: plan.price * expertCommission,
      expertPerSession: plan.pricePerSession * expertCommission,
      platformFee: plan.price * platformCommission,
    }));

    res.status(200).json({
      success: true,
      commission: {
        expertPercentage: expertCommission * 100,
        platformPercentage: platformCommission * 100,
        sessionPrice: price,
        expertEarns: price * expertCommission,
        platformFee: price * platformCommission,
      },
      examples,
      features: [
        'No setup fees',
        'No monthly subscription',
        'No payment processing fees',
        'No minimum payout threshold',
        'Weekly automatic payouts',
        'Transparent pricing',
      ],
      earningsPotential: {
        partTime: {
          sessionsPerWeek: 10,
          weeklyEarnings: 10 * price * expertCommission,
          monthlyEarnings: 10 * price * expertCommission * 4,
          yearlyEarnings: 10 * price * expertCommission * 52,
        },
        fullTime: {
          sessionsPerWeek: 25,
          weeklyEarnings: 25 * price * expertCommission,
          monthlyEarnings: 25 * price * expertCommission * 4,
          yearlyEarnings: 25 * price * expertCommission * 52,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create pricing plan
export const createPricingPlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plan = await PricingPlan.create(req.body);

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update pricing plan
export const updatePricingPlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      throw new AppError('Pricing plan not found', 404);
    }

    res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete pricing plan
export const deletePricingPlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plan) {
      throw new AppError('Pricing plan not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Pricing plan deactivated',
    });
  } catch (error) {
    next(error);
  }
};
