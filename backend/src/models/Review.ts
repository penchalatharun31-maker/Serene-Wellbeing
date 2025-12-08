import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  response?: {
    text: string;
    respondedAt: Date;
  };
  isPublished: boolean;
  isVerified: boolean;
  helpfulCount: number;
  reportedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      unique: true,
    },
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    response: {
      text: {
        type: String,
        maxlength: [1000, 'Response cannot exceed 1000 characters'],
      },
      respondedAt: Date,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reportedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ReviewSchema.index({ expertId: 1, isPublished: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ sessionId: 1 });
ReviewSchema.index({ rating: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
