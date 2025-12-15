import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'concerning';
  crisisDetected?: boolean;
}

export interface IAIConversation extends Document {
  userId: Types.ObjectId;
  sessionId: string;
  title?: string;
  messages: IMessage[];
  context: {
    recentMood?: string;
    currentGoals?: string[];
    ongoingConcerns?: string[];
    previousTopics?: string[];
  };
  analytics: {
    totalMessages: number;
    avgSentiment: number;
    crisisFlags: number;
    topics: string[];
    duration: number; // in seconds
  };
  crisisIntervention?: {
    triggered: boolean;
    timestamp: Date;
    reason: string;
    action: 'resources_provided' | 'expert_notified' | 'emergency_contact';
  };
  status: 'active' | 'completed' | 'escalated';
  escalatedTo?: Types.ObjectId; // Expert ID if escalated
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIConversationSchema = new Schema<IAIConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      maxlength: 200
    },
    messages: [{
      role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'concerning']
      },
      crisisDetected: {
        type: Boolean,
        default: false
      }
    }],
    context: {
      recentMood: String,
      currentGoals: [String],
      ongoingConcerns: [String],
      previousTopics: [String]
    },
    analytics: {
      totalMessages: {
        type: Number,
        default: 0
      },
      avgSentiment: {
        type: Number,
        default: 0
      },
      crisisFlags: {
        type: Number,
        default: 0
      },
      topics: [String],
      duration: {
        type: Number,
        default: 0
      }
    },
    crisisIntervention: {
      triggered: {
        type: Boolean,
        default: false
      },
      timestamp: Date,
      reason: String,
      action: {
        type: String,
        enum: ['resources_provided', 'expert_notified', 'emergency_contact']
      }
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'escalated'],
      default: 'active'
    },
    escalatedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
AIConversationSchema.index({ userId: 1, status: 1 });
AIConversationSchema.index({ userId: 1, startedAt: -1 });
AIConversationSchema.index({ 'crisisIntervention.triggered': 1 });

export default mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
