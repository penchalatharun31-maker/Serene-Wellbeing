import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  adminUserId: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
  industry: string;
  size: string;
  credits: number;
  employees: mongoose.Types.ObjectId[];
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'suspended';
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  totalSpent: number;
  creditsPurchased: number;
  creditsUsed: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Company email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    industry: {
      type: String,
      required: [true, 'Industry is required'],
    },
    size: {
      type: String,
      enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
      required: [true, 'Company size is required'],
    },
    credits: {
      type: Number,
      default: 0,
      min: [0, 'Credits cannot be negative'],
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: String,
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    creditsPurchased: {
      type: Number,
      default: 0,
      min: 0,
    },
    creditsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanySchema.index({ email: 1 });
CompanySchema.index({ adminUserId: 1 });
CompanySchema.index({ subscriptionStatus: 1 });

export default mongoose.model<ICompany>('Company', CompanySchema);
