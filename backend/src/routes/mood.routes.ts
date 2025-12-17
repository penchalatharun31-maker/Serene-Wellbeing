import express from 'express';
import * as moodController from '../controllers/mood.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/v1/mood
 * @desc    Create mood entry
 * @access  Private
 */
router.post('/', moodController.createMoodEntry);

/**
 * @route   GET /api/v1/mood/analytics
 * @desc    Get mood analytics
 * @access  Private
 */
router.get('/analytics', moodController.getMoodAnalytics);

/**
 * @route   GET /api/v1/mood/calendar
 * @desc    Get mood calendar
 * @access  Private
 */
router.get('/calendar', moodController.getMoodCalendar);

/**
 * @route   GET /api/v1/mood/recent
 * @desc    Get recent mood entries
 * @access  Private
 */
router.get('/recent', moodController.getRecentMoods);

/**
 * @route   PUT /api/v1/mood/:id
 * @desc    Update mood entry
 * @access  Private
 */
router.put('/:id', moodController.updateMoodEntry);

/**
 * @route   DELETE /api/v1/mood/:id
 * @desc    Delete mood entry
 * @access  Private
 */
router.delete('/:id', moodController.deleteMoodEntry);

export default router;
