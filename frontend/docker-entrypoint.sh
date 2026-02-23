#!/bin/sh
set -e

# Get PORT from environment, default to 80 if not set
export PORT=${PORT:-80}

echo "============================================"
echo "Starting Nginx on PORT: $PORT"
echo "============================================"

# Substitute environment variables in nginx config
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

echo "Nginx configuration:"
cat /etc/nginx/nginx.conf | grep -A 2 "listen"

echo "============================================"
echo "Starting Nginx daemon..."
echo "============================================"

# Start nginx
exec nginx -g 'daemon off;'
