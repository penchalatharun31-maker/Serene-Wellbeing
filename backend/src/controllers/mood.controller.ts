import { Request, Response } from 'express';
import moodTrackingService from '../services/moodTracking.service';
import MoodEntry from '../models/MoodEntry';

/**
 * Create mood entry
 */
export const createMoodEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const moodData = req.body;

    // Validation
    if (!moodData.mood || !moodData.moodScore) {
      return res.status(400).json({
        success: false,
        message: 'Mood and mood score are required'
      });
    }

    const entry = await moodTrackingService.createMoodEntry(userId, moodData);

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Mood entry created successfully'
    });
  } catch (error: any) {
    console.error('Create mood entry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create mood entry'
    });
  }
};

/**
 * Get mood analytics
 */
export const getMoodAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const days = parseInt(req.query.days as string) || 30;

    const analytics = await moodTrackingService.getMoodAnalytics(userId, days);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve mood analytics'
    });
  }
};

/**
 * Get mood calendar
 */
export const getMoodCalendar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

    const calendar = await moodTrackingService.getMoodCalendar(userId, year, month);

    res.json({
      success: true,
      data: calendar
    });
  } catch (error: any) {
    console.error('Get mood calendar error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve mood calendar'
    });
  }
};

/**
 * Get recent mood entries
 */
export const getRecentMoods = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const entries = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: entries
    });
  } catch (error: any) {
    console.error('Get recent moods error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve mood entries'
    });
  }
};

/**
 * Update mood entry
 */
export const updateMoodEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    const entry = await MoodEntry.findOne({ _id: id, userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    Object.assign(entry, updates);
    await entry.save();

    res.json({
      success: true,
      data: entry,
      message: 'Mood entry updated successfully'
    });
  } catch (error: any) {
    console.error('Update mood entry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update mood entry'
    });
  }
};

/**
 * Delete mood entry
 */
export const deleteMoodEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const entry = await MoodEntry.findOneAndDelete({ _id: id, userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete mood entry'
    });
  }
};
