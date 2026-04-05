# Debugging Sign-In Issues

## Step 1: Check Browser Console for Errors

1. Go to https://financeapp-pink.vercel.app
2. Open **Developer Tools** (Press `F12`)
3. Click **Console** tab
4. Try to sign in (email/password or Google)
5. **Copy any RED ERROR messages** and send them to me

---

## Step 2: Verify Backend is Running

1. Go to https://finance-app-1zlk.onrender.com
2. You should see something like:
   ```
   {"message":"API is running","timestamp":"..."}
   ```
3. If you see this → Backend is working ✅
4. If 404 or blank → Backend has issues

---

## Step 3: Check Render Logs

1. Go to https://render.com/dashboard
2. Click your service
3. Click **Logs** tab
4. Look for any RED ERROR messages
5. Should show: ✅ "MongoDB connected successfully"

---

## Most Common Issues:

### ❌ "Cannot reach API"
- Backend env vars not set
- **Fix:** Add MONGODB_URI, JWT_SECRET to Render Environment

### ❌ "Firebase initialization error"
- Firebase config wrong
- **Fix:** Verify all Firebase values in Vercel env vars

### ❌ "CORS error"
- Backend CORS_ORIGIN not matching frontend URL
- **Fix:** Vercel CORS_ORIGIN = `https://financeapp-pink.vercel.app`

---

**Send me:**
1. Screenshot or copy of Console errors (F12)
2. What you see when visiting backend URL
3. Render log errors (if any)

Then I can fix it! 🔧
