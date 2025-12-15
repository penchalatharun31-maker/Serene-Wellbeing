import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Trophy, Target, Users, Calendar, Star, CheckCircle, Play } from 'lucide-react';

const mockChallenges = [
  {
    id: '1',
    title: '7-Day Gratitude Journey',
    description: 'Practice daily gratitude to boost your mood and perspective',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 7,
    tasks: 7,
    completed: 5,
    participants: 1284,
    points: 70,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400'
  },
  {
    id: '2',
    title: '30-Day Meditation Master',
    description: 'Build a consistent meditation practice',
    category: 'mental_health',
    difficulty: 'intermediate',
    duration: 30,
    tasks: 30,
    completed: 0,
    participants: 856,
    points: 300,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
  },
  {
    id: '3',
    title: 'Social Connection Week',
    description: 'Reach out and strengthen your relationships',
    category: 'social',
    difficulty: 'beginner',
    duration: 7,
    tasks: 7,
    completed: 7,
    participants: 2103,
    points: 100,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400'
  },
];

export const WellnessChallenges: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'emerald';
      case 'intermediate': return 'blue';
      case 'advanced': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="text-emerald-500" size={28} />
            Wellness Challenges
          </h1>
          <p className="text-gray-500">Level up your mental health journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant={filter === 'active' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('active')}>
            Active
          </Button>
          <Button variant={filter === 'completed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('completed')}>
            Completed
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Target className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Points</p>
              <p className="text-xl font-bold text-gray-900">1,240</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Trophy className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rank</p>
              <p className="text-xl font-bold text-gray-900">#48</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockChallenges.map(challenge => {
          const progress = (challenge.completed / challenge.tasks) * 100;
          const isCompleted = challenge.completed === challenge.tasks;

          return (
            <Card key={challenge.id} className="overflow-hidden">
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${challenge.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-1">{challenge.title}</h3>
                  <p className="text-white/90 text-sm">{challenge.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge color={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {challenge.duration} days
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {challenge.participants.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600">+{challenge.points} pts</span>
                </div>

                {challenge.completed > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {challenge.completed}/{challenge.tasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {isCompleted ? (
                    <Button variant="outline" className="flex-1" disabled>
                      <CheckCircle size={16} className="mr-2" />
                      Completed
                    </Button>
                  ) : challenge.completed > 0 ? (
                    <Button className="flex-1">
                      Continue Challenge
                    </Button>
                  ) : (
                    <Button className="flex-1">
                      <Play size={16} className="mr-2" />
                      Start Challenge
                    </Button>
                  )}
                  <Button variant="outline">Details</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessChallenges;
