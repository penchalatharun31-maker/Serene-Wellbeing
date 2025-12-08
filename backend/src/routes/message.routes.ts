import express from 'express';
import { body } from 'express-validator';
import {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} from '../controllers/message.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { messageLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const sendMessageValidation = [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  body('type').optional().isIn(['text', 'image', 'file']).withMessage('Invalid message type'),
];

// Protected routes
router.use(protect);

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:userId', getMessages);
router.post('/', messageLimiter, validate(sendMessageValidation), sendMessage);
router.post('/mark-read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;
