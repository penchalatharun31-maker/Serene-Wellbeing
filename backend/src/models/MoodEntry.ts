import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMoodEntry extends Document {
  userId: Types.ObjectId;
  mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
  moodScore: number; // 1-10 scale
  emotions: string[]; // happy, sad, anxious, angry, calm, etc.
  activities: string[]; // exercise, work, social, sleep, etc.
  energy: number; // 1-10
  stress: number; // 1-10
  sleep: {
    hours: number;
    quality: number; // 1-10
  };
  notes?: string;
  aiInsights?: {
    sentiment: 'positive' | 'negative' | 'neutral' | 'concerning';
    keywords: string[];
    suggestions: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  triggers?: string[];
  gratitude?: string[];
  goals?: string[];
  location?: string;
  weather?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodEntrySchema = new Schema<IMoodEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    mood: {
      type: String,
      enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
      required: true
    },
    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    emotions: [{
      type: String,
      enum: [
        'happy', 'sad', 'anxious', 'angry', 'calm', 'excited',
        'frustrated', 'peaceful', 'overwhelmed', 'hopeful',
        'lonely', 'grateful', 'confident', 'worried', 'content'
      ]
    }],
    activities: [{
      type: String,
      enum: [
        'exercise', 'work', 'social', 'sleep', 'meditation',
        'therapy', 'hobby', 'family', 'relaxation', 'learning',
        'creative', 'outdoor', 'entertainment', 'self-care'
      ]
    }],
    energy: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    stress: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    sleep: {
      hours: {
        type: Number,
        min: 0,
        max: 24
      },
      quality: {
        type: Number,
        min: 1,
        max: 10
      }
    },
    notes: {
      type: String,
      maxlength: 2000
    },
    aiInsights: {
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'concerning']
      },
      keywords: [String],
      suggestions: [String],
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    triggers: [String],
    gratitude: [String],
    goals: [String],
    location: String,
    weather: String
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
MoodEntrySchema.index({ userId: 1, createdAt: -1 });
MoodEntrySchema.index({ userId: 1, mood: 1 });
MoodEntrySchema.index({ 'aiInsights.riskLevel': 1, createdAt: -1 });

export default mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema);
