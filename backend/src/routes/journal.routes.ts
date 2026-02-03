import express from 'express';
import { body } from 'express-validator';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  toggleFavorite,
} from '../controllers/journal.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

const createEntryValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10000 characters'),
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('mood')
    .optional()
    .isIn(['excellent', 'good', 'okay', 'bad', 'terrible'])
    .withMessage('Invalid mood value'),
  body('emotions')
    .optional()
    .isArray()
    .withMessage('Emotions must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

// All routes require authentication
router.use(protect);

router.post('/', validate(createEntryValidation), createJournalEntry);
router.get('/', getJournalEntries);
router.get('/:id', getJournalEntry);
router.put('/:id/favorite', toggleFavorite);
router.put('/:id', validate(createEntryValidation), updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;
