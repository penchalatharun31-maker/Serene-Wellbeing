import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      csrfToken?: string;
    }
  }
}

// In-memory store for CSRF tokens (use Redis in production)
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expiresAt < now) {
      csrfTokens.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);

/**
 * Generate a CSRF token for the current session
 */
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get session identifier (use user ID if authenticated, or create session ID)
  const sessionId = (req as any).user?._id?.toString() || req.headers['x-session-id'] as string || crypto.randomUUID();

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');

  // Store with 1 hour expiration
  csrfTokens.set(sessionId, {
    token,
    expiresAt: Date.now() + 60 * 60 * 1000
  });

  // Attach to request and response
  req.csrfToken = token;
  res.setHeader('X-CSRF-Token', token);
  res.setHeader('X-Session-Id', sessionId);

  next();
};

/**
 * Verify CSRF token for state-changing operations (POST, PUT, DELETE, PATCH)
 */
export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
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

  // Verify token
  const stored = csrfTokens.get(sessionId);

  if (!stored || stored.token !== token) {
    res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
    return;
  }

  // Check expiration
  if (stored.expiresAt < Date.now()) {
    csrfTokens.delete(sessionId);
    res.status(403).json({
      success: false,
      message: 'CSRF token expired'
    });
    return;
  }

  next();
};

/**
 * Middleware to attach CSRF token to all responses
 */
export const attachCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  const sessionId = (req as any).user?._id?.toString() || req.headers['x-session-id'] as string;

  if (sessionId) {
    const stored = csrfTokens.get(sessionId);
    if (stored && stored.expiresAt > Date.now()) {
      res.setHeader('X-CSRF-Token', stored.token);
    }
  }

  next();
};
