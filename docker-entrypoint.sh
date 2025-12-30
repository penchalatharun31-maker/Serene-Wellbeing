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

# Count files in dist - Alpine-compatible
FILE_COUNT=$(find /usr/share/nginx/html -type f | wc -l)
echo "Found $FILE_COUNT files in html directory"

if [ "$FILE_COUNT" -eq "0" ]; then
    echo "ERROR: No files found in /usr/share/nginx/html"
    exit 1
fi

# Check for index.html specifically
if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "ERROR: index.html not found!"
    exit 1
fi

# Get file size - Alpine/BusyBox compatible
INDEX_SIZE=$(wc -c < /usr/share/nginx/html/index.html)
echo "index.html exists, size: $INDEX_SIZE bytes"

# Test if nginx can actually start and serve
echo "Testing nginx startup..."
nginx -t 2>&1 | head -5

# Start nginx in foreground
echo "Starting nginx in foreground..."
echo "Nginx will listen on port 80"
exec nginx -g 'daemon off;'
