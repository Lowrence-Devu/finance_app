# Pre-Deployment Checklist ✅

Complete this checklist before deploying your Finance Dashboard to production.

## 1. Local Verification ✓
- [ ] Run `npm run build` in root directory
- [ ] Verify "Compiled successfully" message
- [ ] Check build size: should be ~280 KB gzipped
- [ ] Test all features locally: `npm start` (frontend), `npm run dev` (backend)
- [ ] Dark/Light mode toggle working
- [ ] Theme persists on page reload
- [ ] All transactions CRUD operations working (after MongoDB setup)
- [ ] Role-based UI rendering working correctly

## 2. MongoDB Atlas Setup ⚠️ CRITICAL
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a cluster (free tier available)
- [ ] Create database: `finance_app`
- [ ] Create user with password
- [ ] **Add your IP to Network Access whitelist**
  - Recommended: Start with your current IP, later allow `0.0.0.0/0` for production
- [ ] Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/finance_app`
- [ ] Test connection: `mongosh` or MongoDB Compass
- [ ] Verify connection string works locally

## 3. Firebase Setup
- [ ] Log in to Firebase Console: https://console.firebase.google.com
- [ ] Verify project exists or create new one
- [ ] Enable Authentication methods:
  - [ ] Email/Password
  - [ ] Google OAuth (recommended)
- [ ] Copy Firebase config values to your `.env.production` file
- [ ] Test Firebase authentication locally

## 4. Environment Variables
### Frontend (`.env.production` or set in hosting platform)
```
REACT_APP_API_URL=<your-backend-url>
REACT_APP_FIREBASE_API_KEY=<your-key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your-domain>
REACT_APP_FIREBASE_PROJECT_ID=<your-project>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your-bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-id>
REACT_APP_FIREBASE_APP_ID=<your-app-id>
REACT_APP_ENV=production
```

### Backend (`server/.env`)
```
MONGODB_URI=<your-connection-string>
JWT_SECRET=<generate-secure-key>
NODE_ENV=production
PORT=5000
CORS_ORIGIN=<your-frontend-url>
```

## 5. Code Quality
- [ ] No console.log statements left in production code (optional cleanup)
- [ ] All API endpoints tested and working
- [ ] Error handling implemented
- [ ] Responsive design tested on mobile (Chrome Dev Tools)
- [ ] Dark mode tested thoroughly
- [ ] No hardcoded credentials in codebase

## 6. Git Repository Setup
```bash
# Initialize if not done
git init
git add .
git commit -m "Initial commit: Finance Dashboard v1.0"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```
- [ ] Repository created on GitHub
- [ ] All files committed and pushed
- [ ] `.gitignore` configured properly (excludes node_modules, .env, etc.)
- [ ] README.md describes project
- [ ] Deployment guide included

## 7. Choose Deployment Option

### Option A: Vercel (Frontend) + Render (Backend) ⭐ Recommended
**Vercel Dashboard:**
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub repository
- [ ] Configure environment variables (Frontend)
- [ ] Deploy with one click
- [ ] Custom domain setup (optional)

**Render Dashboard:**
- [ ] Sign up at https://render.com
- [ ] Create New → Web Service
- [ ] Connect GitHub repository (server/ directory)
- [ ] Set environment variables (Backend)
- [ ] Deploy and note the URL
- [ ] Update `REACT_APP_API_URL` in Vercel with this URL

### Option B: Railway (Easiest - All-in-One)
- [ ] Sign up at https://railway.app
- [ ] Connect GitHub
- [ ] Create 2 services:
  - [ ] Frontend (build: `npm run build`, start: `npx serve -s build`)
  - [ ] Backend (build: `npm install`, start: `npm start`)
- [ ] Link them together
- [ ] Deploy both

### Option C: Heroku + Netlify
- [ ] Create Procfile for backend deployment
- [ ] Deploy backend to Heroku
- [ ] Deploy frontend to Netlify
- [ ] Update environment variables

## 8. Post-Deployment Testing
- [ ] Frontend loads without errors (check Console tab)
- [ ] Authentication works (login/register)
- [ ] Can create a transaction
- [ ] Can view transactions list
- [ ] Dashboard displays insights correctly
- [ ] Theme switching works
- [ ] Profile page accessible
- [ ] Mobile responsive on small screens
- [ ] No CORS errors in Console

## 9. Domain Setup (Optional)
- [ ] Purchase domain (GoDaddy, Namecheap, etc.)
- [ ] Configure DNS records for your hosting platform
- [ ] Enable SSL certificate (usually automatic)
- [ ] Test domain in browser
- [ ] Verify HTTPS works

## 10. Monitoring & Security
- [ ] Enable error tracking (Sentry recommended)
- [ ] Set up database backups (MongoDB Atlas: automatic)
- [ ] Monitor API usage
- [ ] Check logs regularly
- [ ] Keep dependencies updated

## 11. Documentation
- [ ] README.md updated with live links
- [ ] QUICKSTART.md reflects production setup
- [ ] Architecture documentation complete
- [ ] API documentation available for backend

---

## Common Issues & Solutions

### "Cannot GET /" Error
**Cause:** Frontend not deployed correctly
**Fix:** Verify build directory, check deployment logs

### "CORS Error" in Console
**Cause:** Backend URL not matching in frontend env vars
**Fix:** Update `REACT_APP_API_URL` to match backend URL

### "MongoDB Connection Failed"
**Cause:** IP not whitelisted or connection string wrong
**Fix:** Add IP to MongoDB Atlas Network Access tab

### "Blank page loading"
**Cause:** Missing environment variables
**Fix:** Verify all REACT_APP_* variables set in deployment platform

### "Firebase auth not working"
**Cause:** Firebase config values incorrect or Firebase not initialized
**Fix:** Verify Firebase config matches your project ID

---

## Ready for Launch? ✅
Once all items are checked, your Finance Dashboard is ready for production!

**Support:**
- Frontend Issues: Check browser Console (F12) for errors
- Backend Issues: Check deployment platform logs
- Database Issues: Check MongoDB Atlas dashboard
- Need help? Review DEPLOYMENT_GUIDE.md for detailed instructions
