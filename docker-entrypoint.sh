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

# Show what files exist
echo "Files in html directory:"
find /usr/share/nginx/html -type f

# Verify nginx config once
echo "Verifying nginx configuration..."
nginx -t 2>&1

# Start nginx in foreground
echo "Starting nginx on port 80..."
echo "Nginx will serve from /usr/share/nginx/html"
echo "Index file check:"
head -5 /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
