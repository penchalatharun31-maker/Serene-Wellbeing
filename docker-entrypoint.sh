#!/bin/sh
set -e

echo "=== Frontend Container Starting ==="
echo "Date: $(date)"

# Verify nginx config
echo "Testing nginx configuration..."
nginx -t

# Check if dist files exist
echo "Checking /usr/share/nginx/html contents..."
ls -la /usr/share/nginx/html/ || echo "ERROR: Directory not found or empty"

# Count files in dist
FILE_COUNT=$(find /usr/share/nginx/html -type f | wc -l)
echo "Found $FILE_COUNT files in html directory"

if [ $FILE_COUNT -eq 0 ]; then
    echo "ERROR: No files found in /usr/share/nginx/html"
    exit 1
fi

# Check for index.html specifically
if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "ERROR: index.html not found!"
    exit 1
fi

echo "index.html exists, size: $(stat -c%s /usr/share/nginx/html/index.html) bytes"

# Start nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;'
