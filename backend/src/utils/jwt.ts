import jwt from 'jsonwebtoken';
import { Response } from 'express';

export interface TokenPayload {
  id: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  // @ts-expect-error - jsonwebtoken types have issues with expiresIn string
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key-change-in-production';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  // @ts-expect-error - jsonwebtoken types have issues with expiresIn string
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key-change-in-production';
  return jwt.verify(token, secret) as TokenPayload;
};

export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  // Create token
  const token = generateToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Cookie options for access token
  const accessTokenCookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
    path: '/',
  };

  // Cookie options for refresh token
  const refreshTokenCookieOptions = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
    path: '/',
  };

  // Set cookies - ONLY send tokens via httpOnly cookies, not in response body
  res
    .status(statusCode)
    .cookie('accessToken', token, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        credits: user.credits,
        isVerified: user.isVerified,
      },
    });
};
