import mongoose, { Document, Schema } from 'mongoose';

export interface IPayout extends Document {
  expertId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: mongoose.Types.ObjectId; // Admin who processed it
  rejectionReason?: string;
  paymentMethod: 'bank_transfer' | 'upi' | 'paypal' | 'stripe';
  paymentDetails: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    paypalEmail?: string;
    stripeAccountId?: string;
  };
  transactionId?: string; // External payment transaction ID
  notes?: string;
  metadata?: Record<string, any>;
}

const PayoutSchema = new Schema<IPayout>(
  {
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processing', 'completed'],
      default: 'pending',
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: String,
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'upi', 'paypal', 'stripe'],
      required: true,
    },
    paymentDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String,
      paypalEmail: String,
      stripeAccountId: String,
    },
    transactionId: String,
    notes: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Indexes
PayoutSchema.index({ expertId: 1, status: 1 });
PayoutSchema.index({ requestedAt: -1 });
PayoutSchema.index({ status: 1, requestedAt: -1 });

export default mongoose.model<IPayout>('Payout', PayoutSchema);
