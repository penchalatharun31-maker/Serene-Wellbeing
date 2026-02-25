import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Expert from '../models/Expert';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { sendTokenResponse } from '../utils/jwt';
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../utils/email';
import logger from '../utils/logger';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, phone, dateOfBirth, country, currency, hourlyRate } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone,
      dateOfBirth,
      country: country || 'India',
      currency: currency || 'INR',
    });

    // If role is expert, create expert profile
    if (role === 'expert') {
      await Expert.create({
        userId: user._id,
        title: 'Wellness Expert',
        specialization: [],
        bio: '',
        experience: 0,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 100, // Use provided rate or default
        currency: currency || 'INR',
        country: country || 'India',
        isApproved: false,
        approvalStatus: 'pending',
      });
    }

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      logger.error('Welcome email failed:', err)
    );

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Check for user (include password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear both old and new cookie names for compatibility
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      path: '/',
    };

    res
      .cookie('accessToken', 'none', cookieOptions)
      .cookie('refreshToken', 'none', cookieOptions)
      .cookie('token', 'none', cookieOptions) // Clear old cookie name too
      .status(200)
      .json({
        success: true,
        message: 'Logged out successfully',
      });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If user is an expert, include expert profile
    let expertProfile = null;
    if (user.role === 'expert') {
      expertProfile = await Expert.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      expertProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fieldsToUpdate: any = {
      name: req.body.name,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      avatar: req.body.avatar,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user!._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(
        'Please provide current password and new password',
        400
      );
    }

    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not
      res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link has been sent',
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new AppError('Email could not be sent', 500);
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError('Please provide token and new password', 400);
    }

    // Hash the token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;

    // In a real implementation, you'd validate the token
    // For now, we'll just mark the user as verified

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { notifications, emailUpdates, language } = req.body;

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (notifications !== undefined) {
      user.preferences.notifications = notifications;
    }
    if (emailUpdates !== undefined) {
      user.preferences.emailUpdates = emailUpdates;
    }
    if (language) {
      user.preferences.language = language;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    // Verify refresh token
    const { verifyRefreshToken, generateToken } = await import('../utils/jwt');
    const decoded = verifyRefreshToken(refreshToken);

    // Get user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    // Generate new access token
    const newAccessToken = generateToken({ id: user._id, role: user.role });

    // Set new access token cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      path: '/',
    };

    res
      .cookie('accessToken', newAccessToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: 'Token refreshed successfully',
      });
  } catch (error) {
    next(error);
  }
};
