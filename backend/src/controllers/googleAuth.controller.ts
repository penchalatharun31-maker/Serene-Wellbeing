/**
 * GOOGLE OAUTH 2.0 AUTHENTICATION
 *
 * Implements Google Sign-In for B2C users, experts, and companies
 * Uses Google OAuth 2.0 Web Server Flow
 *
 * Setup Instructions:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID (Web application)
 * 3. Add authorized redirect URIs:
 *    - http://localhost:5000/api/v1/auth/google/callback (development)
 *    - https://your-backend.railway.app/api/v1/auth/google/callback (production)
 * 4. Add environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

/**
 * Generate authentication URL for Google OAuth
 * Frontend redirects user to this URL to initiate OAuth flow
 */
export const getGoogleAuthUrl = (req: Request, res: Response): void => {
  const { role = 'user' } = req.query;

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback';

  if (!googleClientId) {
    throw new AppError('Google OAuth not configured', 500);
  }

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    prompt: 'consent',
    state: JSON.stringify({ role }) // Pass role through state parameter
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  res.json({
    success: true,
    authUrl
  });
};

/**
 * Handle Google OAuth callback
 * Exchange authorization code for access token, get user info, create/login user
 */
export const handleGoogleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = req.query;

    if (!code) {
      throw new AppError('Authorization code missing', 400);
    }

    // Parse state to get role
    let role = 'user';
    try {
      const stateData = state ? JSON.parse(state as string) : {};
      role = stateData.role || 'user';
    } catch (e) {
      logger.warn('Failed to parse OAuth state, defaulting to user role');
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback';

    if (!googleClientId || !googleClientSecret) {
      throw new AppError('Google OAuth not configured', 500);
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const googleUser = userInfoResponse.data;

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // Existing user - login
      logger.info(`Google OAuth login: ${user.email}`);
    } else {
      // New user - register
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        role: role,
        emailVerified: googleUser.verified_email || true,
        avatar: googleUser.picture,
        googleId: googleUser.id,
        // No password needed for OAuth users
        password: Math.random().toString(36).slice(-16), // Random password (won't be used)
        isActive: role === 'expert' ? false : true, // Experts need approval
      });

      logger.info(`Google OAuth registration: ${user.email} (${role})`);
    }

    // Generate JWT tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/#/auth/google/callback?token=${token}&refreshToken=${refreshToken}&role=${user.role}`;

    res.redirect(redirectUrl);
  } catch (error: any) {
    logger.error('Google OAuth callback error:', error);

    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const errorMessage = error.message || 'Google authentication failed';
    res.redirect(`${frontendUrl}/#/login?error=${encodeURIComponent(errorMessage)}`);
  }
};

/**
 * Direct Google token verification (for frontend that already has Google ID token)
 * Alternative flow where frontend handles Google Sign-In directly
 */
export const verifyGoogleToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idToken, role = 'user' } = req.body;

    if (!idToken) {
      throw new AppError('Google ID token required', 400);
    }

    // Verify token with Google
    const ticket = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const googleUser = ticket.data;

    // Validate token
    if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new AppError('Invalid token', 401);
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // Existing user - login
      logger.info(`Google token login: ${user.email}`);
    } else {
      // New user - register
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        role: role,
        emailVerified: googleUser.email_verified || true,
        avatar: googleUser.picture,
        googleId: googleUser.sub,
        password: Math.random().toString(36).slice(-16),
        isActive: role === 'expert' ? false : true,
      });

      logger.info(`Google token registration: ${user.email} (${role})`);
    }

    // Generate JWT tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        credits: user.credits,
        emailVerified: user.emailVerified,
      }
    });
  } catch (error: any) {
    logger.error('Google token verification error:', error);
    next(new AppError(error.message || 'Google authentication failed', 401));
  }
};
