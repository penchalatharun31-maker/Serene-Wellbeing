import React, { useState } from 'react';
import { RESOURCES } from '../data';
import { Card, Badge, Button } from '../components/UI';
import { PlayCircle, FileText, Headphones, Clock } from 'lucide-react';

const Resources: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Article', 'Video', 'Audio'];

  const filteredResources = filter === 'All' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.type === filter);

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'Video': return <PlayCircle size={16} className="mr-1" />;
          case 'Audio': return <Headphones size={16} className="mr-1" />;
          default: return <FileText size={16} className="mr-1" />;
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellbeing Library</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">Explore our curated collection of articles, meditations, and exercises to support your journey.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === cat 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
                <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-transparent hover:border-emerald-100">
                    <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl">
                        <img 
                            src={resource.image} 
                            alt={resource.title} 
                            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                            <Badge color="emerald">{resource.category}</Badge>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center text-xs text-emerald-600 font-medium mb-2">
                            {getTypeIcon(resource.type)} {resource.type}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{resource.title}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {resource.duration}</span>
                            <span>By {resource.author}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;