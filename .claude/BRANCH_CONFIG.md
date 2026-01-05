# Claude Code Branch Configuration

## ⚠️ IMPORTANT: Active Development Branch

**ALL development work should happen on:**
```
claude/production-deploy-015ntgtxbopumD2TQiYsgTyT
```

This branch is used for BOTH:
- ✅ Backend deployment
- ✅ Frontend deployment
- ✅ All feature development

## DO NOT USE These Branches

❌ `claude/backend-google-ai-studio-015ntgtxbopumD2TQiYsgTyT` - Wrong branch
❌ `claude/fresh-papaya-015ntgtxbopumD2TQiYsgTyT` - Old branch

## Deployment Links

**Backend (Railway):** Uses `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT`
**Frontend (Vercel/etc):** Uses `claude/production-deploy-015ntgtxbopumD2TQiYsgTyT`

## Quick Commands

```bash
# Always start by checking out the correct branch
git checkout claude/production-deploy-015ntgtxbopumD2TQiYsgTyT

# Before starting work
git pull origin claude/production-deploy-015ntgtxbopumD2TQiYsgTyT

# After completing work
git push -u origin claude/production-deploy-015ntgtxbopumD2TQiYsgTyT
```

## For Claude Code Sessions

When starting a new session, always specify:
```
Work on branch: claude/production-deploy-015ntgtxbopumD2TQiYsgTyT
This branch is used for both backend and frontend deployment.
```

---
Last Updated: 2026-01-03
