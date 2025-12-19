import { Server } from 'http';
import mongoose from 'mongoose';
import logger from './logger';

/**
 * Graceful Shutdown Handler
 * Ensures clean shutdown without losing requests or data
 */
export class GracefulShutdown {
  private server: Server | null = null;
  private isShuttingDown = false;
  private shutdownTimeout = 30000; // 30 seconds

  constructor(server?: Server) {
    if (server) {
      this.server = server;
    }
  }

  /**
   * Set the HTTP server instance
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Set shutdown timeout
   */
  setTimeout(timeout: number) {
    this.shutdownTimeout = timeout;
  }

  /**
   * Initialize shutdown handlers
   */
  init() {
    // Handle various shutdown signals
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGUSR2', () => this.shutdown('SIGUSR2')); // nodemon restart

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit on unhandled rejection in production (log and continue)
      if (process.env.NODE_ENV === 'development') {
        this.shutdown('unhandledRejection');
      }
    });

    logger.info('Graceful shutdown handlers initialized');
  }

  /**
   * Perform graceful shutdown
   */
  private async shutdown(signal: string) {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    logger.info(`\n${signal} received: Starting graceful shutdown...`);

    // Set a timeout to force shutdown if graceful shutdown takes too long
    const forceShutdownTimer = setTimeout(() => {
      logger.error(`Graceful shutdown timeout (${this.shutdownTimeout}ms) - forcing shutdown`);
      process.exit(1);
    }, this.shutdownTimeout);

    try {
      // Step 1: Stop accepting new connections
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          logger.info('Closing HTTP server...');
          this.server!.close((err) => {
            if (err) {
              logger.error('Error closing HTTP server:', err);
              reject(err);
            } else {
              logger.info('✓ HTTP server closed');
              resolve();
            }
          });
        });
      }

      // Step 2: Close database connections
      if (mongoose.connection.readyState !== 0) {
        logger.info('Closing database connections...');
        await mongoose.connection.close();
        logger.info('✓ Database connections closed');
      }

      // Step 3: Close any other resources (Redis, message queues, etc.)
      // Add your cleanup code here

      // Step 4: Clear the force shutdown timer
      clearTimeout(forceShutdownTimer);

      logger.info('✓ Graceful shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }
  }

  /**
   * Check if shutdown is in progress
   */
  isShutdownInProgress(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Middleware to reject requests during shutdown
   */
  middleware() {
    return (req: any, res: any, next: any) => {
      if (this.isShuttingDown) {
        res.set('Connection', 'close');
        res.status(503).json({
          success: false,
          error: 'ServiceUnavailable',
          message: 'Server is shutting down, please try again later',
          statusCode: 503,
        });
      } else {
        next();
      }
    };
  }
}

// Export singleton instance
export const gracefulShutdown = new GracefulShutdown();
