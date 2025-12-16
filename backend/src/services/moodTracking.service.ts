import { GoogleGenerativeAI } from '@google/generative-ai';
import MoodEntry from '../models/MoodEntry';
import UserProgress from '../models/UserProgress';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

class MoodTrackingService {
  private model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp'
  });

  /**
   * Create mood entry with AI insights
   */
  async createMoodEntry(userId: string, data: any) {
    try {
      // Generate AI insights if notes provided
      let aiInsights;
      if (data.notes && data.notes.trim().length > 10) {
        aiInsights = await this.analyzeMoodNotes(data.notes, data.mood, data.emotions);
      }

      const moodEntry = new MoodEntry({
        userId,
        ...data,
        aiInsights
      });

      await moodEntry.save();

      // Update user progress
      await this.updateUserProgress(userId, moodEntry);

      // Check for concerning patterns
      await this.checkConcerningPatterns(userId);

      return moodEntry;
    } catch (error) {
      console.error('Create mood entry error:', error);
      throw new Error('Failed to create mood entry');
    }
  }

  /**
   * Analyze mood notes with AI
   */
  private async analyzeMoodNotes(
    notes: string,
    mood: string,
    emotions: string[]
  ): Promise<any> {
    try {
      const prompt = `Analyze this mood journal entry and provide insights:

Mood: ${mood}
Emotions: ${emotions.join(', ')}
Notes: "${notes}"

Provide a JSON response with:
{
  "sentiment": "positive" | "negative" | "neutral" | "concerning",
  "keywords": ["key", "themes", "mentioned"],
  "suggestions": ["helpful suggestion 1", "suggestion 2"],
  "riskLevel": "low" | "medium" | "high"
}

Focus on:
- Identifying emotional patterns
- Detecting signs of distress
- Providing supportive, actionable suggestions
- Recognizing positive aspects`;

      const result = await this.model.generateContent(prompt);
      const analysis = JSON.parse(result.response.text());

      return analysis;
    } catch (error) {
      console.error('AI mood analysis error:', error);
      return {
        sentiment: 'neutral',
        keywords: [],
        suggestions: ['Consider talking to a mental health professional for personalized support'],
        riskLevel: 'low'
      };
    }
  }

  /**
   * Get mood analytics for user
   */
  async getMoodAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await MoodEntry.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        avgMoodScore: 0,
        avgEnergy: 0,
        avgStress: 0,
        moodDistribution: {},
        emotionFrequency: {},
        activityFrequency: {},
        trend: 'insufficient_data',
        insights: []
      };
    }

    // Calculate statistics
    const totalEntries = entries.length;
    const avgMoodScore = entries.reduce((sum, e) => sum + e.moodScore, 0) / totalEntries;
    const avgEnergy = entries.reduce((sum, e) => sum + e.energy, 0) / totalEntries;
    const avgStress = entries.reduce((sum, e) => sum + e.stress, 0) / totalEntries;

    // Mood distribution
    const moodDistribution: any = {};
    entries.forEach(e => {
      moodDistribution[e.mood] = (moodDistribution[e.mood] || 0) + 1;
    });

    // Emotion frequency
    const emotionFrequency: any = {};
    entries.forEach(e => {
      e.emotions.forEach(emotion => {
        emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
      });
    });

    // Activity frequency
    const activityFrequency: any = {};
    entries.forEach(e => {
      e.activities.forEach(activity => {
        activityFrequency[activity] = (activityFrequency[activity] || 0) + 1;
      });
    });

    // Trend analysis
    const trend = this.analyzeTrend(entries);

    // Generate AI insights
    const insights = await this.generateInsights(entries, {
      avgMoodScore,
      avgEnergy,
      avgStress,
      emotionFrequency,
      activityFrequency,
      trend
    });

    return {
      totalEntries,
      avgMoodScore: Math.round(avgMoodScore * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgStress: Math.round(avgStress * 10) / 10,
      moodDistribution,
      emotionFrequency,
      activityFrequency,
      trend,
      insights,
      entries: entries.map(e => ({
        date: e.createdAt,
        mood: e.mood,
        moodScore: e.moodScore,
        energy: e.energy,
        stress: e.stress,
        emotions: e.emotions
      }))
    };
  }

  /**
   * Analyze mood trend
   */
  private analyzeTrend(entries: any[]): string {
    if (entries.length < 3) return 'insufficient_data';

    const recentScores = entries.slice(-7).map(e => e.moodScore);
    const olderScores = entries.slice(0, -7).map(e => e.moodScore);

    if (olderScores.length === 0) return 'stable';

    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    const diff = recentAvg - olderAvg;

    if (diff > 1) return 'improving';
    if (diff < -1) return 'declining';
    return 'stable';
  }

  /**
   * Generate AI insights from mood data
   */
  private async generateInsights(entries: any[], stats: any): Promise<string[]> {
    try {
      const prompt = `Analyze this mood tracking data and provide 3-5 actionable insights:

Period: Last ${entries.length} days
Average mood score: ${stats.avgMoodScore}/10
Average energy: ${stats.avgEnergy}/10
Average stress: ${stats.avgStress}/10
Trend: ${stats.trend}
Top emotions: ${Object.entries(stats.emotionFrequency)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 3)
        .map((e: any) => e[0])
        .join(', ')}
Top activities: ${Object.entries(stats.activityFrequency)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 3)
        .map((a: any) => a[0])
        .join(', ')}

Provide insights as a JSON array of strings. Each insight should be:
- Actionable and specific
- Encouraging and supportive
- Based on the data patterns
- 1-2 sentences long

Example: ["Your mood tends to improve on days with exercise - consider adding more physical activity", "You're experiencing consistent stress levels - try incorporating 10 minutes of daily meditation"]`;

      const result = await this.model.generateContent(prompt);
      const insights = JSON.parse(result.response.text());

      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('Generate insights error:', error);
      return [
        'Keep tracking your mood daily to identify patterns and triggers',
        'Consider talking to a mental health professional for personalized guidance'
      ];
    }
  }

  /**
   * Check for concerning patterns
   */
  private async checkConcerningPatterns(userId: string) {
    const recentEntries = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(7);

    // Check for consistently low mood
    const lowMoodCount = recentEntries.filter(e => e.moodScore <= 3).length;
    if (lowMoodCount >= 5) {
      // TODO: Send notification to user suggesting professional help
      // TODO: Notify care team if user has one
      console.log(`User ${userId} showing concerning mood pattern`);
    }

    // Check for high-risk entries
    const highRiskCount = recentEntries.filter(
      e => e.aiInsights?.riskLevel === 'high'
    ).length;
    if (highRiskCount >= 2) {
      console.log(`User ${userId} has multiple high-risk mood entries`);
    }
  }

  /**
   * Update user progress for mood tracking
   */
  private async updateUserProgress(userId: string, moodEntry: any) {
    const progress = await UserProgress.findOne({ userId });
    if (!progress) return;

    // Update stats
    progress.stats.totalMoodEntries++;

    // Update streak
    const moodStreak = progress.streaks.find(s => s.type === 'mood_tracking');
    if (moodStreak) {
      const daysSinceLastEntry = moodStreak.lastActivity
        ? Math.floor((Date.now() - moodStreak.lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceLastEntry === 0) {
        // Already logged today
      } else if (daysSinceLastEntry === 1) {
        // Consecutive day
        moodStreak.current++;
        moodStreak.longest = Math.max(moodStreak.longest, moodStreak.current);
      } else {
        // Streak broken
        moodStreak.current = 1;
      }
      moodStreak.lastActivity = new Date();
    } else {
      progress.streaks.push({
        type: 'mood_tracking',
        current: 1,
        longest: 1,
        lastActivity: new Date()
      });
    }

    // Award points
    progress.totalPoints += 5;
    progress.experiencePoints += 5;

    // Check for level up
    if (progress.experiencePoints >= progress.nextLevelPoints) {
      progress.level++;
      progress.experiencePoints -= progress.nextLevelPoints;
      progress.nextLevelPoints = Math.floor(progress.nextLevelPoints * 1.5);
    }

    await progress.save();
  }

  /**
   * Get mood calendar (for visualization)
   */
  async getMoodCalendar(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await MoodEntry.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    const calendar: any = {};
    entries.forEach(entry => {
      const date = entry.createdAt.toISOString().split('T')[0];
      calendar[date] = {
        mood: entry.mood,
        moodScore: entry.moodScore,
        energy: entry.energy,
        stress: entry.stress,
        emotions: entry.emotions
      };
    });

    return calendar;
  }
}

export default new MoodTrackingService();
