import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStreak {
  type: 'mood_tracking' | 'journaling' | 'meditation' | 'sessions' | 'challenges';
  current: number;
  longest: number;
  lastActivity: Date;
}

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: string;
}

export interface IUserProgress extends Document {
  userId: Types.ObjectId;

  // Points and levels
  totalPoints: number;
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;

  // Streaks
  streaks: IStreak[];

  // Achievements
  achievements: IAchievement[];

  // Activity counters
  stats: {
    totalSessions: number;
    totalMoodEntries: number;
    totalJournalEntries: number;
    totalMeditations: number;
    totalChallengesCompleted: number;
    totalChatMessages: number;
    daysActive: number;
  };

  // Wellness metrics over time
  wellnessScore: {
    current: number;
    history: {
      date: Date;
      score: number;
    }[];
    trend: 'improving' | 'stable' | 'declining';
  };

  // Goals
  goals: {
    id: string;
    title: string;
    description: string;
    category: string;
    targetDate?: Date;
    progress: number; // 0-100
    completed: boolean;
    completedAt?: Date;
  }[];

  // Challenges
  activeChallenges: {
    challengeId: Types.ObjectId;
    joinedAt: Date;
    progress: number;
    pointsEarned: number;
    tasksCompleted: number;
    totalTasks: number;
  }[];

  // Milestones
  milestones: {
    type: string;
    title: string;
    achievedAt: Date;
    value: number;
  }[];

  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    experiencePoints: {
      type: Number,
      default: 0
    },
    nextLevelPoints: {
      type: Number,
      default: 100
    },
    streaks: [{
      type: {
        type: String,
        enum: ['mood_tracking', 'journaling', 'meditation', 'sessions', 'challenges']
      },
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivity: Date
    }],
    achievements: [{
      id: String,
      title: String,
      description: String,
      icon: String,
      unlockedAt: Date,
      category: String
    }],
    stats: {
      totalSessions: { type: Number, default: 0 },
      totalMoodEntries: { type: Number, default: 0 },
      totalJournalEntries: { type: Number, default: 0 },
      totalMeditations: { type: Number, default: 0 },
      totalChallengesCompleted: { type: Number, default: 0 },
      totalChatMessages: { type: Number, default: 0 },
      daysActive: { type: Number, default: 0 }
    },
    wellnessScore: {
      current: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
      },
      history: [{
        date: Date,
        score: Number
      }],
      trend: {
        type: String,
        enum: ['improving', 'stable', 'declining'],
        default: 'stable'
      }
    },
    goals: [{
      id: String,
      title: String,
      description: String,
      category: String,
      targetDate: Date,
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    activeChallenges: [{
      challengeId: {
        type: Schema.Types.ObjectId,
        ref: 'WellnessChallenge'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      progress: {
        type: Number,
        default: 0
      },
      pointsEarned: {
        type: Number,
        default: 0
      },
      tasksCompleted: {
        type: Number,
        default: 0
      },
      totalTasks: Number
    }],
    milestones: [{
      type: String,
      title: String,
      achievedAt: Date,
      value: Number
    }],
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ level: 1, totalPoints: -1 });
UserProgressSchema.index({ lastActive: -1 });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
