import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/errors';

// AuthRequest is kept as an alias for Request for backward compatibility
// with controllers that import it. req.user is already typed as IUser | undefined
// via the global Express namespace declaration in src/types/express.d.ts
export type AuthRequest = Request;

export const protect: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Get user from token
      const user = await User.findById(decoded.id).select('+password');

      if (!user) {
        throw new AppError('User no longer exists', 401);
      }

      if (!user.isActive) {
        throw new AppError('User account is deactivated', 401);
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      } else if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]): RequestHandler => {
  return (req, res, next): void => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes((req.user as IUser).role)) {
      return next(
        new AppError(
          `User role '${(req.user as IUser).role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

export const optional: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
        };
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but this is optional auth, so continue
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
