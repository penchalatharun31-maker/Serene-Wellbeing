import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * Enhanced Database Configuration
 * With connection pooling, retry logic, and monitoring
 */

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://localhost:27017/serene-wellbeing') {
      logger.warn('MongoDB URI not configured or using default localhost - attempting connection...');
    }

    // Enhanced connection options for production scalability
    const options = {
      // Connection Pool Settings
      maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
      minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 2,

      // Timeout Settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,

      // Retry Settings
      retryWrites: true,
      retryReads: true,

      // Monitoring
      maxIdleTimeMS: 300000, // Close idle connections after 5 minutes

      // Performance
      autoIndex: process.env.NODE_ENV !== 'production', // Disable in production for performance
    };

    logger.info(`Attempting MongoDB connection (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);

    const conn = await mongoose.connect(process.env.MONGODB_URI!, options);

    logger.info(`✓ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`✓ Database: ${conn.connection.name}`);
    logger.info(`✓ Connection pool size: ${options.maxPoolSize}`);

    // Monitor connection pool
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);

      // Attempt reconnection on error
      if (retryCount < MAX_RETRIES) {
        logger.warn(`Retrying connection in ${RETRY_DELAY / 1000}seconds...`);
        setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY);
      }
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected - attempting to reconnect...');

      // Auto-reconnect on disconnect
      if (retryCount < MAX_RETRIES && process.env.NODE_ENV === 'production') {
        setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY);
      }
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    // Log connection pool stats periodically (every 5 minutes in production)
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        const poolSize = mongoose.connection.db?.admin().serverStatus?.().then((status: any) => {
          logger.info('MongoDB Pool Stats:', {
            currentConnections: status.connections?.current || 'N/A',
            availableConnections: status.connections?.available || 'N/A',
          });
        }).catch(() => {
          // Silently fail if we can't get stats
        });
      }, 300000); // 5 minutes
    }

  } catch (error: any) {
    logger.error(`MongoDB connection failed (attempt ${retryCount + 1}):`, error.message);

    // Retry connection with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      logger.warn(`Retrying connection in ${delay / 1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      logger.error('Max retry attempts reached. Could not connect to MongoDB.');
      logger.warn('Server will start without database - API calls will fail');

      // Exit in production after max retries
      if (process.env.NODE_ENV === 'production') {
        logger.error('Exiting in production mode due to database connection failure');
        process.exit(1);
      }
    }
  }
};

/**
 * Close database connection gracefully
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error: any) {
    logger.error('Error closing MongoDB connection:', error.message);
    throw error;
  }
};

/**
 * Check if database is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get connection status
 */
export const getConnectionStatus = (): string => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

export default connectDB;
