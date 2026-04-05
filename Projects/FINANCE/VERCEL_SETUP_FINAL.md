# Vercel Environment Setup - Confirmed Firebase

Your Firebase credentials are confirmed. Now add them to Vercel.

## Step 1: Fix Root Directory (Critical!)

1. Go to https://vercel.com/dashboard
2. Click **finance-app** project
3. Click **Settings** tab
4. Find **Build & Development Settings** section
5. Look for **Root Directory**
6. **Change it to:** `.` (just a dot) or leave **BLANK**
7. Click **Save**

## Step 2: Add Environment Variables

In **Settings** → **Environment Variables**, add these **exact values**:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyByM-fQBOrAbEYtcfaCC6QQQTWywDrcINA
REACT_APP_FIREBASE_AUTH_DOMAIN=finance-ffa9e.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=finance-ffa9e
REACT_APP_FIREBASE_STORAGE_BUCKET=finance-ffa9e.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=303590099893
REACT_APP_FIREBASE_APP_ID=1:303590099893:web:b01d40515a5cb6005567fc
REACT_APP_FIREBASE_MEASUREMENT_ID=G-CELWBPK99C
REACT_APP_API_URL=https://finance-backend-xxx.onrender.com
REACT_APP_ENV=production
```

**Note:** Replace `finance-backend-xxx` with your actual Render backend URL (you'll get this after deploying backend)

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **failed** deployment (red X)
3. Click **Redeploy** button
4. Wait 2-3 minutes for build

## Step 4: Verify Success

Once deployed:
- Visit: https://finance-app.vercel.app
- Try:
  - ✅ Sign up with email or Google
  - ✅ Add a transaction
  - ✅ Check it appears in dashboard
  - ✅ Refresh page - data persists

---

## If It Still Fails

Send me these from Vercel build logs:
- The **exact error message** (red text)
- **Full error stack** if shown

I'll help debug!

---

## Next: Deploy Backend to Render

Once Vercel is working, deploy backend:
1. Go to https://render.com
2. New Web Service
3. Select: `Lowrence-Devu/finance_app`
4. Set:
   - Name: `finance-backend`
   - Build Cmd: `cd server && npm install`
   - Start Cmd: `cd server && npm start`
5. Add env vars (from server/.env)
6. Deploy → Copy backend URL
7. Paste URL in Vercel as `REACT_APP_API_URL`

---

**Done with these steps?** Let me know! 🚀
