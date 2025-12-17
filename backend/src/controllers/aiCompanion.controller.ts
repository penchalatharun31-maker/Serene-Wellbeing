import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import aiCompanionService from '../services/aiCompanion.service';

/**
 * Start or continue chat with AI companion
 */
export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const result = await aiCompanionService.chat(userId, message, sessionId);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat message'
    });
  }
};

/**
 * Get conversation history
 */
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const conversations = await aiCompanionService.getConversationHistory(userId, limit);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve conversations'
    });
  }
};

/**
 * End conversation
 */
export const endConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const conversation = await aiCompanionService.endConversation(sessionId);

    res.json({
      success: true,
      data: conversation,
      message: 'Conversation ended successfully'
    });
  } catch (error: any) {
    console.error('End conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to end conversation'
    });
  }
};
