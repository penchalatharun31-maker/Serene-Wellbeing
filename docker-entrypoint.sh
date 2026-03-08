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

# Start nginx in background first to test if it starts
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2

# Check if nginx is still running
if kill -0 $NGINX_PID 2>/dev/null; then
    echo "✓ Nginx started successfully (PID: $NGINX_PID)"
    echo "✓ Server is ready to accept connections on port $PORT"
    # Wait for nginx process
    wait $NGINX_PID
else
    echo "✗ Nginx failed to start"
    exit 1
fi
