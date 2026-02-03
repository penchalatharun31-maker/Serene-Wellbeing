import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { BookOpen, Plus, Search, Star, Calendar, Lock, Unlock, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import apiClient from '../services/api';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  isFavorite: boolean;
  aiAnalysis?: {
    sentiment: string;
    keywords: string[];
    insights: string[];
  };
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Great therapy session today',
    content: 'Had an amazing breakthrough in therapy. Finally understanding my anxiety triggers...',
    date: new Date('2024-12-14'),
    mood: 'excellent',
    isFavorite: true,
    aiAnalysis: {
      sentiment: 'positive',
      keywords: ['breakthrough', 'understanding', 'anxiety'],
      insights: ['Significant progress in self-awareness', 'Positive therapeutic relationship']
    }
  },
  {
    id: '2',
    title: 'Feeling overwhelmed with work',
    content: 'The project deadline is approaching and I feel stressed...',
    date: new Date('2024-12-13'),
    mood: 'bad',
    isFavorite: false,
    aiAnalysis: {
      sentiment: 'negative',
      keywords: ['overwhelmed', 'stressed', 'deadline'],
      insights: ['Work-life balance needs attention', 'Consider stress management techniques']
    }
  },
];

export const Journal: React.FC = () => {
  const [view, setView] = useState<'list' | 'write'>('list');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch journal entries from backend
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await apiClient.get('/journal');
        if (data.success && data.entries) {
          setEntries(data.entries.map((e: any) => ({
            id: e._id,
            title: e.title || 'Untitled',
            content: e.content,
            date: new Date(e.createdAt),
            mood: e.mood,
            isFavorite: e.favorited || false,
            aiAnalysis: e.aiAnalysis ? {
              sentiment: e.aiAnalysis.sentiment?.includes('positive') ? 'positive' : e.aiAnalysis.sentiment?.includes('negative') ? 'negative' : 'neutral',
              keywords: e.aiAnalysis.keywords || [],
              insights: e.aiAnalysis.insights || [],
            } : undefined,
          })));
        }
      } catch (err) {
        console.error('Failed to fetch journal entries:', err);
        // Show empty list on error, not mock data
      }
    };
    fetchEntries();
  }, [view]); // Refetch when switching back to list view

  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="text-emerald-500" size={16} />;
      case 'negative': return <TrendingDown className="text-red-500" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={28} />
            Journal
          </h1>
          <p className="text-gray-500">Your private space for reflection and growth</p>
        </div>
        <Button onClick={() => setView(view === 'list' ? 'write' : 'list')}>
          {view === 'list' ? <><Plus size={18} className="mr-2" /> New Entry</> : 'Back to Entries'}
        </Button>
      </div>

      {view === 'write' ? (
        /* Write Entry */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 space-y-4">
            <input
              type="text"
              placeholder="Entry title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold border-0 border-b-2 border-gray-200 focus:border-emerald-500 focus:ring-0 px-0 pb-2"
            />
            <textarea
              placeholder="What's on your mind? Write freely..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 border-0 focus:ring-0 resize-none text-gray-700"
            />
            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{saveError}</div>
            )}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock size={14} />
                <span>Private & Encrypted</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={saveLoading} onClick={async () => {
                  if (!content.trim()) { setSaveError('Content is required'); return; }
                  setSaveLoading(true);
                  setSaveError(null);
                  try {
                    if (editingId) {
                      await apiClient.put(`/journal/${editingId}`, { title: title || undefined, content });
                    } else {
                      await apiClient.post('/journal', { title: title || undefined, content, mood: undefined });
                    }
                    setTitle('');
                    setContent('');
                    setEditingId(null);
                    setView('list');
                  } catch (err: any) {
                    setSaveError(err.response?.data?.message || 'Failed to save draft');
                  } finally {
                    setSaveLoading(false);
                  }
                }}>Save Draft</Button>
                <Button disabled={saveLoading || !content.trim()} onClick={async () => {
                  if (!content.trim()) { setSaveError('Content is required'); return; }
                  setSaveLoading(true);
                  setSaveError(null);
                  try {
                    if (editingId) {
                      await apiClient.put(`/journal/${editingId}`, { title: title || undefined, content });
                    } else {
                      await apiClient.post('/journal', { title: title || undefined, content });
                    }
                    setTitle('');
                    setContent('');
                    setEditingId(null);
                    setView('list');
                  } catch (err: any) {
                    setSaveError(err.response?.data?.message || 'Failed to save entry');
                  } finally {
                    setSaveLoading(false);
                  }
                }}>{saveLoading ? 'Saving...' : 'Save Entry'}</Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-purple-600" size={20} />
                <h3 className="font-bold text-gray-900">AI Analysis</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                After saving, AI will analyze your entry to provide:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Sentiment analysis</li>
                <li>• Key themes & emotions</li>
                <li>• Personalized insights</li>
                <li>• Helpful suggestions</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">Journaling Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  Write about your feelings, not just events
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  Be honest with yourself
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  Write regularly for best results
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        /* List Entries */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Entries */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No journal entries yet. Start writing!</p>
                <Button className="mt-4" onClick={() => setView('write')}>
                  <Plus size={16} className="mr-2" /> New Entry
                </Button>
              </div>
            )}
            {filteredEntries.map(entry => (
              <Card key={entry.id} className="p-6 hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => {
                setTitle(entry.title === 'Untitled' ? '' : entry.title);
                setContent(entry.content);
                setEditingId(entry.id);
                setView('write');
              }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{entry.title}</h3>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        apiClient.put(`/journal/${entry.id}/favorite`).then(() => {
                          setEntries(prev => prev.map(ent => ent.id === entry.id ? { ...ent, isFavorite: !ent.isFavorite } : ent));
                        }).catch(console.error);
                      }}>
                        <Star className={entry.isFavorite ? "text-yellow-500" : "text-gray-300"} size={16} fill={entry.isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />
                      {entry.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {entry.aiAnalysis && (
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(entry.aiAnalysis.sentiment)}
                      <Badge color="emerald">AI Analyzed</Badge>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-3 line-clamp-2">{entry.content}</p>

                {entry.aiAnalysis && (
                  <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-purple-600" size={14} />
                      <span className="text-xs font-medium text-purple-900">AI Insights</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.aiAnalysis.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-purple-800">
                      {entry.aiAnalysis.insights[0]}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-1">{entries.length}</div>
                <p className="text-sm text-gray-600">Total Entries</p>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <p className="text-xs text-gray-600">This Week</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">28</div>
                  <p className="text-xs text-gray-600">This Month</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">Writing Streak 🔥</h3>
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-orange-500">12</div>
                <p className="text-sm text-gray-600">days in a row</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${
                      i < 12 ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">Sentiment Trend</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Positive</span>
                  <span className="font-medium text-emerald-600">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Neutral</span>
                  <span className="font-medium text-blue-600">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Negative</span>
                  <span className="font-medium text-red-600">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
