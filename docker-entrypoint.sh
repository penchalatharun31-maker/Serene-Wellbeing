#!/bin/sh
set -e

echo "=== Frontend Container Starting ==="
date

# Quick verification
echo "Checking build artifacts..."
if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "ERROR: index.html not found!"
    ls -la /usr/share/nginx/html/
    exit 1
fi

FILE_COUNT=$(find /usr/share/nginx/html -type f | wc -l)
echo "✓ Found $FILE_COUNT files in html directory"

# Verify nginx config once
echo "Verifying nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx on port 80..."
exec nginx -g 'daemon off;'
