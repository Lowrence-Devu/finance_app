const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authMiddleware } = require('../utils/auth');
const { validateUserUpsert, validateUserEmail, handleValidationErrors } = require('../utils/validation');
const logger = require('../utils/logger');

/* =========================
   ✅ UPSERT USER
========================= */
router.post('/upsert', validateUserUpsert, handleValidationErrors, async (req, res) => {
  try {
    const { email, name, avatar, userType, currency, savingsGoal } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      if (userType) user.userType = userType;
      if (currency) user.currency = currency;
      if (savingsGoal !== undefined) user.savingsGoal = savingsGoal;
      user.lastLogin = new Date();
    } else {
      user = new User({
        email,
        name,
        avatar,
        userType: userType || 'employee',
        currency: currency || 'USD',
        savingsGoal: savingsGoal || 0,
        lastLogin: new Date()
      });
    }

    await user.save();
    const token = generateToken(user._id, user.email);

    res.json({
      success: true,
      user: user.toJSON(),
      token
    });

  } catch (err) {
    logger.error('User upsert error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ PROFILE ROUTES FIRST
========================= */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.toJSON());
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authMiddleware, validateUserUpsert, handleValidationErrors, async (req, res) => {
  try {
    const { name, avatar, userType, currency, savingsGoal, monthlyBudget } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          ...(name && { name }),
          ...(avatar && { avatar }),
          ...(userType && { userType }),
          ...(currency && { currency }),
          ...(savingsGoal !== undefined && { savingsGoal }),
          ...(monthlyBudget !== undefined && { monthlyBudget }),
        }
      },
      { new: true }
    );

    res.json({ success: true, user });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ STATS
========================= */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');

    const stats = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, stats });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ DYNAMIC ROUTE LAST (IMPORTANT)
========================= */
router.get('/:email', validateUserEmail, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.toJSON());

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;