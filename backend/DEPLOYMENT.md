# Deployment Guide for Serene Wellbeing Backend

This guide covers deploying the Serene Wellbeing Backend API to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB production database set up
- [ ] Google Gemini API key obtained
- [ ] Stripe account configured (production keys)
- [ ] Email service configured (SendGrid, AWS SES, etc.)
- [ ] Frontend URL configured for CORS
- [ ] SSL certificate obtained (for HTTPS)
- [ ] Domain name configured

## Environment Setup

### Required Environment Variables

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing

# JWT
JWT_SECRET=your-production-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-production-refresh-secret-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# Google Gemini AI
GEMINI_API_KEY=your-production-gemini-api-key
GEMINI_MODEL=gemini-1.5-pro

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=Serene Wellbeing <noreply@serenewellbeing.com>

# Frontend
FRONTEND_URL=https://serenewellbeing.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment Options

### Option 1: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS
   # t3.medium or larger recommended
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone and Setup**
   ```bash
   git clone https://github.com/your-repo/serene-wellbeing.git
   cd serene-wellbeing/backend
   npm install
   npm run build
   ```

5. **Configure PM2**
   ```bash
   pm2 start dist/server.js --name serene-api
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.serenewellbeing.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /socket.io {
           proxy_pass http://localhost:5000/socket.io;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.serenewellbeing.com
   ```

### Option 2: DigitalOcean App Platform

1. **Connect Repository**
   - Link GitHub repository
   - Select backend directory

2. **Configure Build**
   ```yaml
   build_command: npm run build
   run_command: npm start
   ```

3. **Set Environment Variables**
   - Add all required env vars in dashboard

4. **Deploy**
   - Click deploy button

### Option 3: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set MONGODB_URI=your-mongodb-uri
   railway variables set JWT_SECRET=your-jwt-secret
   # ... add all variables
   ```

### Option 4: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create App**
   ```bash
   heroku create serene-wellbeing-api
   ```

3. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... set all variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Database Setup

### MongoDB Atlas

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create new cluster
   - Choose region close to your app

2. **Configure Network Access**
   - Add IP whitelist: 0.0.0.0/0 (or specific IPs)

3. **Create Database User**
   - Create user with read/write permissions
   - Save credentials securely

4. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/serene-wellbeing?retryWrites=true&w=majority
   ```

## File Storage

### AWS S3 Setup (Recommended)

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://serene-wellbeing-uploads
   ```

2. **Configure CORS**
   ```json
   {
     "CORSRules": [{
       "AllowedOrigins": ["https://serenewellbeing.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"]
     }]
   }
   ```

3. **Update Upload Utils**
   - Install AWS SDK: `npm install aws-sdk`
   - Update upload.ts to use S3

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# Dashboard
pm2 plus
```

### Log Management

Consider using:
- **Papertrail** - Log aggregation
- **Loggly** - Log management
- **DataDog** - Full monitoring

### Health Checks

Setup monitoring for:
- `/api/v1/health` - Health check endpoint
- Database connectivity
- External API availability

## Performance Optimization

### Enable Compression
Already included in server.ts

### Database Indexing
Already configured in models

### Caching Strategy
Consider adding Redis for:
- Session storage
- API response caching
- Rate limiting

```bash
npm install redis
```

### CDN for Static Assets
Use CloudFront or Cloudflare for:
- Uploaded images
- Static resources

## Security Hardening

### Firewall Configuration
```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### Regular Updates
```bash
# Update packages
sudo apt update && sudo apt upgrade

# Update Node.js
nvm install --lts
```

### Secrets Management
Use:
- AWS Secrets Manager
- HashiCorp Vault
- Environment-specific .env files

## Backup Strategy

### Database Backups

**MongoDB Atlas** (Automated):
- Continuous backups enabled by default
- Point-in-time recovery available

**Manual Backups**:
```bash
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### File Backups

**S3 Versioning**:
- Enable versioning on S3 bucket
- Configure lifecycle policies

## Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Use AWS ELB or Nginx

2. **Multiple Instances**
   ```bash
   pm2 start dist/server.js -i max
   ```

3. **Session Management**
   - Use Redis for session storage
   - Enable sticky sessions on load balancer

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Monitor with CloudWatch or similar

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Build
        run: |
          cd backend
          npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/serene-wellbeing/backend
            git pull
            npm install
            npm run build
            pm2 restart serene-api
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI
   - Verify network access in Atlas
   - Check firewall rules

2. **Port Already in Use**
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory
   node --max-old-space-size=4096 dist/server.js
   ```

4. **Socket.IO Not Working**
   - Check WebSocket support
   - Verify reverse proxy configuration
   - Check CORS settings

## Rollback Strategy

```bash
# Revert to previous version
pm2 stop serene-api
git checkout <previous-commit>
npm install
npm run build
pm2 start serene-api
```

## Post-Deployment

### Verification Steps

1. Test all endpoints
2. Verify Socket.IO connections
3. Test payment processing
4. Check email delivery
5. Monitor error logs
6. Test from frontend application

### Monitoring Alerts

Setup alerts for:
- Server downtime
- High error rates
- Database connection issues
- High memory/CPU usage
- Failed payment processing

## Support

For deployment issues:
- Check logs: `pm2 logs serene-api`
- Review error logs in `logs/` directory
- Contact DevOps team

## Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
