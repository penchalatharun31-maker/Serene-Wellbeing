import express, { Application } from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/database';
import logger from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/validation';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSocket } from './sockets/socket';
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

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const server = http.createServer(app);

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
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

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

// Health check endpoint
app.get(`/api/${API_VERSION}/health`, (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

export { io };
export default app;
