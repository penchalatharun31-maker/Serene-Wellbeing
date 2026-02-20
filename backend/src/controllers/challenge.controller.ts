import { Response, NextFunction } from 'express';
import WellnessChallenge from '../models/WellnessChallenge';
import UserProgress from '../models/UserProgress';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';

// GET /challenges - list all public active challenges
export const getChallenges = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, difficulty, page = '1', limit = '20' } = req.query;
    const query: any = { isPublic: true, isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const challenges = await WellnessChallenge.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    const total = await WellnessChallenge.countDocuments(query);

    res.status(200).json({
      success: true,
      challenges,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /challenges/:id - get single challenge
export const getChallenge = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const challenge = await WellnessChallenge.findById(req.params.id);
    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    res.status(200).json({ success: true, challenge });
  } catch (error) {
    next(error);
  }
};

// GET /challenges/my - user's active + completed challenges with progress
export const getMyChallenges = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { filter } = req.query; // 'active' | 'completed' | 'all'

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user!._id });
    }

    const activeChallenges = progress.activeChallenges || [];
    const challengeIds = activeChallenges.map((c: any) => c.challengeId);

    const challenges = await WellnessChallenge.find({ _id: { $in: challengeIds } });

    const enriched = challenges.map((ch: any) => {
      const userChallenge = activeChallenges.find((ac: any) => ac.challengeId.toString() === ch._id.toString());
      return {
        ...ch.toObject(),
        userProgress: {
          tasksCompleted: userChallenge?.tasksCompleted || 0,
          totalTasks: ch.tasks?.length || 0,
          pointsEarned: userChallenge?.pointsEarned || 0,
          progress: userChallenge?.progress || 0,
        },
      };
    });

    let result = enriched;
    if (filter === 'active') result = enriched.filter((c: any) => c.userProgress.progress < 100);
    if (filter === 'completed') result = enriched.filter((c: any) => c.userProgress.progress >= 100);

    res.status(200).json({ success: true, challenges: result });
  } catch (error) {
    next(error);
  }
};

// GET /challenges/stats - user's challenge stats
export const getChallengeStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user!._id });
    }

    const activeChallenges = progress.activeChallenges || [];
    const active = activeChallenges.filter((c: any) => c.progress < 100).length;
    const completed = activeChallenges.filter((c: any) => c.progress >= 100).length;
    const totalPoints = progress.totalPoints || 0;

    // Simple rank: count users with more points
    const rank = await UserProgress.countDocuments({ totalPoints: { $gt: totalPoints } });

    res.status(200).json({
      success: true,
      stats: { active, completed, totalPoints, rank: rank + 1 },
    });
  } catch (error) {
    next(error);
  }
};

// POST /challenges/:id/join - join a challenge
export const joinChallenge = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const challenge = await WellnessChallenge.findById(req.params.id);
    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user!._id });
    }

    const alreadyJoined = progress.activeChallenges.find(
      (c: any) => c.challengeId.toString() === challenge._id.toString()
    );
    if (alreadyJoined) {
      res.status(200).json({ success: true, message: 'Already joined', challenge: alreadyJoined });
      return;
    }

    progress.activeChallenges.push({
      challengeId: challenge._id,
      joinedAt: new Date(),
      progress: 0,
      pointsEarned: 0,
      tasksCompleted: 0,
      totalTasks: challenge.tasks?.length || 0,
    });
    await progress.save();

    // Add user to challenge participants
    if (!challenge.participants.includes(req.user!._id)) {
      challenge.participants.push(req.user!._id);
      await challenge.save();
    }

    res.status(201).json({ success: true, message: 'Joined challenge' });
  } catch (error) {
    next(error);
  }
};

// POST /challenges/:id/complete-task - complete a task in a challenge
export const completeTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskIndex } = req.body;
    const challenge = await WellnessChallenge.findById(req.params.id);
    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    if (taskIndex === undefined || taskIndex < 0 || taskIndex >= (challenge.tasks?.length || 0)) {
      throw new AppError('Invalid task index', 400);
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      throw new AppError('Not enrolled in this challenge', 400);
    }

    const userChallenge = progress.activeChallenges.find(
      (c: any) => c.challengeId.toString() === challenge._id.toString()
    );
    if (!userChallenge) {
      throw new AppError('Not enrolled in this challenge', 400);
    }

    const task = challenge.tasks[taskIndex];
    const taskPoints = task.points || 10;

    userChallenge.tasksCompleted = (userChallenge.tasksCompleted || 0) + 1;
    userChallenge.pointsEarned = (userChallenge.pointsEarned || 0) + taskPoints;
    userChallenge.progress = Math.round((userChallenge.tasksCompleted / (challenge.tasks?.length || 1)) * 100);

    progress.totalPoints = (progress.totalPoints || 0) + taskPoints;
    if (userChallenge.progress >= 100) {
      progress.stats.totalChallengesCompleted = (progress.stats.totalChallengesCompleted || 0) + 1;
    }
    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Task completed',
      progress: userChallenge.progress,
      pointsEarned: userChallenge.pointsEarned,
    });
  } catch (error) {
    next(error);
  }
};
