import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Play, Clock, Star, Headphones, Film, BookOpen, Search, Loader2 } from 'lucide-react';
import apiClient from '../services/api';

export const ContentLibrary: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [content, setContent] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Debounce search input by 400 ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch featured content once on mount
  useEffect(() => {
    apiClient.get('/content/featured')
      .then(res => {
        const items = res.data?.content || [];
        if (items.length > 0) setFeatured(items[0]);
      })
      .catch(console.error);
  }, []);

  // Re-fetch content list whenever search or type filter changes
  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filter !== 'all') params.type = filter;

      const res = await apiClient.get('/content', { params });
      setContent(res.data?.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
    }
    return `${minutes} min`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Headphones size={16} />;
      case 'video': return <Film size={16} />;
      case 'article': return <BookOpen size={16} />;
      default: return <Play size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Play className="text-emerald-500" size={28} />
            Content Library
          </h1>
          <p className="text-gray-500">Meditation, exercises, and wellness resources</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search meditations, exercises, articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="all">All Types</option>
          <option value="meditation">Meditation</option>
          <option value="breathing">Breathing</option>
          <option value="exercise">Exercise</option>
          <option value="article">Articles</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Featured */}
      {featured && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div
              className="h-64 md:h-auto bg-cover bg-center"
              style={{ backgroundImage: featured.media?.thumbnailUrl ? `url(${featured.media.thumbnailUrl})` : 'linear-gradient(135deg, #10B981, #059669)' }}
            ></div>
            <div className="p-8 flex flex-col justify-center">
              <Badge color="emerald" className="w-fit mb-3">Featured</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {featured.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {featured.description}
              </p>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDuration(featured.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} fill="currentColor" className="text-yellow-500" />
                  {featured.stats?.avgRating?.toFixed(1) || '0.0'} ({(featured.stats?.totalRatings || 0).toLocaleString()})
                </span>
                {featured.isPremium && <Badge color="blue">Premium</Badge>}
              </div>
              <Button className="w-fit">Start Course</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No content found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map(item => (
            <Card key={item._id} className="overflow-hidden hover:border-emerald-200 transition-colors group cursor-pointer">
              <div className="relative">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: item.media?.thumbnailUrl ? `url(${item.media.thumbnailUrl})` : 'linear-gradient(135deg, #10B981, #059669)' }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
                      <Play size={24} className="text-emerald-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                {item.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge color="blue">Premium</Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="gray">
                    <span className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      {item.type}
                    </span>
                  </Badge>
                  <span className="text-xs text-gray-500">{item.duration} min</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.instructor || 'Serene Wellbeing'}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-gray-900 font-medium">{item.stats?.avgRating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-500">{(item.stats?.plays || 0).toLocaleString()} plays</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
