import express from 'express';
import { body } from 'express-validator';
import {
  getChallenges,
  getChallenge,
  getMyChallenges,
  getChallengeStats,
  joinChallenge,
  completeTask,
} from '../controllers/challenge.controller';
import { protect, optional } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Public list
router.get('/', optional, getChallenges);

// Authenticated specific routes -- MUST come before /:id
router.get('/my', protect, getMyChallenges);
router.get('/stats', protect, getChallengeStats);

// Parameterized routes (after specific ones)
router.get('/:id', optional, getChallenge);
router.post('/:id/join', protect, joinChallenge);
router.post('/:id/complete-task', protect, validate([
  body('taskIndex').isInt({ min: 0 }).withMessage('Valid task index is required'),
]), completeTask);

export default router;
