import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  currentUses: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableFor: 'all' | 'individual_sessions' | 'group_sessions' | 'credits';
  usedBy: Array<{
    userId: mongoose.Types.ObjectId;
    usedAt: Date;
  }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: [true, 'Promo code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Code must be at least 3 characters'],
      maxlength: [20, 'Code cannot exceed 20 characters'],
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      min: [0, 'Value cannot be negative'],
    },
    maxUses: {
      type: Number,
      required: [true, 'Max uses is required'],
      min: [1, 'Max uses must be at least 1'],
    },
    currentUses: {
      type: Number,
      default: 0,
      min: 0,
    },
    minPurchaseAmount: {
      type: Number,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableFor: {
      type: String,
      enum: ['all', 'individual_sessions', 'group_sessions', 'credits'],
      default: 'all',
    },
    usedBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export default mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
