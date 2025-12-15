import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContentProgress extends Document {
  userId: Types.ObjectId;
  contentId: Types.ObjectId;

  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  currentPosition: number; // in seconds for audio/video

  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;

  rating?: number; // 1-5
  review?: string;
  isFavorite: boolean;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ContentProgressSchema = new Schema<IContentProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    currentPosition: {
      type: Number,
      default: 0
    },
    startedAt: Date,
    completedAt: Date,
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    isFavorite: {
      type: Boolean,
      default: false
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Compound index for unique user-content pairs
ContentProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });
ContentProgressSchema.index({ userId: 1, status: 1 });
ContentProgressSchema.index({ userId: 1, isFavorite: 1 });

export default mongoose.model<IContentProgress>('ContentProgress', ContentProgressSchema);
