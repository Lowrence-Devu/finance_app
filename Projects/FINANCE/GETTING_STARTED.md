# Getting Started Guide

## 🎬 Quick Start (2 Minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start the Application
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### 3️⃣ Explore the Dashboard
- **Login**: Use any email/password (demo mode)
- **View Dashboard**: See your financial summary
- **Switch Role**: Use "Admin/Viewer" button in navbar
- **Add Transaction**: Fill the form and submit (Admin only)
- **Filter Data**: Use search, date, amount, and category filters

---

## 📋 Features Tour

### Dashboard Overview (Top Section)
- **Total Balance**: Your overall balance from all transactions
- **Monthly Expenses**: Total cash outflows this month  
- **Investments**: Total amount invested
- **Savings**: Money in savings accounts

### Data Visualizations
- **Spending Trends Chart**: Line chart showing expense patterns over time
- **Category Breakdown**: Pie chart showing where money is spent

### Transaction Management
1. Switch to **Admin Mode** using the navbar switcher
2. Enter transaction details:
   - Amount (how much)
   - Type (Income/Expense/Investment/Saving)
   - Category (e.g., Groceries, Rent, Salary)
   - Date (when)
   - Description (why)
3. Click "Add Transaction"
4. Edit or delete existing transactions

### Filtering & Search
- **Search Bar**: Find by category or description
- **Date Range**: Filter by specific dates
- **Amount Range**: Filter by amount bounds
- **Category Filter**: Select specific categories
- **Type Filter**: Show specific transaction types

### Insights Section
- **Spending Prediction**: AI estimate for next month
- **Smart Tip**: Personalized financial advice
- **Highest Category**: Where you spend the most
- **Monthly Comparison**: How spending changed month-over-month

### Role-Based Access
- **Admin Mode**: 
  - ✅ View all data
  - ✅ Add transactions
  - ✅ Edit transactions
  - ✅ Delete transactions
  
- **Viewer Mode**:
  - ✅ View all data
  - ✅ View charts & insights
  - ❌ Cannot add/edit/delete transactions

---

## ⚙️ Configuration Options

### Change Currency
Use the currency dropdown to switch between:
- USD ($)
- EUR (€)
- INR (₹)
- GBP (£)
- JPY (¥)
- CAD (C$)

### Set Savings Goal
Update your savings goal in the dashboard to see progress tracking

### Switch User Type
The app supports different user personas:
- **Employee**: Focused on salary & savings
- **Business Owner**: Focused on profit & business expenses
- **Student**: Focused on pocket money management

---

## 🔧 Troubleshooting

### App not starting?
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Transactions not loading?
- Ensure backend is running (if using real backend)
- Check network tab in DevTools for API errors
- Mock data should load automatically

### Role switcher not appearing?
- Ensure you're logged in
- Refresh the page
- Clear browser cache

### Filters not working?
- Clear all filters and try one at a time
- Check browser console for errors
- Reload the page

---

## 📱 Mobile Usage

The dashboard is fully responsive:
- **Mobile View**: Pull-out menu, single column layout
- **Touch-friendly**: Large tap targets
- **Readable**: Proper font sizes for small screens

---

## 💾 Data Persistence

- **User Preferences**: Saved in browser LocalStorage
- **Role Selection**: Remembered between sessions
- **Currency Choice**: Saved automatically
- **Transactions**: Loaded from backend API

---

## 🎓 Learning Path

1. **First Visit**: Read the Dashboard Overview
2. **Understanding Data**: Look at the charts
3. **Exploration**: Switch role and try adding transactions
4. **Advanced**: Use filters to find specific spending patterns
5. **Insights**: Check predictions and tips

---

## 🚀 Next Steps

Ready to go deeper?
- Check `/src/components` to see how components are built
- Look at `/src/pages/Dashboard.js` for main logic
- Explore `/src/context` to understand state management
- Review backend API in `/server` for data integration

---

## 📞 Questions?

- Check the main [README.md](./README.md) for detailed docs
- Look for comments in source files
- Review styled components for UI patterns

**Enjoy managing your finances! 💰**
