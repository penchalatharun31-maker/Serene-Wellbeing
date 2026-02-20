# Multi-stage build for React frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (don't copy package-lock.json - let npm generate fresh for Docker platform)
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
# Not copying package-lock.json because it was generated on macOS
# npm will install dependencies fresh for linux-arm64-musl (Alpine) platform
# This ensures rollup's platform-specific optional dependencies install correctly
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Development stage - keeps Node.js running for dev server
FROM node:20-alpine AS dev

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code (will be overridden by volumes in docker-compose)
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
