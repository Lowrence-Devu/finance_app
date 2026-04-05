# MongoDB Atlas IP Whitelist Setup

## Your Current IP: `106.195.66.181`

## Step-by-Step: Add IP to MongoDB Atlas

### 1. Open MongoDB Atlas Dashboard
- Go to: https://cloud.mongodb.com
- Sign in with your account
- Select your cluster (e.g., "Cluster0" or "cluster1")

### 2. Navigate to Network Access
- Click **"Network Access"** in left sidebar
- In the top tab, select **"IP Access List"**

### 3. Add Your IP
- Click **"+ Add IP Address"** button
- In popup, choose:
  - **Option A (Recommended for Development):** 
    - Paste: `106.195.66.181`
    - Comment: `Local Development`
    - Click **"Confirm"**
  
  - **Option B (For Production + Render Backend):**
    - Enter: `0.0.0.0/0` (allows all IPs)
    - Comment: `Production - All IPs`
    - Click **"Confirm"**
    - ⚠️ Less secure, but required for Render backend to access MongoDB

### 4. Verify It's Added
- You should see it in the IP Access List table
- Status should show **"Active"**
- Wait 1-2 minutes for Atlas to apply the change

### 5. Test Connection Locally

**Option A: Using mongosh (if installed)**
```bash
mongosh "mongodb+srv://lowrencedevu:lowrence17@cluster1.pybq5vu.mongodb.net/finance_app"
```

**Option B: Using node with MongoDB driver**
```bash
cd /Users/lowrence/Projects/FINANCE/server
npm start
```
Look for success message instead of "IP not whitelisted" error.

## For Render Deployment (Important!)

When you deploy backend to Render:
- Render's server will have a **different IP address** than your local machine
- You need to allow Render's IP in MongoDB Atlas

**Two Options:**

### Option 1: Whitelist 0.0.0.0/0 (Easiest)
```
- Go to MongoDB Atlas Network Access
- Add IP: 0.0.0.0/0
- Comment: "Production - All IPs"
- This allows any server to connect
```

### Option 2: Find Render's IP (More Secure)
```
- Deploy your backend to Render first
- Keep deployment, don't delete
- Check your backend logs in Render dashboard
- Get the IP from error message or deployment info
- Add that specific IP to MongoDB Atlas
```

**Recommended:** Use Option 1 (0.0.0.0/0) for production with Render.

## MongoDB Connection String

Your connection string is already in `server/.env`:
```
MONGODB_URI=mongodb+srv://lowrencedevu:lowrence17@cluster1.pybq5vu.mongodb.net/finance_app
```

This is correct and will work once IP is whitelisted.

## Quick Verification Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Navigated to Network Access → IP Access List
- [ ] Added `106.195.66.181` (local) or `0.0.0.0/0` (production)
- [ ] Waited 2 minutes for change to apply
- [ ] Tested connection with: `npm start` in server directory
- [ ] No "IP not whitelisted" error appears
- [ ] Server shows "Connected to MongoDB" message

## Common Issues

**Issue:** Still getting "IP not whitelisted" after adding
- **Fix:** Wait 2-3 minutes for Atlas to apply the change, then try again

**Issue:** Connection times out but no whitelist error
- **Fix:** Check connection string is exactly: `mongodb+srv://lowrencedevu:lowrence17@cluster1.pybq5vu.mongodb.net/finance_app`

**Issue:** "authentication failed" error
- **Fix:** Verify username is `lowrencedevu` and password is `lowrence17` (or reset password in MongoDB Atlas)

**Issue:** Render backend can't connect after deployment
- **Fix:** Add `0.0.0.0/0` to MongoDB Atlas IP whitelist (or specific Render IP)

---

**Once MongoDB is working locally, you're ready for Render + Vercel deployment!**
