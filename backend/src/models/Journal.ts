import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJournal extends Document {
  userId: Types.ObjectId;
  title?: string;
  content: string;
  mood?: string;
  emotions: string[];
  tags: string[];
  aiAnalysis?: {
    sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
    sentimentScore: number; // -1 to 1
    emotions: {
      emotion: string;
      intensity: number; // 0-1
    }[];
    themes: string[];
    keywords: string[];
    insights: string[];
    suggestions: string[];
    concernLevel: 'low' | 'medium' | 'high';
    positiveAspects: string[];
    areasOfConcern: string[];
  };
  isPrivate: boolean;
  favorited: boolean;
  imageUrls?: string[];
  voiceNoteUrl?: string;
  location?: string;
  weather?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema = new Schema<IJournal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000
    },
    mood: String,
    emotions: [{
      type: String
    }],
    tags: [{
      type: String,
      maxlength: 50
    }],
    aiAnalysis: {
      sentiment: {
        type: String,
        enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative']
      },
      sentimentScore: {
        type: Number,
        min: -1,
        max: 1
      },
      emotions: [{
        emotion: String,
        intensity: {
          type: Number,
          min: 0,
          max: 1
        }
      }],
      themes: [String],
      keywords: [String],
      insights: [String],
      suggestions: [String],
      concernLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      positiveAspects: [String],
      areasOfConcern: [String]
    },
    isPrivate: {
      type: Boolean,
      default: true
    },
    favorited: {
      type: Boolean,
      default: false
    },
    imageUrls: [String],
    voiceNoteUrl: String,
    location: String,
    weather: String
  },
  {
    timestamps: true
  }
);

// Indexes
JournalSchema.index({ userId: 1, createdAt: -1 });
JournalSchema.index({ userId: 1, tags: 1 });
JournalSchema.index({ userId: 1, favorited: 1 });
JournalSchema.index({ 'aiAnalysis.concernLevel': 1 });

export default mongoose.model<IJournal>('Journal', JournalSchema);
