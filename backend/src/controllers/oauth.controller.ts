import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Set role in session before Google OAuth
 * This is called from frontend before redirecting to Google
 */
export const setOAuthRole = (req: any, res: Response): void => {
  const { role } = req.body;

  if (role && ['user', 'expert', 'company'].includes(role)) {
    req.session.oauthRole = role;
  } else {
    req.session.oauthRole = 'user';
  }

  res.json({ success: true, message: 'Role set for OAuth' });
};

/**
 * Google OAuth callback handler
 * Called by Passport after successful Google authentication
 */
export const googleCallback = (req: any, res: Response, next: NextFunction): void => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    // Clear OAuth role from session
    if (req.session) {
      delete req.session.oauthRole;
    }

    // Redirect to frontend with token
    // Frontend will extract token from URL and store it
    const redirectUrl = `${FRONTEND_URL}/oauth-callback?token=${token}&role=${user.role}`;

    logger.info(`Google OAuth success for user: ${user.email}`);
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('Google OAuth callback error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_callback_failed`);
  }
};

/**
 * Handle OAuth failure
 */
export const googleFailure = (req: Request, res: Response): void => {
  logger.error('Google OAuth authentication failed');
  res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
};
