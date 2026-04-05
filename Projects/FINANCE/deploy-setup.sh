#!/bin/bash

# Finance Dashboard - Quick Deploy Setup
# This script prepares your project for deployment

echo "🚀 Finance Dashboard Deployment Setup"
echo "======================================"
echo ""

# Step 1: Setup .gitignore
echo "📝 Setting up .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Logs
logs/
*.log

# OS
Thumbs.db
.cache/
.parcel-cache/
EOF
echo "✅ .gitignore created"
echo ""

# Step 2: Check if git is initialized
if [ ! -d .git ]; then
  echo "🔧 Initializing Git repository..."
  git init
  echo "✅ Git repository initialized"
else
  echo "✅ Git repository already initialized"
fi
echo ""

# Step 3: Add files to git
echo "📦 Staging files..."
git add .
echo "✅ Files staged"
echo ""

# Step 4: Create initial commit if no commits exist
if git rev-parse --verify HEAD > /dev/null 2>&1; then
  echo "✅ Repository already has commits"
else
  echo "💾 Creating initial commit..."
  git commit -m "Initial commit: Finance Dashboard v1.0

- Professional UI/UX design
- Dark/Light mode support
- Transaction management
- Role-based access control
- Real-time updates with Socket.IO
- Responsive design
- Firebase authentication"
  echo "✅ Initial commit created"
fi
echo ""

# Step 5: Display next steps
echo "🎯 Next Steps:"
echo "======================================"
echo ""
echo "1️⃣  Create GitHub Repository:"
echo "   - Go to https://github.com/new"
echo "   - Name: finance-dashboard"
echo "   - Create repository (don't initialize with README)"
echo ""
echo "2️⃣  Connect to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/finance-dashboard.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Deploy Frontend (Choose one):"
echo "   Option A - Vercel (Easiest):"
echo "      npm install -g vercel"
echo "      vercel"
echo ""
echo "   Option B - Netlify:"
echo "      npm run build"
echo "      Drag & drop 'build' folder to netlify.com"
echo ""
echo "   Option C - Railway (Recommended):"
echo "      Go to railway.app"
echo "      Connect your GitHub repo"
echo ""
echo "4️⃣  Deploy Backend:"
echo "   Railway: Auto-detected from server folder"
echo "   Render: Create new Web Service"
echo "   Or follow DEPLOYMENT_GUIDE.md for full instructions"
echo ""
echo "📋 Full guide: See DEPLOYMENT_GUIDE.md"
echo ""
