import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogService, BlogPost, Category } from '../services/blog.service';
import { Search, Calendar, Clock, Tag, TrendingUp, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    loadPosts();
    loadPopularPosts();
    loadCategories();
  }, [currentPage, currentCategory, searchQuery]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts({
        page: currentPage,
        limit: 9,
        category: currentCategory,
        search: searchQuery,
        sort: '-publishedAt',
      });
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularPosts = async () => {
    try {
      const response = await blogService.getPopularPosts(5);
      setPopularPosts(response.data);
    } catch (error) {
      console.error('Error loading popular posts:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setSearchParams({ search, page: '1' });
  };

  const handleCategoryClick = (category: string) => {
    if (category === currentCategory) {
      setSearchParams({ page: '1' });
    } else {
      setSearchParams({ category, page: '1' });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags - Would be better with React Helmet */}
      <title>Mental Health Blog | Serene Wellbeing Hub</title>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mental Health & Wellness Blog
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Expert insights, tips, and stories to support your mental health journey
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search articles..."
                  defaultValue={searchQuery}
                  className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 transition"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-teal-600" />
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                    !currentCategory
                      ? 'bg-teal-100 text-teal-700 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      currentCategory === cat.name
                        ? 'bg-teal-100 text-teal-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
                Popular Posts
              </h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={post.featuredImage}
                        alt={post.imageAlt}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium group-hover:text-teal-600 transition line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.views} views
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            {currentCategory && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentCategory}
                </h2>
                <p className="text-gray-600">
                  {pagination.total} articles found
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No articles found</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.publishedAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.readingTime} min
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-teal-600 font-medium group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex gap-2">
                      {currentPage > 1 && (
                        <button
                          onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(currentPage - 1) })}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Previous
                        </button>
                      )}
                      {[...Array(pagination.pages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page) })}
                              className={`px-4 py-2 rounded-lg ${
                                page === currentPage
                                  ? 'bg-teal-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 py-2">...</span>;
                        }
                        return null;
                      })}
                      {currentPage < pagination.pages && (
                        <button
                          onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(currentPage + 1) })}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
