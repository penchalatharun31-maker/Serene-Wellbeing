import mongoose, { Schema, Document } from 'mongoose';

export interface IExpert extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  specialization: string[];
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  currency: string;
  country: string;
  languages: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
    document?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  availability: {
    monday: Array<{ start: string; end: string }>;
    tuesday: Array<{ start: string; end: string }>;
    wednesday: Array<{ start: string; end: string }>;
    thursday: Array<{ start: string; end: string }>;
    friday: Array<{ start: string; end: string }>;
    saturday: Array<{ start: string; end: string }>;
    sunday: Array<{ start: string; end: string }>;
  };
  timezone: string;
  slotDuration: number;
  breakTimes: Array<{
    start: string;
    end: string;
    days: number[];
  }>;
  bookedSlots: Array<{
    date: Date;
    startTime: string;
    endTime: string;
    sessionId: mongoose.Types.ObjectId;
  }>;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  totalEarnings: number;
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  responseTime: number;
  profileViews: number;
  isAcceptingClients: boolean;
  maxClientsPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExpertSchema = new Schema<IExpert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
    },
    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one specialization is required',
      },
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      minlength: [50, 'Bio must be at least 50 characters'],
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [1, 'Hourly rate must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    country: {
      type: String,
      default: 'India',
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuer: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1950,
          max: new Date().getFullYear(),
        },
        document: String,
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1950,
          max: new Date().getFullYear(),
        },
      },
    ],
    availability: {
      monday: [{ start: String, end: String }],
      tuesday: [{ start: String, end: String }],
      wednesday: [{ start: String, end: String }],
      thursday: [{ start: String, end: String }],
      friday: [{ start: String, end: String }],
      saturday: [{ start: String, end: String }],
      sunday: [{ start: String, end: String }],
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    slotDuration: {
      type: Number,
      default: 60,
      enum: [15, 30, 60],
    },
    breakTimes: [
      {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
        days: {
          type: [Number],
          default: [],
          validate: {
            validator: (v: number[]) => v.every(day => day >= 0 && day <= 6),
            message: 'Day must be between 0 (Sunday) and 6 (Saturday)',
          },
        },
      },
    ],
    bookedSlots: [
      {
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        sessionId: {
          type: Schema.Types.ObjectId,
          ref: 'Session',
          required: true,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedSessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    cancelledSessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    responseTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAcceptingClients: {
      type: Boolean,
      default: true,
    },
    maxClientsPerDay: {
      type: Number,
      default: 8,
      min: 1,
      max: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ExpertSchema.index({ userId: 1 });
ExpertSchema.index({ specialization: 1 });
ExpertSchema.index({ rating: -1 });
ExpertSchema.index({ hourlyRate: 1 });
ExpertSchema.index({ isApproved: 1, approvalStatus: 1 });
ExpertSchema.index({ isAcceptingClients: 1 });

export default mongoose.model<IExpert>('Expert', ExpertSchema);
