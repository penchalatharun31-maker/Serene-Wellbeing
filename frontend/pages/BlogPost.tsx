import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService, BlogPost as BlogPostType } from '../services/blog.service';
import { Calendar, Clock, User, Heart, Share2, Tag, ArrowLeft, ChevronRight } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPostBySlug(slug!);
      setPost(response.data);
      setLikes(response.data.likes);

      // Load related posts from same category
      const related = await blogService.getPostsByCategory(response.data.category, 3);
      setRelatedPosts(related.data.filter(p => p.slug !== slug));
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;

    try {
      await blogService.likePost(post._id);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-96 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags - Use React Helmet in production */}
      <title>{post.metaTitle || post.title} | Serene Wellbeing Hub</title>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/blog" className="hover:text-teal-600">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">{post.category}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <Link
              to={`/blog?category=${post.category}`}
              className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-teal-200 transition"
            >
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center">
              <span>{post.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="text-sm text-gray-600 hover:text-teal-600 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Social Actions */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                liked
                  ? 'bg-red-100 text-red-600 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Share:</span>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition"
                title="Share on Twitter"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition"
                title="Share on Facebook"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition"
                title="Share on LinkedIn"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.imageAlt}
            className="w-full h-auto"
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio */}
        <div className="bg-gray-100 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                About {post.author.name}
              </h3>
              <p className="text-gray-600">
                Mental health professional dedicated to helping others on their wellness journey.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.imageAlt}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
