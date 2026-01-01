#!/bin/bash
echo "=== DEPLOYMENT VERIFICATION SCRIPT ==="
echo ""
echo "Branch: $(git branch --show-current)"
echo "Latest Commit: $(git log -1 --oneline)"
echo ""
echo "=== Checking Critical Files ==="
echo ""

# Check Dockerfiles exist
[ -f "Dockerfile" ] && echo "✅ Frontend Dockerfile exists" || echo "❌ Frontend Dockerfile MISSING"
[ -f "Dockerfile.backend" ] && echo "✅ Backend Dockerfile exists" || echo "❌ Backend Dockerfile MISSING"
[ -f "railway.json" ] && echo "✅ Frontend railway.json exists" || echo "❌ Frontend railway.json MISSING"
[ -f "backend/railway.json" ] && echo "✅ Backend railway.json exists" || echo "❌ Backend railway.json MISSING"
[ -f "backend/src/types/express.d.ts" ] && echo "✅ Express type declarations exist" || echo "❌ Type declarations MISSING"

echo ""
echo "=== Checking .dockerignore ==="
if grep -q "^backend$" .dockerignore 2>/dev/null; then
    echo "❌ PROBLEM: .dockerignore contains 'backend' - THIS WILL BREAK BUILD"
else
    echo "✅ .dockerignore is correct (doesn't exclude backend/)"
fi

echo ""
echo "=== Checking Node versions in Dockerfiles ==="
grep "FROM node:" Dockerfile | head -1
grep "FROM node:" Dockerfile.backend | head -2

echo ""
echo "=== Backend TypeScript Config ==="
grep "typeRoots" backend/tsconfig.json || echo "⚠️ typeRoots not found in tsconfig.json"

echo ""
echo "=== Ready for deployment! ==="
echo "Push to: claude/production-deploy-015ntgtxbopumD2TQiYsgTyT"
