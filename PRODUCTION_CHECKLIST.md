# Production Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Environment & Configuration

- [ ] All environment variables are set in `.env` files
- [ ] Production API keys are configured (Gemini, Stripe)
- [ ] JWT secrets are strong (minimum 32 characters)
- [ ] Database credentials are secure
- [ ] Email service is configured and tested
- [ ] Frontend `VITE_API_URL` points to production backend
- [ ] CORS origins are correctly configured
- [ ] File upload limits are set appropriately

### Security

- [ ] All default passwords have been changed
- [ ] Database has authentication enabled
- [ ] Redis has password protection
- [ ] SSL certificates are installed
- [ ] HTTPS is enforced
- [ ] Security headers are enabled (Helmet.js)
- [ ] Rate limiting is configured
- [ ] Input validation is in place
- [ ] XSS protection is enabled
- [ ] CSRF protection is enabled
- [ ] File upload restrictions are configured
- [ ] Sensitive data is not logged

### Infrastructure

- [ ] Server has adequate resources (CPU, RAM, Disk)
- [ ] Firewall rules are configured (ports 22, 80, 443)
- [ ] Docker and Docker Compose are installed
- [ ] Nginx is installed and configured
- [ ] Domain DNS records are pointing to server
- [ ] SSL certificates are valid
- [ ] Database backups are configured
- [ ] Log rotation is set up
- [ ] Monitoring tools are installed

### Code & Testing

- [ ] All tests are passing (unit, integration, e2e)
- [ ] Code has been reviewed
- [ ] Latest code is merged to `main` branch
- [ ] Database migrations are ready
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] API endpoints are documented
- [ ] Frontend builds successfully
- [ ] Backend builds successfully

### Third-Party Services

- [ ] Google Gemini API key is valid and has sufficient quota
- [ ] Stripe account is in live mode with valid keys
- [ ] Stripe webhook endpoint is configured
- [ ] Email service credentials are valid
- [ ] Email templates are tested
- [ ] Domain is verified with email service
- [ ] Payment flow has been tested end-to-end

### CI/CD

- [ ] GitHub Actions workflows are configured
- [ ] All GitHub secrets are set
- [ ] Docker Hub credentials are configured
- [ ] SSH keys for deployment are set up
- [ ] Automated tests run on pull requests
- [ ] Deployment pipeline is tested

## Deployment

### Initial Setup

- [ ] Server is provisioned and accessible
- [ ] Setup script has been run
- [ ] Application code is cloned to server
- [ ] Environment files are created
- [ ] Docker images are built
- [ ] Services are started

### Verification

- [ ] All Docker containers are running
- [ ] MongoDB is accessible and healthy
- [ ] Redis is accessible and healthy
- [ ] Backend health endpoint returns 200
- [ ] Frontend is accessible
- [ ] API endpoints respond correctly
- [ ] WebSocket connection works
- [ ] Database migrations have run successfully

### SSL & Domain

- [ ] SSL certificates are installed
- [ ] HTTPS is working for main domain
- [ ] HTTPS is working for API subdomain
- [ ] SSL auto-renewal is configured
- [ ] HTTP redirects to HTTPS
- [ ] Certificate expiry monitoring is set up

## Post-Deployment

### Functional Testing

- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Expert profile creation works
- [ ] Session booking works
- [ ] Payment processing works (test small amount)
- [ ] Chat/messaging works
- [ ] File upload works
- [ ] Email notifications are sent
- [ ] Expert recommendations work (AI)
- [ ] Search functionality works
- [ ] Admin panel is accessible

### Performance

- [ ] Page load times are acceptable (< 3 seconds)
- [ ] API response times are good (< 500ms)
- [ ] Database queries are optimized
- [ ] Caching is working (Redis)
- [ ] Static assets are cached
- [ ] Images are optimized
- [ ] Lighthouse score > 90

### Monitoring & Logging

- [ ] Application logs are being written
- [ ] Error tracking is configured (Sentry)
- [ ] Uptime monitoring is set up
- [ ] Performance monitoring is active
- [ ] Database monitoring is configured
- [ ] Disk space monitoring is active
- [ ] SSL certificate expiry alerts are set
- [ ] Email delivery monitoring is active

### Backups & Recovery

- [ ] Database backup script is configured
- [ ] Automated backups are scheduled
- [ ] Backup restoration has been tested
- [ ] Backup retention policy is set (7-30 days)
- [ ] Code repository has recent backup
- [ ] Environment files are backed up securely
- [ ] Disaster recovery plan is documented

### Documentation

- [ ] API documentation is up to date
- [ ] Deployment guide is available
- [ ] Architecture diagrams are current
- [ ] Runbooks are created for common issues
- [ ] Contact information for on-call support
- [ ] Credentials are stored securely (password manager)

### Communication

- [ ] Stakeholders notified of deployment
- [ ] Support team briefed on new features
- [ ] Users notified if downtime expected
- [ ] Social media updated (if applicable)
- [ ] Status page updated

## Monitoring (First 24 Hours)

- [ ] Monitor error logs continuously
- [ ] Check application metrics hourly
- [ ] Monitor server resources (CPU, RAM, Disk)
- [ ] Watch for unusual traffic patterns
- [ ] Check database performance
- [ ] Monitor payment transactions
- [ ] Check email delivery rates
- [ ] Review user feedback/reports
- [ ] Monitor API response times
- [ ] Check SSL certificate status

## Week 1 Tasks

- [ ] Review all error logs
- [ ] Analyze performance metrics
- [ ] Check backup success
- [ ] Review security logs
- [ ] User feedback analysis
- [ ] Performance optimization if needed
- [ ] Update documentation based on issues
- [ ] Plan next iteration

## Emergency Contacts

```
On-Call Engineer: [Name, Phone]
DevOps Lead: [Name, Phone]
CTO/Tech Lead: [Name, Phone]
Hosting Provider Support: [Link, Phone]
Database Service Support: [Link, Phone]
```

## Rollback Plan

If critical issues occur:

1. **Stop current deployment**
   ```bash
   docker-compose down
   ```

2. **Restore from backup**
   ```bash
   cd /opt/backups/serene-wellbeing
   tar -xzf backup_TIMESTAMP.tar.gz -C /opt/serene-wellbeing
   ```

3. **Restart previous version**
   ```bash
   cd /opt/serene-wellbeing
   docker-compose up -d
   ```

4. **Verify rollback**
   - Test critical user flows
   - Check error logs
   - Monitor performance

5. **Communicate**
   - Notify stakeholders
   - Post incident report
   - Plan fix for next deployment

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Developer | | | |
| DevOps | | | |
| QA Lead | | | |
| Product Manager | | | |
| Security Lead | | | |

---

**Deployment Date:** ______________
**Deployment Time:** ______________
**Deployed By:** ______________
**Version:** ______________
**Git Commit:** ______________
