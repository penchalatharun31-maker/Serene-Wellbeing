import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/errors';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().map((err: any) =>
      extractedErrors.push({
        field: err.path || err.param,
        message: err.msg,
      })
    );

    const error = new AppError('Validation failed', 400);
    (error as any).errors = extractedErrors;
    next(error);
  };
};

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Remove any null bytes
  const sanitizeObj = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/\0/g, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObj);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObj(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitizeObj(req.body);
  req.query = sanitizeObj(req.query);
  req.params = sanitizeObj(req.params);

  next();
};
