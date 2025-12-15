import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  type: 'meditation' | 'exercise' | 'breathing' | 'yoga' | 'podcast' | 'article' | 'video' | 'audio_guide';
  category: 'stress' | 'anxiety' | 'depression' | 'sleep' | 'focus' | 'relationships' | 'self_esteem' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  duration: number; // in minutes

  media: {
    audioUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    transcript?: string;
  };

  content?: string; // For articles
  steps?: string[]; // For exercises

  instructor?: string;
  voice?: 'male' | 'female' | 'neutral';

  tags: string[];
  benefits: string[];
  prerequisites?: string[];

  stats: {
    plays: number;
    completions: number;
    favorites: number;
    avgRating: number;
    totalRatings: number;
  };

  isFree: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  isPublished: boolean;

  aiGenerated: boolean;
  aiPrompt?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
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
    type: {
      type: String,
      enum: ['meditation', 'exercise', 'breathing', 'yoga', 'podcast', 'article', 'video', 'audio_guide'],
      required: true
    },
    category: {
      type: String,
      enum: ['stress', 'anxiety', 'depression', 'sleep', 'focus', 'relationships', 'self_esteem', 'general'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all'
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    media: {
      audioUrl: String,
      videoUrl: String,
      thumbnailUrl: String,
      transcript: String
    },
    content: String,
    steps: [String],
    instructor: String,
    voice: {
      type: String,
      enum: ['male', 'female', 'neutral']
    },
    tags: [String],
    benefits: [String],
    prerequisites: [String],
    stats: {
      plays: {
        type: Number,
        default: 0
      },
      completions: {
        type: Number,
        default: 0
      },
      favorites: {
        type: Number,
        default: 0
      },
      avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      totalRatings: {
        type: Number,
        default: 0
      }
    },
    isFree: {
      type: Boolean,
      default: true
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    aiGenerated: {
      type: Boolean,
      default: false
    },
    aiPrompt: String
  },
  {
    timestamps: true
  }
);

// Indexes
ContentSchema.index({ type: 1, category: 1, isPublished: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ isFeatured: -1, 'stats.avgRating': -1 });
ContentSchema.index({ 'stats.plays': -1 });

export default mongoose.model<IContent>('Content', ContentSchema);
