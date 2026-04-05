# Deploy with Render + Vercel (Quick Guide)

Your IP: **106.195.66.181**

## Phase 1: MongoDB Setup (Do This First!) ⚠️

1. Open MongoDB Atlas: https://cloud.mongodb.com
2. Click **Network Access** → **IP Access List**
3. Click **+ Add IP Address**
4. Enter **0.0.0.0/0** (allows all servers)
   - Comment: "Production deployment"
   - Click **Confirm**
5. Wait 2-3 minutes for change to apply
6. Test locally: `npm start` in server folder
7. Should see "Connected to MongoDB" ✅

See **MONGODB_SETUP.md** for detailed steps.

---

## Phase 2: Git Push to GitHub

```bash
cd /Users/lowrence/Projects/FINANCE

# Initialize git (if not done)
git init

# Create .gitignore (if not done)
echo "node_modules\n.env\n.env.local\nbuild\n.DS_Store" > .gitignore

# Stage and commit everything
git add .
git commit -m "Initial commit: Finance Dashboard v1.0"

# Add GitHub remote (create repo first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

✅ Now your code is on GitHub

---

## Phase 3: Deploy Backend to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub (easier)
- Authorize Render to access your repositories

### Step 2: Create Backend Service
1. Dashboard → **+ New** → **Web Service**
2. Connect your GitHub repository
3. Select your repo
4. Settings:
   - **Name:** `finance-app-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `server` (if prompted, leave blank and we'll fix with deploy.sh)

### Step 3: Set Environment Variables
- In Render dashboard, scroll to **Environment**
- Add these variables:

```
MONGODB_URI=mongodb+srv://lowrencedevu:lowrence17@cluster1.pybq5vu.mongodb.net/finance_app
JWT_SECRET=your-secret-key-here-minimum-32-characters
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Step 4: Deploy
- Render auto-deploys on git push
- Wait 3-5 minutes for build to complete
- Once done, note your backend URL:
  - Format: `https://finance-app-backend.onrender.com`
  - Shown in dashboard as "Service URL"

✅ Backend is now live!

---

## Phase 4: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Authorize Vercel

### Step 2: Import Project
1. Dashboard → **Add New** → **Project**
2. Select your GitHub repository
3. Vercel auto-detects it's a React app

### Step 3: Configure
- **Project Name:** `finance-app` (or your choice)
- **Root Directory:** `./` (default is fine)
- **Framework Preset:** `Create React App` (auto-selected)

### Step 4: Set Environment Variables
- Click **Environment Variables** section
- Add:

```
REACT_APP_API_URL=https://finance-app-backend.onrender.com
REACT_APP_FIREBASE_API_KEY=AIzaSyD[YOUR_KEY]
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
REACT_APP_ENV=production
```

Replace Firebase values from your Firebase Console.

### Step 5: Deploy
- Click **Deploy**
- Wait 2-3 minutes for build & deployment
- Vercel provides your live URL:
  - Format: `https://finance-app.vercel.app`

✅ Frontend is now live!

---

## Phase 5: Update Backend CORS (Important!)

Your frontend is now at a Vercel URL. Update backend to allow it:

1. Go to your GitHub repo
2. Edit `server/.env` file (or redeploy with new var):
   ```
   CORS_ORIGIN=https://finance-app.vercel.app
   ```
3. Commit and push: `git add . && git commit -m "Update CORS for production" && git push`
4. Render auto-redeploys (usually 1-2 minutes)

---

## Phase 6: Test Everything

### Frontend Tests
- [ ] Go to `https://finance-app.vercel.app`
- [ ] Can create account / login
- [ ] Can add a transaction
- [ ] Can see transactions in dashboard
- [ ] Dark/Light mode works
- [ ] Theme persists on reload

### Backend Tests
- [ ] Open browser Console (F12)
- [ ] No CORS errors
- [ ] Network tab shows requests to `onrender.com`
- [ ] All API calls succeed

### Database Tests
- [ ] Transactions saved to MongoDB
- [ ] Refresh page, transactions still there
- [ ] Can edit/delete transactions

---

## Phase 7: Custom Domain (Optional)

### Using Vercel's Free Domain
- Dashboard → Your Project → Settings → Domains
- Add custom domain (requires DNS config)

### Using Render's Custom Domain
- Backend: Dashboard → Your Service → Settings → Custom Domain
- Point DNS to the provided CNAME

---

## Your Live URLs (After Deployment)

**Frontend:** `https://finance-app.vercel.app`  
**Backend API:** `https://finance-app-backend.onrender.com`  
**Database:** MongoDB Atlas (managed)  
**Custom Domain (Optional):** `https://your-domain.com`

---

## Troubleshooting

### Frontend shows "Cannot connect to API"
- [ ] Check CORS_ORIGIN in backend env vars
- [ ] Verify REACT_APP_API_URL matches backend URL
- [ ] Check Render backend is running (dashboard)
- [ ] See error in Console (F12) for details

### Backend deployment failed
- [ ] Check Render deployment logs
- [ ] Verify `npm start` works locally: `cd server && npm start`
- [ ] Check all env vars are set in Render dashboard
- [ ] Verify MongoDB IP whitelist includes 0.0.0.0/0

### Transactions not saving
- [ ] Check MongoDB connection in Render logs
- [ ] Verify MongoDB IP whitelist
- [ ] Check MongoDB Atlas dashboard for connection errors

### CORS errors in Console
- [ ] Update CORS_ORIGIN in backend
- [ ] Backend URL must match REACT_APP_API_URL exactly
- [ ] Redeploy backend after env var change

---

## Quick Workflow for Future Updates

1. Make changes locally
2. Test: `npm start` (frontend) + `npm run dev` (backend)
3. Commit: `git add . && git commit -m "message" && git push`
4. Vercel auto-deploys frontend (1-2 min)
5. Render auto-deploys backend (1-2 min)
6. Changes live immediately!

---

**Total Deployment Time:** ~15-20 minutes  
**Cost:** Free tier for both Render + Vercel (with limits)

You're all set! 🚀
