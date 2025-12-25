import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  type: 'individual' | 'group';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  price: number;
  currency?: string; // Currency code (INR, USD, EUR, etc.)
  timezone?: string; // Timezone (UTC, Asia/Kolkata, America/New_York, etc.)
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string; // Legacy Stripe field (deprecated)
  paymentOrderId?: string; // Razorpay Order ID
  razorpayPaymentId?: string; // Razorpay Payment ID
  transactionId?: string;
  meetingLink?: string;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  rating?: number;
  review?: string;
  reviewedAt?: Date;
  reminderSent: boolean;
  completedAt?: Date;
  metadata: {
    expertCommission: number;
    platformCommission: number;
    userCreditsUsed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    type: {
      type: String,
      enum: ['individual', 'group'],
      default: 'individual',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Scheduled time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      enum: [30, 60, 90, 120],
      default: 60,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      uppercase: true,
      default: process.env.DEFAULT_CURRENCY || 'INR',
    },
    timezone: {
      type: String,
      default: process.env.DEFAULT_TIMEZONE || 'UTC',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentIntentId: String, // Legacy Stripe field (deprecated)
    paymentOrderId: String, // Razorpay Order ID
    razorpayPaymentId: String, // Razorpay Payment ID
    transactionId: String,
    meetingLink: String,
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    cancelReason: {
      type: String,
      maxlength: [500, 'Cancel reason cannot exceed 500 characters'],
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledAt: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    reviewedAt: Date,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    metadata: {
      expertCommission: {
        type: Number,
        default: 0,
      },
      platformCommission: {
        type: Number,
        default: 0,
      },
      userCreditsUsed: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
SessionSchema.index({ userId: 1, status: 1, scheduledDate: -1 });
SessionSchema.index({ expertId: 1, status: 1, scheduledDate: -1 });
SessionSchema.index({ scheduledDate: 1, scheduledTime: 1 });
SessionSchema.index({ status: 1, paymentStatus: 1 });
SessionSchema.index({ createdAt: -1 });

// Prevent double booking
SessionSchema.index(
  { expertId: 1, scheduledDate: 1, scheduledTime: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed'] },
    },
  }
);

export default mongoose.model<ISession>('Session', SessionSchema);
