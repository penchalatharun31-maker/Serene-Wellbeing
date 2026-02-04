import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Trophy, Target, Users, Calendar, Star, CheckCircle, Play, Loader2 } from 'lucide-react';
import apiClient from '../services/api';

export const WellnessChallenges: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, totalPoints: 0, rank: 0 });
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [challengesRes, myRes, statsRes] = await Promise.all([
          apiClient.get('/challenges'),
          apiClient.get('/challenges/my').catch(() => ({ data: { challenges: [] } })),
          apiClient.get('/challenges/stats').catch(() => ({ data: { stats: { active: 0, completed: 0, totalPoints: 0, rank: 0 } } })),
        ]);
        const allChallenges: any[] = challengesRes.data?.challenges || [];
        const myList: any[] = myRes.data?.challenges || [];

        // Merge user progress from /my into public challenge list
        const merged = allChallenges.map(ch => {
          const myEntry = myList.find((mc: any) => mc._id.toString() === ch._id.toString());
          return myEntry ? { ...ch, userProgress: myEntry.userProgress } : ch;
        });

        setChallenges(merged);
        setStats(statsRes.data?.stats || { active: 0, completed: 0, totalPoints: 0, rank: 0 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredChallenges = useMemo(() => {
    if (filter === 'active') return challenges.filter(c => c.userProgress && c.userProgress.progress < 100);
    if (filter === 'completed') return challenges.filter(c => c.userProgress && c.userProgress.progress >= 100);
    return challenges;
  }, [challenges, filter]);

  const handleJoin = async (id: string) => {
    setJoining(id);
    try {
      await apiClient.post(`/challenges/${id}/join`);
      setChallenges(prev => prev.map(c =>
        c._id === id ? { ...c, userProgress: { tasksCompleted: 0, totalTasks: c.tasks?.length || 0, progress: 0 } } : c
      ));
    } catch (e) { console.error(e); }
    finally { setJoining(null); }
  };

  const handleCompleteTask = async (id: string, tasksCompleted: number) => {
    try {
      const res = await apiClient.post(`/challenges/${id}/complete-task`, { taskIndex: tasksCompleted });
      setChallenges(prev => prev.map(c =>
        c._id === id ? { ...c, userProgress: { ...c.userProgress, tasksCompleted: (c.userProgress?.tasksCompleted || 0) + 1, progress: res.data?.progress || 0 } } : c
      ));
    } catch (e) { console.error(e); }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'emerald';
      case 'intermediate': return 'blue';
      case 'advanced': return 'purple';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

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
              <p className="text-xl font-bold text-gray-900">{stats.active}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
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
              <p className="text-xl font-bold text-gray-900">#{stats.rank}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChallenges.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No challenges found.
          </div>
        )}
        {filteredChallenges.map(challenge => {
          const totalTasks = challenge.tasks?.length || 0;
          const tasksCompleted = challenge.userProgress?.tasksCompleted || 0;
          const progress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
          const isCompleted = challenge.userProgress?.progress >= 100;
          const hasJoined = !!challenge.userProgress;

          return (
            <Card key={challenge._id} className="overflow-hidden">
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: challenge.imageUrl ? `url(${challenge.imageUrl})` : 'linear-gradient(135deg, #10B981, #059669)' }}
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
                      {(challenge.participants?.length || 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600">+{challenge.totalPoints} pts</span>
                </div>

                {hasJoined && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {tasksCompleted}/{totalTasks} tasks
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
                  ) : hasJoined ? (
                    <Button className="flex-1" onClick={() => handleCompleteTask(challenge._id, tasksCompleted)} disabled={tasksCompleted >= totalTasks}>
                      Continue Challenge
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={() => handleJoin(challenge._id)} disabled={joining === challenge._id}>
                      {joining === challenge._id ? (
                        <><Loader2 size={16} className="mr-2 animate-spin" />Joining...</>
                      ) : (
                        <><Play size={16} className="mr-2" />Start Challenge</>
                      )}
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
