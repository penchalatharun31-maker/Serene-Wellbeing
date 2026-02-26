import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getRedisClient } from '../config/redis';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      csrfToken?: string;
    }
  }
}

const CSRF_TOKEN_PREFIX = 'csrf:';
const CSRF_TOKEN_EXPIRY = 60 * 60; // 1 hour in seconds

/**
 * Generate a CSRF token for the current session
 */
export const generateCsrfToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get session identifier (use user ID if authenticated, or create session ID)
    const sessionId = (req as any).user?._id?.toString() || req.headers['x-session-id'] as string || crypto.randomUUID();

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Store in Redis with 1 hour expiration
    const redis = getRedisClient();
    await redis.setEx(`${CSRF_TOKEN_PREFIX}${sessionId}`, CSRF_TOKEN_EXPIRY, token);

    // Attach to request and response
    req.csrfToken = token;
    res.setHeader('X-CSRF-Token', token);
    res.setHeader('X-Session-Id', sessionId);

    next();
  } catch (error) {
    logger.error('Failed to generate CSRF token:', error);
    next(error);
  }
};

/**
 * Verify CSRF token for state-changing operations (POST, PUT, DELETE, PATCH)
 */
export const verifyCsrfToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Skip verification for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Get token from header or body
    const token = req.headers['x-csrf-token'] as string || req.body?._csrf;
    const sessionId = (req as any).user?._id?.toString() || req.headers['x-session-id'] as string;

    if (!token || !sessionId) {
      res.status(403).json({
        success: false,
        message: 'CSRF token missing'
      });
      return;
    }

    // Verify token from Redis
    const redis = getRedisClient();
    const storedToken = await redis.get(`${CSRF_TOKEN_PREFIX}${sessionId}`);

    if (!storedToken || storedToken !== token) {
      res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Failed to verify CSRF token:', error);
    res.status(500).json({
      success: false,
      message: 'CSRF verification failed'
    });
  }
};

/**
 * Middleware to attach CSRF token to all responses
 */
export const attachCsrfToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionId = (req as any).user?._id?.toString() || req.headers['x-session-id'] as string;

    if (sessionId) {
      const redis = getRedisClient();
      const storedToken = await redis.get(`${CSRF_TOKEN_PREFIX}${sessionId}`);

      if (storedToken) {
        res.setHeader('X-CSRF-Token', storedToken);
      }
    }

    next();
  } catch (error) {
    logger.error('Failed to attach CSRF token:', error);
    // Don't fail the request if CSRF attachment fails
    next();
  }
};
