import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Play, Clock, Star, Headphones, Film, BookOpen, Heart, Search, Filter } from 'lucide-react';

const mockContent = [
  {
    id: '1',
    title: '10-Minute Morning Meditation',
    type: 'meditation',
    category: 'stress',
    duration: 10,
    difficulty: 'beginner',
    rating: 4.8,
    plays: 15420,
    instructor: 'Sarah Chen',
    isFree: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
  },
  {
    id: '2',
    title: 'Breathing for Anxiety Relief',
    type: 'breathing',
    category: 'anxiety',
    duration: 5,
    difficulty: 'all',
    rating: 4.9,
    plays: 28350,
    instructor: 'Dr. Michael Ross',
    isFree: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400'
  },
  {
    id: '3',
    title: 'Understanding Depression',
    type: 'article',
    category: 'depression',
    duration: 8,
    difficulty: 'all',
    rating: 4.7,
    plays: 12480,
    instructor: 'Dr. Emily Hart',
    isFree: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400'
  },
  {
    id: '4',
    title: 'Sleep Better Tonight',
    type: 'audio_guide',
    category: 'sleep',
    duration: 20,
    difficulty: 'beginner',
    rating: 4.9,
    plays: 34210,
    instructor: 'Luna Martinez',
    isFree: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400'
  },
];

export const ContentLibrary: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Headphones size={16} />;
      case 'video': return <Film size={16} />;
      case 'article': return <BookOpen size={16} />;
      default: return <Play size={16} />;
    }
  };

  const filteredContent = mockContent.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || item.type === filter)
  );

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
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div
            className="h-64 md:h-auto bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800)' }}
          ></div>
          <div className="p-8 flex flex-col justify-center">
            <Badge color="emerald" className="w-fit mb-3">Featured</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Complete Mindfulness Course
            </h2>
            <p className="text-gray-600 mb-6">
              12 guided sessions to master mindfulness meditation and reduce stress
            </p>
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                6 hours
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} fill="currentColor" className="text-yellow-500" />
                4.9 (2,340)
              </span>
              <Badge color="blue">Premium</Badge>
            </div>
            <Button className="w-fit">Start Course</Button>
          </div>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <Card key={item.id} className="overflow-hidden hover:border-emerald-200 transition-colors group cursor-pointer">
            <div className="relative">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
                    <Play size={24} className="text-emerald-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              {!item.isFree && (
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
              <p className="text-sm text-gray-600 mb-3">{item.instructor}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-gray-900 font-medium">{item.rating}</span>
                </div>
                <span className="text-gray-500">{item.plays.toLocaleString()} plays</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentLibrary;
