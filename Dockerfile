# Multi-stage build for React frontend
FROM node:20-alpine AS builder

# Accept VITE env vars as build arguments so Vite can bake them into the bundle
ARG VITE_API_URL
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_APP_NAME=Serene\ Wellbeing\ Hub
ARG VITE_APP_VERSION=1.0.0
ARG VITE_SUPPORT_EMAIL=support@serenewellbeing.com
ARG VITE_ENABLE_CHAT=true
ARG VITE_ENABLE_VIDEO_CALLS=true
ARG VITE_ENABLE_GROUP_SESSIONS=true

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

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code (excludes files in .dockerignore)
COPY . .

# Build the application — Vite reads ENV vars and bakes them into the bundle
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Install gettext for envsubst (template substitution)
RUN apk add --no-cache bash gettext

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create startup script to handle Railway's dynamic PORT
RUN echo '#!/bin/bash\n\
set -e\n\
export PORT=${PORT:-80}\n\
echo "Starting Nginx on port $PORT"\n\
envsubst "\$PORT" < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf\n\
nginx -g "daemon off;"\n\
' > /start.sh && chmod +x /start.sh

# Expose the port (Railway will override this)
EXPOSE ${PORT:-80}

# Start nginx with dynamic port
CMD ["/start.sh"]
