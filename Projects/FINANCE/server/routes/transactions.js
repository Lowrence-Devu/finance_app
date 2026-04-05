const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authMiddleware } = require('../utils/auth');
const { validateTransactionCreate, validateTransactionQuery, handleValidationErrors } = require('../utils/validation');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/* =========================
   ✅ GET ALL TRANSACTIONS
========================= */
router.get('/', authMiddleware, validateTransactionQuery, handleValidationErrors, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const transactions = await Transaction.find({
      user: mongoose.Types.ObjectId(req.userId)
    });

    res.json({ success: true, data: transactions });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ ANALYTICS (MOVE UP)
========================= */
router.get('/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ success: true, data: summary });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/by-category', authMiddleware, async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ CREATE
========================= */
router.post('/', authMiddleware, validateTransactionCreate, handleValidationErrors, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: mongoose.Types.ObjectId(req.userId)
    });

    await transaction.save();
    res.json({ success: true, data: transaction });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ UPDATE
========================= */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: transaction });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ DELETE
========================= */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ❗ DYNAMIC ROUTE LAST
========================= */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.json({ success: true, data: transaction });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;