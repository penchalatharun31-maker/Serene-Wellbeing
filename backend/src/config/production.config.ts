import { env } from './env.validation';

export const productionConfig = {
  // Server Configuration
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
    corsOrigin: env.FRONTEND_URL,
    trustProxy: true, // Enable when behind a proxy (Nginx, Load Balancer)
  },

  // Database Configuration
  database: {
    uri: env.MONGODB_URI,
    options: {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
    },
  },

  // Redis Configuration
  redis: {
    url: env.REDIS_URL,
    options: {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: true,
      connectTimeout: 10000,
    },
  },

  // JWT Configuration
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    algorithm: 'HS256' as const,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  },

  // File Upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    uploadPath: './uploads',
  },

  // Email Configuration
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'Serene Wellbeing <noreply@serene-wellbeing.com>',
  },

  // Socket.IO Configuration
  socketIO: {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6, // 1MB
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    },
    cookieOptions: {
      httpOnly: true,
      secure: true, // Requires HTTPS
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/production.log',
    maxSize: '20m',
    maxFiles: '14d',
    format: 'json',
  },

  // Cron Jobs
  cron: {
    enabled: process.env.ENABLE_CRON_JOBS !== 'false',
    timezone: 'UTC',
  },

  // External Services
  services: {
    gemini: {
      apiKey: env.GEMINI_API_KEY,
      model: 'gemini-2.0-flash-exp',
      maxTokens: 8192,
      temperature: 0.7,
    },
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      apiVersion: '2023-10-16' as const,
    },
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'Serene Wellbeing Hub',
    version: process.env.APP_VERSION || '1.0.0',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@serene-wellbeing.com',
    frontendUrl: env.FRONTEND_URL,
  },
};
