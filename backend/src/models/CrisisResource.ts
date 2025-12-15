import mongoose, { Schema, Document } from 'mongoose';

export interface ICrisisResource extends Document {
  type: 'hotline' | 'text_line' | 'chat' | 'website' | 'app' | 'local_service';
  name: string;
  description: string;
  category: 'suicide' | 'mental_health' | 'substance_abuse' | 'domestic_violence' | 'lgbtq' | 'veterans' | 'youth' | 'general';
  country: string;
  region?: string;

  contact: {
    phone?: string;
    sms?: string;
    website?: string;
    email?: string;
  };

  availability: {
    is24_7: boolean;
    hours?: string;
    languages: string[];
  };

  targetAudience?: string[];
  ageGroups?: string[];

  rating?: number;
  verified: boolean;
  isPrimary: boolean; // Show first in emergencies
  priority: number; // Display order

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CrisisResourceSchema = new Schema<ICrisisResource>(
  {
    type: {
      type: String,
      enum: ['hotline', 'text_line', 'chat', 'website', 'app', 'local_service'],
      required: true
    },
    name: {
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
      enum: ['suicide', 'mental_health', 'substance_abuse', 'domestic_violence', 'lgbtq', 'veterans', 'youth', 'general'],
      required: true
    },
    country: {
      type: String,
      required: true
    },
    region: String,
    contact: {
      phone: String,
      sms: String,
      website: String,
      email: String
    },
    availability: {
      is24_7: {
        type: Boolean,
        default: false
      },
      hours: String,
      languages: [{
        type: String,
        default: ['English']
      }]
    },
    targetAudience: [String],
    ageGroups: [String],
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    verified: {
      type: Boolean,
      default: false
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    priority: {
      type: Number,
      default: 100
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CrisisResourceSchema.index({ country: 1, category: 1, isPrimary: -1 });
CrisisResourceSchema.index({ isActive: 1, priority: 1 });

export default mongoose.model<ICrisisResource>('CrisisResource', CrisisResourceSchema);
