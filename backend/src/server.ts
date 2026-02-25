import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import connectDB from './config/database';
import passport from './config/passport';
import logger from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/validation';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSocket } from './sockets/socket';
import { gracefulShutdown } from './utils/gracefulShutdown';
import { env, envValidator } from './config/env.validation';
import { productionConfig } from './config/production.config';
import './services/cronJobs';

// Import routes
import authRoutes from './routes/auth.routes';
import expertRoutes from './routes/expert.routes';
import sessionRoutes from './routes/session.routes';
import paymentRoutes from './routes/payment.routes';
import payoutRoutes from './routes/payout.routes';
import messageRoutes from './routes/message.routes';
import adminRoutes from './routes/admin.routes';
import analyticsRoutes from './routes/analytics.routes';
import resourceRoutes from './routes/resource.routes';
import groupSessionRoutes from './routes/groupSession.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import aiCompanionRoutes from './routes/aiCompanion.routes';
import moodRoutes from './routes/mood.routes';
import blogRoutes from './routes/blog.routes';
import pricingRoutes from './routes/pricing.routes';
import companyRoutes from './routes/company.routes';
import journalRoutes from './routes/journal.routes';
import challengeRoutes from './routes/challenge.routes';
import contentRoutes from './routes/content.routes';

// Import health controller
import { healthCheck, livenessProbe, readinessProbe } from './controllers/health.controller';

// Load environment variables
dotenv.config();

// Validate environment variables explicitly at startup
logger.info('Validating environment variables...');
try {
  envValidator.validate();
  logger.info(`✓ Environment validated successfully`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Port: ${env.PORT}`);
} catch (error: any) {
  logger.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

// Create Express app
const app: Application = express();
const server = http.createServer(app);

// Trust proxy for production (required for rate limiting and security)
if (envValidator.isProduction()) {
  app.set('trust proxy', 1);
  logger.info('Trust proxy enabled for production');
}

// Request ID middleware for tracking requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  (req as any).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Initialize Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.IO handlers
setupSocket(io);

// Make io accessible to routes
app.set('io', io);

// Connect to database
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: envValidator.isProduction()
      ? productionConfig.security.helmet.contentSecurityPolicy
      : false,
    hsts: envValidator.isProduction()
      ? productionConfig.security.helmet.hsts
      : false,
  })
);

// CORS configuration
const corsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID', 'X-Session-Id'],
};

// Explicit preflight handler — must come before all other middleware
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware (required for OAuth)
const sessionConfig: session.SessionOptions = {
  secret: env.JWT_SECRET, // Use validated JWT secret
  resave: false,
  saveUninitialized: false,
  name: 'serene.sid', // Custom session cookie name
  cookie: {
    secure: envValidator.isProduction(),
    httpOnly: true,
    // 'none' required for cross-origin requests (frontend & backend on different Railway domains)
    // 'none' must be paired with secure: true (enforced in production above)
    sameSite: envValidator.isProduction() ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Use MongoDB session store in production
if (envValidator.isProduction()) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    touchAfter: 24 * 3600, // Lazy session update
    crypto: {
      secret: env.JWT_SECRET,
    },
  });
  logger.info('Using MongoDB session store for production');
} else {
  logger.warn('⚠️  Using memory session store (development only)');
}

app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Compression middleware
app.use(compression());

// Sanitize input
app.use(sanitizeInput);

// Rate limiting
app.use('/api', apiLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Serene Wellbeing API',
    version: API_VERSION,
    docs: `/api/${API_VERSION}/docs`,
  });
});

app.get(`/api/${API_VERSION}`, (_req, res) => {
  res.json({
    success: true,
    message: 'Serene Wellbeing API is running',
    version: API_VERSION,
  });
});

// Mount routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/experts`, expertRoutes);
app.use(`/api/${API_VERSION}/sessions`, sessionRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/payouts`, payoutRoutes);
app.use(`/api/${API_VERSION}/messages`, messageRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/resources`, resourceRoutes);
app.use(`/api/${API_VERSION}/group-sessions`, groupSessionRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}/ai-companion`, aiCompanionRoutes);
app.use(`/api/${API_VERSION}/mood`, moodRoutes);
app.use(`/api/${API_VERSION}/blog`, blogRoutes);
app.use(`/api/${API_VERSION}/pricing`, pricingRoutes);
app.use(`/api/${API_VERSION}/company`, companyRoutes);
app.use(`/api/${API_VERSION}/journal`, journalRoutes);
app.use(`/api/${API_VERSION}/challenges`, challengeRoutes);
app.use(`/api/${API_VERSION}/content`, contentRoutes);

// Health check endpoints
app.get(`/api/${API_VERSION}/health`, healthCheck);
app.get(`/api/${API_VERSION}/health/live`, livenessProbe);
app.get(`/api/${API_VERSION}/health/ready`, readinessProbe);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = env.PORT;

server.listen(PORT, () => {
  logger.info('='.repeat(60));
  logger.info(`🚀 Serene Wellbeing API v${productionConfig.app.version}`);
  logger.info(`📍 Environment: ${env.NODE_ENV}`);
  logger.info(`🌐 Server running on port ${PORT}`);
  logger.info(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
  logger.info(`💚 Health check: http://localhost:${PORT}/api/v1/health`);
  logger.info('='.repeat(60));
});

// Initialize graceful shutdown
gracefulShutdown.setServer(server);
gracefulShutdown.init();

// Add graceful shutdown middleware
app.use(gracefulShutdown.middleware());

export { io };
export default app;
