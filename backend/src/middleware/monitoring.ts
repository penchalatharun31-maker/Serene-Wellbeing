import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

/**
 * Request ID Middleware
 * Adds unique request ID for tracing and debugging
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

/**
 * Performance Monitoring Middleware
 * Tracks request duration and logs slow requests
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'];

  // Log request start
  logger.info(`[${requestId}] ${req.method} ${req.path} - Started`);

  // Override res.json to capture response time
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - start;

    // Add performance headers
    res.setHeader('X-Response-Time', `${duration}ms`);

    // Log completion
    logger.info(`[${requestId}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);

    // Warn on slow requests (>1000ms)
    if (duration > 1000) {
      logger.warn(`[${requestId}] SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
    }

    return originalJson.call(this, body);
  };

  next();
};

/**
 * Request Logger Middleware
 * Logs detailed request information
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];

  logger.info({
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  });

  next();
};

/**
 * Response Compression Check
 * Adds headers for compression debugging
 */
export const compressionHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'Serene-Wellbeing-Platform');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

/**
 * API Version Header
 * Adds API version to responses
 */
export const apiVersion = (version: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-API-Version', version);
    next();
  };
};

/**
 * Cache Control Headers
 * Sets appropriate cache headers for different routes
 */
export const cacheControl = (maxAge: number = 0) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (maxAge > 0) {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  };
};

/**
 * Request Size Limiter
 * Prevents large payloads from consuming resources
 */
export const requestSizeLimiter = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'];
    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      const maxSizeMB = parseInt(maxSize);

      if (sizeMB > maxSizeMB) {
        logger.warn(`Request payload too large: ${sizeMB}MB (max: ${maxSizeMB}MB)`);
        return res.status(413).json({
          success: false,
          error: 'PayloadTooLarge',
          message: `Request payload exceeds ${maxSize} limit`,
          statusCode: 413,
        });
      }
    }
    next();
  };
};

/**
 * Health Check Response Time Tracker
 * Tracks health check response times for monitoring
 */
const healthCheckTimes: number[] = [];
const MAX_HEALTH_CHECK_HISTORY = 100;

export const trackHealthCheckTime = (duration: number) => {
  healthCheckTimes.push(duration);
  if (healthCheckTimes.length > MAX_HEALTH_CHECK_HISTORY) {
    healthCheckTimes.shift();
  }
};

export const getAverageHealthCheckTime = (): number => {
  if (healthCheckTimes.length === 0) return 0;
  return healthCheckTimes.reduce((a, b) => a + b, 0) / healthCheckTimes.length;
};
