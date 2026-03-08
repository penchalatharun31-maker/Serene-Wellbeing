#!/bin/sh
set -e

# Get PORT from environment, default to 80 if not set
export PORT=${PORT:-80}

echo "============================================"
echo "Starting Nginx on PORT: $PORT"
echo "============================================"

# Substitute environment variables in nginx config
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

echo "Nginx configuration (listen directives):"
cat /etc/nginx/nginx.conf | grep -A 2 "listen" || echo "No listen directives found"

echo "============================================"
echo "Checking if static files exist..."
ls -la /usr/share/nginx/html/ | head -10
echo "============================================"

echo "Testing nginx configuration..."
nginx -t

echo "============================================"
echo "Starting Nginx daemon..."
echo "============================================"

# Start nginx
exec nginx -g 'daemon off;'
