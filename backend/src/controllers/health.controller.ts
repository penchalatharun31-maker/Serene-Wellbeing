import { Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';
import { getAverageHealthCheckTime } from '../middleware/monitoring';

/**
 * Enhanced Health Check Endpoint
 * Provides detailed system health metrics
 */
export const healthCheck = async (req: Request, res: Response) => {
  const start = Date.now();

  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const isDbHealthy = dbStatus === 1; // 1 = connected

    // Get system metrics
    const systemMetrics = {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        usedPercentage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%',
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        loadAverage: os.loadavg(),
      },
    };

    // Get process metrics
    const processMetrics = {
      pid: process.pid,
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss,
      },
      cpuUsage: process.cpuUsage(),
    };

    // Get database metrics (if connected)
    let dbMetrics = {};
    if (isDbHealthy && mongoose.connection.db) {
      try {
        const adminDb = mongoose.connection.db.admin();
        const serverStatus = await adminDb.serverStatus();

        dbMetrics = {
          connections: serverStatus.connections,
          operations: {
            insert: serverStatus.opcounters.insert,
            query: serverStatus.opcounters.query,
            update: serverStatus.opcounters.update,
            delete: serverStatus.opcounters.delete,
          },
          network: {
            bytesIn: serverStatus.network.bytesIn,
            bytesOut: serverStatus.network.bytesOut,
            requests: serverStatus.network.numRequests,
          },
        };
      } catch (error) {
        // If we can't get detailed metrics, just note database is connected
        dbMetrics = { status: 'connected', details: 'limited' };
      }
    }

    const duration = Date.now() - start;
    const avgResponseTime = getAverageHealthCheckTime();

    // Determine overall health status
    const isHealthy = isDbHealthy && systemMetrics.memory.used / systemMetrics.memory.total < 0.9;

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      responseTime: `${duration}ms`,
      avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStates[dbStatus],
          healthy: isDbHealthy,
          type: 'MongoDB',
          metrics: dbMetrics,
        },
        server: {
          status: 'running',
          healthy: true,
        },
      },
      system: systemMetrics,
      process: processMetrics,
    });
  } catch (error: any) {
    const duration = Date.now() - start;

    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`,
      error: error.message,
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  }
};

/**
 * Simple Liveness Probe
 * For Kubernetes/Docker health checks
 */
export const livenessProbe = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Readiness Probe
 * Checks if app is ready to receive traffic
 */
export const readinessProbe = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const isReady = dbStatus === 1;

    if (isReady) {
      res.status(200).json({
        success: true,
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        status: 'not_ready',
        reason: 'Database not connected',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'not_ready',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
