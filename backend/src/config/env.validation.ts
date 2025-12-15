import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  GEMINI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  FRONTEND_URL: string;
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private env: EnvironmentVariables;

  private constructor() {
    this.env = this.validateEnvironment();
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  private validateEnvironment(): EnvironmentVariables {
    const errors: string[] = [];

    // Required environment variables
    const requiredVars = [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI',
      'REDIS_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'GEMINI_API_KEY',
      'STRIPE_SECRET_KEY',
      'EMAIL_HOST',
      'EMAIL_PORT',
      'EMAIL_USER',
      'EMAIL_PASSWORD',
      'FRONTEND_URL',
    ];

    // Check if all required variables are present
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Environment validation failed:\n${errors.join('\n')}`
      );
    }

    // Validate specific formats
    this.validateJWTSecrets();
    this.validateNodeEnv();
    this.validateURLs();

    return {
      NODE_ENV: process.env.NODE_ENV!,
      PORT: parseInt(process.env.PORT!, 10),
      MONGODB_URI: process.env.MONGODB_URI!,
      REDIS_URL: process.env.REDIS_URL!,
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
      EMAIL_HOST: process.env.EMAIL_HOST!,
      EMAIL_PORT: parseInt(process.env.EMAIL_PORT!, 10),
      EMAIL_USER: process.env.EMAIL_USER!,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
      FRONTEND_URL: process.env.FRONTEND_URL!,
    };
  }

  private validateJWTSecrets(): void {
    const jwtSecret = process.env.JWT_SECRET || '';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';

    if (jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    if (jwtRefreshSecret.length < 32) {
      throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }

    // In production, ensure secrets are not default values
    if (process.env.NODE_ENV === 'production') {
      const dangerousPatterns = ['dev', 'test', 'example', 'changeme', 'default'];

      for (const pattern of dangerousPatterns) {
        if (jwtSecret.toLowerCase().includes(pattern)) {
          throw new Error(
            `JWT_SECRET contains dangerous pattern: "${pattern}". Use a secure random string in production.`
          );
        }
        if (jwtRefreshSecret.toLowerCase().includes(pattern)) {
          throw new Error(
            `JWT_REFRESH_SECRET contains dangerous pattern: "${pattern}". Use a secure random string in production.`
          );
        }
      }
    }
  }

  private validateNodeEnv(): void {
    const validEnvs = ['development', 'production', 'test', 'staging'];
    const nodeEnv = process.env.NODE_ENV || '';

    if (!validEnvs.includes(nodeEnv)) {
      throw new Error(
        `Invalid NODE_ENV: "${nodeEnv}". Must be one of: ${validEnvs.join(', ')}`
      );
    }
  }

  private validateURLs(): void {
    const frontendUrl = process.env.FRONTEND_URL || '';

    try {
      new URL(frontendUrl);
    } catch {
      throw new Error(`Invalid FRONTEND_URL: "${frontendUrl}". Must be a valid URL.`);
    }

    // In production, ensure HTTPS is used
    if (process.env.NODE_ENV === 'production') {
      if (!frontendUrl.startsWith('https://')) {
        console.warn(
          '⚠️  WARNING: FRONTEND_URL should use HTTPS in production'
        );
      }
    }
  }

  public getEnv(): EnvironmentVariables {
    return this.env;
  }

  public isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  public isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  public isTest(): boolean {
    return this.env.NODE_ENV === 'test';
  }
}

export const envValidator = EnvironmentValidator.getInstance();
export const env = envValidator.getEnv();
