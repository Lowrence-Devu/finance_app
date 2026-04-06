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
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: No userId' });
    }

    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(req.userId)
    }).sort({ date: -1 });

    res.json({ success: true, data: transactions });

  } catch (err) {
    console.error("GET ERROR:", err);
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ ANALYTICS
========================= */
router.get('/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ success: true, data: summary });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/by-category', authMiddleware, async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ success: true, data });

  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ CREATE TRANSACTION
========================= */
router.post('/', authMiddleware, validateTransactionCreate, handleValidationErrors, async (req, res) => {
  try {
    console.log("Incoming Body:", req.body);
    console.log("User ID:", req.userId);

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: No userId' });
    }

    const { amount, type, category, date, description } = req.body;

    const transaction = new Transaction({
      amount,
      type,
      category,
      date,
      description,
      user: new mongoose.Types.ObjectId(req.userId)
    });

    await transaction.save();

    console.log("Saved Transaction:", transaction);

    res.json({ success: true, data: transaction });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ UPDATE TRANSACTION
========================= */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ DELETE TRANSACTION
========================= */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ❗ GET SINGLE (LAST)
========================= */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });

  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;