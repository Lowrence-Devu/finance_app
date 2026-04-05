# 🚀 Render + Vercel Deployment - Ready to Go

**Status:** ✅ MongoDB Connected  
**Date:** April 5, 2026

---

## Step 1: Push to GitHub (2 minutes)

```bash
cd /Users/lowrence/Projects/FINANCE

# Add all files
git add .

# Commit
git commit -m "Finance Dashboard - Ready for production deployment"

# Push to GitHub
git push origin main
```

**Note:** If you get an error, create a GitHub repo first:
1. Go to https://github.com/new
2. Create repo named `finance-app`
3. Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/finance-app.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2a. Create Render Account
- Go to https://render.com
- Click **Sign up with GitHub**
- Authorize Render

### 2b. Create New Service
- Dashboard → **New +** → **Web Service**
- Select your `finance-app` repository
- Settings:
  - **Name:** `finance-backend`
  - **Branch:** `main`
  - **Build Command:** `cd server && npm install`
  - **Start Command:** `cd server && npm start`
  - **Environment:** `Node`

### 2c. Add Environment Variables
Scroll down to **Environment** section, add:

```
MONGODB_URI=mongodb+srv://lowrencedevu:lowrence17@cluster1.pybq5vu.mongodb.net/finance_app
JWT_SECRET=your-secret-key-minimum-32-chars-change-this
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://finance-app.vercel.app
```

### 2d. Deploy
- Click **Create Web Service**
- Wait 3-5 minutes
- Once deployed, copy the URL (looks like: `https://finance-backend-xxxxx.onrender.com`)
- **Leave this tab open** - you need this URL in Step 3

✅ Backend is live!

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### 3a. Create Vercel Account
- Go to https://vercel.com
- Click **Sign up with GitHub**
- Authorize Vercel

### 3b. Import Project
- Dashboard → **Add New** → **Project**
- Select your `finance-app` repository
- Click **Import**

### 3c. Configure Project
- **Project Name:** `finance-app`
- **Framework:** `Create React App` (auto-selected)
- **Root Directory:** `./` (leave blank)

### 3d. Add Environment Variables

Click **Environment Variables** and add your Firebase config + API URL:

```
REACT_APP_API_URL=https://finance-backend-xxxxx.onrender.com
REACT_APP_FIREBASE_API_KEY=[From Firebase Console]
REACT_APP_FIREBASE_AUTH_DOMAIN=[From Firebase Console]
REACT_APP_FIREBASE_PROJECT_ID=[From Firebase Console]
REACT_APP_FIREBASE_STORAGE_BUCKET=[From Firebase Console]
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=[From Firebase Console]
REACT_APP_FIREBASE_APP_ID=[From Firebase Console]
REACT_APP_ENV=production
```

**To get Firebase values:**
1. Open https://console.firebase.google.com
2. Select your project
3. Click Settings ⚙️ → Project Settings
4. Copy config values

### 3e. Deploy
- Click **Deploy**
- Wait 2 minutes
- Your live URL: `https://finance-app.vercel.app` ✅

---

## Step 4: Update Backend CORS (1 minute)

Your frontend URL is now live on Vercel. Update your backend to allow it:

### Option A: Update in GitHub
```bash
cd /Users/lowrence/Projects/FINANCE
# Edit server/.env
# Change: CORS_ORIGIN=https://finance-app.vercel.app
# Save and push:
git add server/.env
git commit -m "Update CORS for Vercel production"
git push origin main
```
Render auto-redeploys (1-2 minutes)

### Option B: Update in Render Dashboard
1. Go to https://render.com/dashboard
2. Click your backend service
3. Click **Environment**
4. Edit `CORS_ORIGIN` to your Vercel URL
5. Save (auto-deployes)

---

## Step 5: Test (3 minutes)

### Frontend Tests
```
✅ Visit: https://finance-app.vercel.app
✅ Create account / Login with Google
✅ Add a transaction (e.g., "Salary - $5000")
✅ See it in Dashboard
✅ Switch Dark/Light mode
✅ Page refresh - data persists
```

### Backend Tests (Open Browser Console - F12)
```
✅ No CORS errors
✅ Network tab shows requests to onrender.com
✅ All API responses 200/201
✅ Transactions saved to MongoDB
```

---

## Your Live Application

| Component | URL |
|-----------|-----|
| **Frontend** | `https://finance-app.vercel.app` |
| **Backend API** | `https://finance-backend-xxxxx.onrender.com` |
| **Database** | MongoDB Atlas (managed) |

---

## Troubleshooting

### ❌ "Cannot reach API" / CORS errors
- Update `CORS_ORIGIN` in backend env to match your Vercel URL
- Redeploy backend (Render does this auto)

### ❌ Transactions not saving
- Check MongoDB connection in Render logs
- Verify `0.0.0.0/0` is in MongoDB Atlas whitelist ✅ (you did this)

### ❌ Frontend stuck on loading
- Check Vercel build logs for errors
- Verify all `REACT_APP_*` env vars are set

### ❌ Login not working
- Verify Firebase config is correct
- Check browser Console for Firebase errors

---

## Future Updates

After deployment, any changes follow this flow:
```bash
# 1. Make changes locally & test
npm start  # frontend
cd server && npm start  # backend

# 2. Push to GitHub
git add .
git commit -m "Your message"
git push origin main

# 3. Both platforms auto-deploy (2-3 minutes)
# ✅ Changes live!
```

---

## Ready? Start with Step 1! 🎯

**Estimated total time: 15-20 minutes to go live**

Questions? See **RENDER_VERCEL_DEPLOY.md** for detailed steps.
