import express from 'express';
import * as aiCompanionController from '../controllers/aiCompanion.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/ai-companion/chat
 * @desc    Send message to AI companion
 * @access  Private
 */
router.post('/chat', aiCompanionController.chat);

/**
 * @route   GET /api/v1/ai-companion/conversations
 * @desc    Get conversation history
 * @access  Private
 */
router.get('/conversations', aiCompanionController.getConversations);

/**
 * @route   POST /api/v1/ai-companion/conversations/:sessionId/end
 * @desc    End a conversation
 * @access  Private
 */
router.post('/conversations/:sessionId/end', aiCompanionController.endConversation);

export default router;
