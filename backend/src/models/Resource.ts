import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'pdf';
  category: string;
  tags: string[];
  content?: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  isPremium: boolean;
  views: number;
  likes: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
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
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['article', 'video', 'audio', 'pdf'],
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    tags: [String],
    content: String,
    url: String,
    thumbnailUrl: String,
    duration: {
      type: Number,
      min: 0,
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      bio: String,
      avatar: String,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ResourceSchema.index({ type: 1, category: 1, isPublished: 1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ views: -1 });
ResourceSchema.index({ createdAt: -1 });

export default mongoose.model<IResource>('Resource', ResourceSchema);
