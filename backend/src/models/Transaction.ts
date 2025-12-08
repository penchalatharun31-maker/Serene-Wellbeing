import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  expertId?: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  type: 'payment' | 'refund' | 'payout' | 'credit_purchase' | 'credit_usage';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'card' | 'credits' | 'bank_transfer' | 'other';
  paymentIntentId?: string;
  stripeChargeId?: string;
  metadata: {
    platformFee?: number;
    expertEarnings?: number;
    description?: string;
  };
  failureReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'payout', 'credit_purchase', 'credit_usage'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'credits', 'bank_transfer', 'other'],
      required: true,
    },
    paymentIntentId: String,
    stripeChargeId: String,
    metadata: {
      platformFee: Number,
      expertEarnings: Number,
      description: String,
    },
    failureReason: String,
    processedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ expertId: 1, type: 1, status: 1 });
TransactionSchema.index({ sessionId: 1 });
TransactionSchema.index({ status: 1, type: 1 });
TransactionSchema.index({ createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
