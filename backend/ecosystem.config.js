/**
 * PM2 Ecosystem Configuration
 *
 * Production-ready PM2 configuration for process management
 *
 * Features:
 * - Cluster mode for better performance
 * - Auto-restart on crashes
 * - Memory management
 * - Log rotation
 * - Environment-specific configurations
 *
 * Usage:
 *   Development: pm2 start ecosystem.config.js --env development
 *   Staging:     pm2 start ecosystem.config.js --env staging
 *   Production:  pm2 start ecosystem.config.js --env production
 *
 *   Monitor:     pm2 monit
 *   Logs:        pm2 logs serene-backend
 *   Status:      pm2 status
 *   Restart:     pm2 restart serene-backend
 *   Stop:        pm2 stop serene-backend
 *   Delete:      pm2 delete serene-backend
 */

module.exports = {
  apps: [
    {
      // Application name
      name: 'serene-backend',

      // Script to execute
      script: './dist/server.js',

      // Working directory
      cwd: './',

      // Instances
      // 'max' = Use all available CPUs
      // number = Specify exact number of instances
      instances: process.env.PM2_INSTANCES || 'max',

      // Execution mode: 'cluster' or 'fork'
      // Cluster mode enables load balancing across instances
      exec_mode: 'cluster',

      // Watch for file changes and auto-reload (development only)
      watch: false,

      // Ignore these files when watching
      ignore_watch: ['node_modules', 'logs', 'uploads', '.git'],

      // Auto-restart settings
      autorestart: true,

      // Max memory restart threshold (1GB)
      max_memory_restart: '1G',

      // Delay between restarts
      restart_delay: 4000,

      // Maximum number of restarts within 15 min before stopping
      min_uptime: '10s',
      max_restarts: 10,

      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,

      // Timeout for graceful shutdown
      kill_timeout: 5000,

      // Wait for ready signal
      wait_ready: true,
      listen_timeout: 10000,

      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Merge logs from all instances
      merge_logs: true,

      // Environment variables for all environments
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },

      // Development environment
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
      },

      // Staging environment
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 5000,
        instances: 2,
      },

      // Production environment
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      // Source map support for better error traces
      source_map_support: true,

      // Instance variables
      instance_var: 'INSTANCE_ID',

      // Advanced features
      treekill: true,

      // Post-deployment scripts
      post_update: ['npm install', 'npm run build'],

      // Monitoring
      automation: false,

      // Node.js specific
      node_args: [
        '--max-old-space-size=2048',
        '--optimize-for-size',
        '--max-http-header-size=80000',
      ],
    },
  ],

  /**
   * Deployment configuration
   * Uncomment and configure for automated deployments
   */
  deploy: {
    production: {
      // SSH user
      user: 'node',

      // Server host(s)
      host: ['production-server.com'],

      // SSH port
      port: '22',

      // Git remote/branch
      ref: 'origin/main',

      // Git repository
      repo: 'git@github.com:yourusername/serene-wellbeing.git',

      // Path on the server
      path: '/var/www/serene-backend',

      // SSH key path
      // key: '~/.ssh/id_rsa',

      // Commands to execute before setup
      'pre-setup': 'echo "Preparing server..."',

      // Commands to execute on the server after git clone
      'post-setup': 'npm install && npm run build',

      // Commands to execute before deployment
      'pre-deploy-local': 'echo "Deploying to production..."',

      // Commands to execute on the server before pm2 reload
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',

      // Environment variables for deployment
      env: {
        NODE_ENV: 'production',
      },
    },

    staging: {
      user: 'node',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/serene-wellbeing.git',
      path: '/var/www/serene-backend-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
