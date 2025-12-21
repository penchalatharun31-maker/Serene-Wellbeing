import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingPlan extends Document {
  name: string;
  type: 'individual' | 'corporate' | 'subscription';
  category: 'pay_as_you_go' | 'starter' | 'progress' | 'commitment' | 'messaging' | 'basic' | 'growth' | 'enterprise';
  price: number;
  currency: string;
  sessions: number;
  pricePerSession: number;
  discount: number;
  savings: number;
  duration?: number; // days
  features: string[];
  popular: boolean;
  bestValue: boolean;
  minEmployees?: number;
  maxEmployees?: number;
  creditsIncluded?: number;
  description: string;
  shortDescription: string;
  isActive: boolean;
  metadata: {
    stripePriceId?: string;
    stripeProductId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['individual', 'corporate', 'subscription'],
      required: [true, 'Plan type is required'],
    },
    category: {
      type: String,
      enum: [
        'pay_as_you_go',
        'starter',
        'progress',
        'commitment',
        'messaging',
        'basic',
        'growth',
        'enterprise',
      ],
      required: [true, 'Plan category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    sessions: {
      type: Number,
      default: 0,
      min: [0, 'Sessions cannot be negative'],
    },
    pricePerSession: {
      type: Number,
      default: 0,
      min: [0, 'Price per session cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    savings: {
      type: Number,
      default: 0,
      min: [0, 'Savings cannot be negative'],
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 day'],
    },
    features: {
      type: [String],
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
    },
    bestValue: {
      type: Boolean,
      default: false,
    },
    minEmployees: {
      type: Number,
      min: [1, 'Minimum employees must be at least 1'],
    },
    maxEmployees: {
      type: Number,
    },
    creditsIncluded: {
      type: Number,
      default: 0,
      min: [0, 'Credits cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      stripePriceId: String,
      stripeProductId: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PricingPlanSchema.index({ type: 1, isActive: 1 });
PricingPlanSchema.index({ category: 1 });
PricingPlanSchema.index({ popular: 1, bestValue: 1 });

// Virtual for formatted price
PricingPlanSchema.virtual('formattedPrice').get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted price per session
PricingPlanSchema.virtual('formattedPricePerSession').get(function () {
  return this.pricePerSession > 0 ? `$${this.pricePerSession.toFixed(2)}` : null;
});

export default mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);
