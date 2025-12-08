import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupSession extends Document {
  expertId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    joinedAt: Date;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paymentIntentId?: string;
  }>;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  imageUrl?: string;
  tags: string[];
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSessionSchema = new Schema<IGroupSession>(
  {
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [2, 'At least 2 participants required'],
      max: [100, 'Cannot exceed 100 participants'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        paymentStatus: {
          type: String,
          enum: ['pending', 'paid', 'refunded'],
          default: 'pending',
        },
        paymentIntentId: String,
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    meetingLink: String,
    imageUrl: String,
    tags: [String],
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
GroupSessionSchema.index({ expertId: 1, status: 1 });
GroupSessionSchema.index({ scheduledDate: 1, status: 1 });
GroupSessionSchema.index({ category: 1, status: 1 });
GroupSessionSchema.index({ tags: 1 });

export default mongoose.model<IGroupSession>('GroupSession', GroupSessionSchema);
