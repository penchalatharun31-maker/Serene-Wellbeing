# Multi-stage build for React frontend
FROM node:20-alpine AS base

# Accept VITE env vars as build arguments
ARG VITE_API_URL
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_APP_NAME=Serene\ Wellbeing\ Hub
ARG VITE_APP_VERSION=1.0.0
ARG VITE_SUPPORT_EMAIL=support@serenewellbeing.com
ARG VITE_ENABLE_CHAT=true
ARG VITE_ENABLE_VIDEO_CALLS=true
ARG VITE_ENABLE_GROUP_SESSIONS=true

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Builder stage
FROM base AS builder

# Expose build args as env vars so Vite picks them up during build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_SUPPORT_EMAIL=$VITE_SUPPORT_EMAIL
ENV VITE_ENABLE_CHAT=$VITE_ENABLE_CHAT
ENV VITE_ENABLE_VIDEO_CALLS=$VITE_ENABLE_VIDEO_CALLS
ENV VITE_ENABLE_GROUP_SESSIONS=$VITE_ENABLE_GROUP_SESSIONS

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code (excludes files in .dockerignore)
COPY . .

# Build the application — Vite reads ENV vars and bakes them into the bundle
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Install gettext for envsubst (template substitution)
RUN apk add --no-cache gettext

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy and set up startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (Railway will assign actual port via PORT env var)
EXPOSE 80

# Start nginx with dynamic port
ENTRYPOINT ["/docker-entrypoint.sh"]
