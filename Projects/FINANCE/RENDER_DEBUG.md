# How to See Render Build Logs

## Step 1: View Full Build Logs

1. Go to https://render.com/dashboard
2. Click **finance-backend** service
3. Click **Events** tab (you're already here)
4. Click the **most recent failing deploy** (red X)
5. This opens the full build output
6. Scroll to see the **actual error message** (usually in red)

The logs will show what's actually going wrong.

---

## Common Issues We've Seen:

### Error: "Cannot find module"
- Missing dependency in `server/package.json`
- Solution: Add it locally first, test, push to GitHub

### Error: "ENOENT" or "file not found"
- Build/Start command is wrong
- Solution: Make sure Root Directory is BLANK

### Error: "Port already in use"
- Multiple instances running
- Solution: Use `killall node` or restart service

### Error: "MongoDB connection failed"
- DB credentials wrong or IP not whitelisted
- Solution: Check MongoDB Atlas ✅ (you already did this)

---

## Try This Quick Fix Locally First

Before Render deploy, test backend locally:

```bash
cd /Users/lowrence/Projects/FINANCE/server

# Install dependencies
npm install

# Start server
npm start
```

Should see:
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

If you see errors locally, we need to fix them before Render can work.

---

**Copy the FULL error message from the Render logs and send it to me.**
