# GitHub Setup - Final Step

## Do This Now:

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. **Repository name:** `finance-app`
3. **Description:** `Finance Dashboard - Income & Expense Tracker`
4. **Public** (so Render/Vercel can access it)
5. Click **Create repository**
6. You'll see your repo URL: `https://github.com/YOUR_USERNAME/finance-app`

### 2. Add Remote & Push

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
cd /Users/lowrence/Projects/FINANCE

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/finance-app.git

# Verify it worked
git remote -v

# Push to GitHub
git push -u origin main
```

Expected output:
```
remote: Create a pull request for 'main' on GitHub by visiting:
remote:      https://github.com/YOUR_USERNAME/finance-app/pull/new/main
```

### 3. Verify on GitHub
- Go to your repo: https://github.com/YOUR_USERNAME/finance-app
- You should see all your project files

---

## Then: Deploy to Render + Vercel

Follow **[DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)** for the final deployment steps.

✅ **You're almost done!**
