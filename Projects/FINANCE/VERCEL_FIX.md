# Vercel Deployment Fix

## Issue: Build failed on Vercel

The error shows the build started but didn't complete. This is usually because:
1. ❌ Environment variables not set
2. ❌ Wrong framework/root directory configuration
3. ❌ Missing build command

## Fix: Re-deploy with correct settings

### Step 1: Return to Vercel Project Settings

Go to your Vercel dashboard:
https://vercel.com/dashboard

Click on your `finance-app` project → **Settings**

### Step 2: Configure Environment Variables

In **Settings** → **Environment Variables**, add ALL these:

```
REACT_APP_API_URL=https://finance-backend-xxx.onrender.com
REACT_APP_FIREBASE_API_KEY=AIzaSyByM-fQBOrAbEYtcfaCC6QQQTWywDrcINA
REACT_APP_FIREBASE_AUTH_DOMAIN=finance-ffa9e.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=finance-ffa9e
REACT_APP_FIREBASE_STORAGE_BUCKET=finance-ffa9e.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=303590099893
REACT_APP_FIREBASE_APP_ID=1:303590099893:web:b01d40515a5cb6005567fc
REACT_APP_ENV=production
```

**Note:** Replace `https://finance-backend-xxx.onrender.com` with your actual Render backend URL

### Step 3: Check Build Settings

In **Settings** → **General**, verify:

- **Framework Preset:** `Create React App`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Root Directory:** `./` (or leave empty)
- **Node.js Version:** `18.x` or `20.x`

### Step 4: Redeploy

- Go to **Deployments** tab
- Click on the failed deployment
- Click **Redeploy** (or go to project home and it will auto-redeploy after env vars are saved)
- Wait 2-3 minutes for build to complete

### Step 5: Verify Success

Once deployed:
- Frontend URL: `https://finance-app.vercel.app`
- Go there and test:
  - Can create account
  - Can add transactions
  - Does NOT show CORS errors
  - Can login/logout

---

## Alternative: Deploy from CLI (If Above Doesn't Work)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd /Users/lowrence/Projects/FINANCE

# Login to Vercel
vercel login

# Deploy
vercel --prod

# During deployment:
# - It will ask for project name (finance-app)
# - Say "yes" to link to existing Vercel project
# - It will deploy automatically
```

---

## If Still Failing

1. Check Vercel build logs in detail:
   - Click deployment → **Logs** (top right)
   - Look for actual error message
   - Copy error and tell me

2. Common issues:
   - **"Cannot find module"** → Run `npm install` locally first
   - **"REACT_APP_* not defined"** → Make sure env vars are set
   - **"Build timeout"** → Increase timeout in Vercel settings

---

## Once Vercel is Working

You still need to set up Render backend:
1. Go to https://render.com
2. Create new Web Service
3. Select `Lowrence-Devu/finance_app`
4. Use same env vars as above (but for backend)
5. Get backend URL and paste in Vercel `REACT_APP_API_URL`

**Let me know the exact error from Vercel build logs and I'll help fix it!**
