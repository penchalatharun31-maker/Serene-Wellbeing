# Frontend Healthcheck Fix

## Problem
Railway frontend deployment was failing with:
```
Attempt #1-4 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

## Root Cause
**Railway provides a dynamic `PORT` environment variable**, but the Nginx configuration was hardcoded to listen on port 80. Railway's healthcheck couldn't reach the service because it was checking on the wrong port.

## Solution

### 1. Updated Dockerfile
- Added `envsubst` utility for environment variable substitution
- Created startup script that reads Railway's `PORT` variable
- Nginx now listens on the correct dynamic port

### 2. Updated nginx.conf
- Changed `listen 80;` to `listen ${PORT};`
- Template substitution replaces `${PORT}` with actual Railway port at runtime

### 3. Updated railway.json
- Increased `healthcheckTimeout` from 60s to 300s
- Gives more time for container startup and Vite build

## How It Works

1. Railway assigns a random port (e.g., 8080, 7456, etc.)
2. Sets environment variable: `PORT=8080`
3. Startup script (`/start.sh`) runs:
   ```bash
   export PORT=${PORT:-80}  # Use Railway's PORT or default to 80
   envsubst "\$PORT" < nginx.conf.template > nginx.conf
   nginx -g "daemon off;"
   ```
4. Nginx listens on the correct port
5. Railway's healthcheck succeeds

## Testing

After deployment, check:
```bash
# Railway will show the assigned port in logs
# Healthcheck should succeed within 300s
```

## Files Changed
- `Dockerfile` - Dynamic port support
- `nginx.conf` - Template with ${PORT} variable
- `railway.json` - Increased healthcheck timeout
