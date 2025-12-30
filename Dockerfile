# Multi-stage build for React frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build && \
    echo "=== Build completed ===" && \
    echo "Dist directory contents:" && \
    ls -laR dist/ && \
    echo "Total files in dist:" && \
    find dist -type f | wc -l

# Production stage with Nginx
FROM nginx:alpine

# Install wget for health check
RUN apk add --no-cache wget

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create necessary nginx directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/log/nginx \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && touch /var/log/nginx/access.log /var/log/nginx/error.log \
    && chown nginx:nginx /var/log/nginx/*.log

# Verify build artifacts exist and test nginx configuration
RUN ls -la /usr/share/nginx/html && \
    test -f /usr/share/nginx/html/index.html && \
    echo "Build artifacts verified" && \
    nginx -t

# Expose port 80
EXPOSE 80

# Note: Railway handles health checking via railway.json configuration
# Removing Docker HEALTHCHECK to avoid conflicts with Railway's health check mechanism

# Use entrypoint script to start nginx with debugging
CMD ["/docker-entrypoint.sh"]
