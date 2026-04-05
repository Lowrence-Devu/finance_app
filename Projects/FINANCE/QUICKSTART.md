# QUICKSTART GUIDE

Get your Finance App running in 5 minutes! 🚀

## Prerequisites
- Node.js v14+ installed
- MongoDB Atlas account (free tier) or local MongoDB
- Firebase project created

## Step 1: Clone & Install (1 minute)

```bash
cd /Users/lowrence/Projects/FINANCE

# Install frontend deps
npm install

# Install backend deps
cd server && npm install && cd ..
```

## Step 2: Setup Environment Files (1 minute)

### Create `.env` in project root
```bash
cat > .env << 'EOF'
REACT_APP_FIREBASE_API_KEY=AIzaSyByM-fQBOrAbEYtcfaCC6QQQTWywDrcINA
REACT_APP_FIREBASE_AUTH_DOMAIN=finance-ffa9e.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=finance-ffa9e
REACT_APP_FIREBASE_STORAGE_BUCKET=finance-ffa9e.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=303590099893
REACT_APP_FIREBASE_APP_ID=1:303590099893:web:b01d40515a5cb6005567fc
REACT_APP_FIREBASE_MEASUREMENT_ID=G-CELWBPK99C
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
EOF
```

### Create `server/.env`
```bash
cat > server/.env << 'EOF'
MONGODB_URI=mongodb+srv://lowrencedevu:7F3D0h0UYlDnhwAw@cluster1.pybq5vu.mongodb.net/finance_app?retryWrites=true&w=majority&appName=Cluster1
PORT=5000
NODE_ENV=development
JWT_SECRET=00ce1c1f55c7e448be1c8d94ee18d32eb91f3c73340afca787db7f58e06cfb58
FRONTEND_URL=http://localhost:3000
EOF
```

## Step 3: Run the App (5 minutes)

### Terminal 1 - Start Frontend
```bash
npm start
# Frontend opens at http://localhost:3000
```

### Terminal 2 - Start Backend
```bash
cd server
npm run dev
# Backend starts at http://localhost:5000
```

## 🎉 Done! Your app is running!

### What You Can Do Now

1. **Sign up with Google** - Uses your Google account
2. **Create transactions** - Add income, expenses, savings
3. **View dashboard** - See real-time statistics
4. **Real-time sync** - Open in two windows to see live updates

## Common Issues & Fixes

### MongoDB Connection Error
```
Error: querySrv ENOTFOUND _mongodb._tcp...
```
**Fix:** Update `MONGODB_URI` in `server/.env` with correct credentials

### Port 3000/5000 Already in Use
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### WebSocket Connection Failed
- Make sure backend is running on port 5000
- Check that `.env` has correct `REACT_APP_API_URL`

## Features to Explore

✅ **Real-time Updates** - Changes sync instantly across windows
✅ **Analytics** - View spending by category
✅ **Transaction History** - Full history with filtering
✅ **User Profile** - Update personal settings
✅ **Dark Mode** - Toggle theme (if implemented in UI)

## Next Steps

- Read [README.md](./README.md) for complete documentation
- Check [ENHANCEMENTS.md](./ENHANCEMENTS.md) for what was improved
- Review API in `server/routes/` for custom development

## Need Help?

### View Logs
```bash
# Backend logs
cat server/logs/combined.log

# Error logs
cat server/logs/error.log
```

### Test Backend API
```bash
# Check health
curl http://localhost:5000/api/health

# Get transactions (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/transactions
```

---

**Happy coding! 🚀**

Last updated: April 3, 2026
