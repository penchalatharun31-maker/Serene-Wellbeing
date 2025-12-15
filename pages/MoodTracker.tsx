import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { Smile, Meh, Frown, Calendar, TrendingUp, TrendingDown, Minus, Heart, Zap, Cloud, Sun, Moon, Activity, BarChart3, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const MOODS = [
  { value: 'excellent', label: 'Excellent', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50', score: 10 },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', score: 8 },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', score: 5 },
  { value: 'bad', label: 'Bad', icon: Cloud, color: 'text-orange-500', bg: 'bg-orange-50', score: 3 },
  { value: 'terrible', label: 'Terrible', icon: Frown, color: 'text-red-500', bg: 'bg-red-50', score: 1 },
];

const EMOTIONS = [
  'happy', 'sad', 'anxious', 'angry', 'calm', 'excited',
  'frustrated', 'peaceful', 'overwhelmed', 'hopeful',
  'lonely', 'grateful', 'confident', 'worried', 'content'
];

const ACTIVITIES = [
  'exercise', 'work', 'social', 'sleep', 'meditation',
  'therapy', 'hobby', 'family', 'relaxation', 'learning',
  'creative', 'outdoor', 'entertainment', 'self-care'
];

// Mock data
const mockMoodData = [
  { date: 'Mon', score: 7, energy: 6, stress: 4 },
  { date: 'Tue', score: 6, energy: 5, stress: 6 },
  { date: 'Wed', score: 8, energy: 7, stress: 3 },
  { date: 'Thu', score: 7, energy: 6, stress: 5 },
  { date: 'Fri', score: 9, energy: 8, stress: 2 },
  { date: 'Sat', score: 8, energy: 7, stress: 3 },
  { date: 'Sun', score: 7, energy: 6, stress: 4 },
];

const mockEmotionData = [
  { emotion: 'Happy', value: 8 },
  { emotion: 'Calm', value: 7 },
  { emotion: 'Confident', value: 6 },
  { emotion: 'Anxious', value: 3 },
  { emotion: 'Stressed', value: 4 },
];

export const MoodTracker: React.FC = () => {
  const [view, setView] = useState<'log' | 'analytics'>('log');
  const [selectedMood, setSelectedMood] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async () => {
    const moodData = {
      mood: selectedMood,
      moodScore,
      emotions: selectedEmotions,
      activities: selectedActivities,
      energy,
      stress,
      sleep: { hours: sleepHours, quality: sleepQuality },
      notes
    };

    console.log('Submitting mood:', moodData);
    // TODO: API call
    alert('Mood logged successfully! 🎉 +5 XP');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-emerald-500" size={28} />
            Mood Tracker
          </h1>
          <p className="text-gray-500">Track your emotional wellbeing daily</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'log' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('log')}
          >
            Log Mood
          </Button>
          <Button
            variant={view === 'analytics' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('analytics')}
          >
            <BarChart3 size={16} className="mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {view === 'log' ? (
        /* Mood Logging Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Select Mood */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">How are you feeling today?</h3>
              <div className="grid grid-cols-5 gap-3">
                {MOODS.map(mood => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      onClick={() => {
                        setSelectedMood(mood.value);
                        setMoodScore(mood.score);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${mood.bg} border-current ${mood.color} scale-105`
                          : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={32} />
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Mood Details */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tell us more</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood Score: {moodScore}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodScore}
                    onChange={(e) => setMoodScore(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-500" />
                      Energy: {energy}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Cloud size={16} className="text-red-500" />
                      Stress: {stress}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stress}
                      onChange={(e) => setStress(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Moon size={16} className="text-indigo-500" />
                      Sleep Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(Number(e.target.value))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Quality: {sleepQuality}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={sleepQuality}
                      onChange={(e) => setSleepQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Emotions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">What emotions are you experiencing?</h3>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedEmotions.includes(emotion)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </Card>

            {/* Activities */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">What have you been doing?</h3>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map(activity => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedActivities.includes(activity)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Notes (Optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, triggers, or gratitude..."
                className="w-full h-32 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your notes are private and will be analyzed by AI to provide personalized insights.
              </p>
            </Card>

            <Button onClick={handleSubmit} className="w-full" size="lg">
              Log Mood Entry
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="text-emerald-600" size={20} />
                <h3 className="font-bold text-gray-900">Your Streak</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-1">7</div>
                <p className="text-sm text-gray-600">days in a row! 🔥</p>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <p className="text-xs text-gray-600">Longest streak: 14 days</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-blue-600" size={20} />
                <h3 className="font-bold text-gray-900">This Week</h3>
              </div>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i < 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {i < 6 ? <Sun size={16} /> : <Minus size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Analytics View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Mood</p>
                <h3 className="text-2xl font-bold text-gray-900">7.4/10</h3>
              </div>
            </div>
            <Badge color="emerald">↑ Improving</Badge>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Energy</p>
                <h3 className="text-2xl font-bold text-gray-900">6.5/10</h3>
              </div>
            </div>
            <Badge color="blue">→ Stable</Badge>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <Cloud size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Stress</p>
                <h3 className="text-2xl font-bold text-gray-900">4.1/10</h3>
              </div>
            </div>
            <Badge color="emerald">↓ Decreasing</Badge>
          </Card>

          {/* Mood Trend Chart */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4">Mood Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockMoodData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#10b981" fill="url(#colorScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Emotion Radar */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Emotion Profile</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={mockEmotionData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="emotion" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#9ca3af' }} />
                <Radar name="Intensity" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 lg:col-span-3 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lightbulb className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-3">AI Insights</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Your mood tends to improve significantly on days with <strong>exercise</strong>. Consider adding 2-3 more workout sessions this week.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      You've logged <strong>consistent stress</strong> around work activities. Try incorporating 10 minutes of meditation before starting work.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">
                      Great progress! Your mood has been <strong>improving steadily</strong> over the past week. Keep up the self-care routine!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
