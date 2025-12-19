import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Types.ObjectId;
  category: string;
  tags: string[];
  featuredImage: string;
  imageAlt: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  // SEO Fields
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  // Reading time
  readingTime: number; // in minutes
  // Publication
  publishedAt?: Date;
  scheduledFor?: Date;
  // Comments
  commentsEnabled: boolean;
  commentCount: number;
  // Related content
  relatedPosts: Types.ObjectId[];
  // Analytics
  shares: {
    facebook: number;
    twitter: number;
    linkedin: number;
  };
  createdAt: Date;
  updatedAt: Date;
  // Methods
  incrementViews(): Promise<this>;
  incrementLikes(): Promise<this>;
  calculateReadingTime(): number;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Mental Health',
        'Therapy Tips',
        'Wellness',
        'Self-Care',
        'Relationships',
        'Anxiety & Depression',
        'Stress Management',
        'Work-Life Balance',
        'Mindfulness',
        'Expert Advice',
        'Success Stories',
        'Company News',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    imageAlt: {
      type: String,
      required: [true, 'Image alt text is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
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
    // SEO Fields
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title should not exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description should not exceed 160 characters'],
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
    },
    ogImage: {
      type: String,
    },
    ogTitle: {
      type: String,
      maxlength: [60, 'OG title should not exceed 60 characters'],
    },
    ogDescription: {
      type: String,
      maxlength: [200, 'OG description should not exceed 200 characters'],
    },
    // Reading time
    readingTime: {
      type: Number,
      default: 5,
      min: 1,
    },
    // Publication
    publishedAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    // Comments
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Related content
    relatedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
    }],
    // Analytics
    shares: {
      facebook: {
        type: Number,
        default: 0,
        min: 0,
      },
      twitter: {
        type: Number,
        default: 0,
        min: 0,
      },
      linkedin: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, status: 1 });
BlogPostSchema.index({ tags: 1, status: 1 });
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ createdAt: -1 });
BlogPostSchema.index({ views: -1 });
BlogPostSchema.index({ likes: -1 });

// Text index for search
BlogPostSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text'
});

// Virtual for URL
BlogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Method to increment views
BlogPostSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
BlogPostSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  return this.save();
};

// Method to calculate reading time
BlogPostSchema.methods.calculateReadingTime = function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  return this.readingTime;
};

// Pre-save middleware to auto-generate slug from title if not provided
BlogPostSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Auto-calculate reading time
  if (this.content && !this.readingTime) {
    this.calculateReadingTime();
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Auto-generate meta fields from content if not provided
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title.substring(0, 60);
  }

  if (!this.metaDescription && this.excerpt) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }

  if (!this.ogTitle && this.title) {
    this.ogTitle = this.title.substring(0, 60);
  }

  if (!this.ogDescription && this.excerpt) {
    this.ogDescription = this.excerpt.substring(0, 200);
  }

  if (!this.ogImage && this.featuredImage) {
    this.ogImage = this.featuredImage;
  }

  next();
});

// Static method to get popular posts
BlogPostSchema.statics.getPopularPosts = function(limit = 5) {
  return this.find({ status: 'published' })
    .sort({ views: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .select('-content');
};

// Static method to get recent posts
BlogPostSchema.statics.getRecentPosts = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .select('-content');
};

// Static method to get posts by category
BlogPostSchema.statics.getPostsByCategory = function(category: string, limit = 10) {
  return this.find({ status: 'published', category })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .select('-content');
};

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
