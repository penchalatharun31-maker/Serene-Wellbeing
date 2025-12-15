import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChallengeTask {
  title: string;
  description: string;
  type: 'meditation' | 'exercise' | 'journaling' | 'gratitude' | 'social' | 'learning' | 'creative' | 'self-care';
  duration?: number; // in minutes
  points: number;
  completed: boolean;
  completedAt?: Date;
}

export interface IWellnessChallenge extends Document {
  title: string;
  description: string;
  category: 'mental_health' | 'physical_health' | 'social' | 'productivity' | 'mindfulness' | 'self_care';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in days
  tasks: IChallengeTask[];
  totalPoints: number;
  participants: Types.ObjectId[];
  createdBy: 'admin' | 'ai' | 'expert';
  isPublic: boolean;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WellnessChallengeSchema = new Schema<IWellnessChallenge>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    category: {
      type: String,
      enum: ['mental_health', 'physical_health', 'social', 'productivity', 'mindfulness', 'self_care'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 365
    },
    tasks: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      type: {
        type: String,
        enum: ['meditation', 'exercise', 'journaling', 'gratitude', 'social', 'learning', 'creative', 'self-care']
      },
      duration: Number,
      points: {
        type: Number,
        default: 10
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    totalPoints: {
      type: Number,
      default: 0
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdBy: {
      type: String,
      enum: ['admin', 'ai', 'expert'],
      default: 'admin'
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: Date,
    endDate: Date,
    imageUrl: String,
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Indexes
WellnessChallengeSchema.index({ isActive: 1, isPublic: 1 });
WellnessChallengeSchema.index({ category: 1, difficulty: 1 });
WellnessChallengeSchema.index({ participants: 1 });

export default mongoose.model<IWellnessChallenge>('WellnessChallenge', WellnessChallengeSchema);
