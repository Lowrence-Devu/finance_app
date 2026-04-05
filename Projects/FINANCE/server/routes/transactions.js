const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authMiddleware } = require('../utils/auth');
const { validateTransactionCreate, validateTransactionQuery, handleValidationErrors } = require('../utils/validation');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Get all transactions for the authenticated user with filtering and pagination
router.get('/', authMiddleware, validateTransactionQuery, handleValidationErrors, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category, startDate, endDate, sortBy = 'date' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: mongoose.Types.ObjectId(req.userId) };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ [sortBy]: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name email'),
      Transaction.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Get transactions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: mongoose.Types.ObjectId(req.userId)
    }).populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    logger.error('Get transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new transaction
router.post('/', authMiddleware, validateTransactionCreate, handleValidationErrors, async (req, res) => {
  try {
    const { amount, type, category, date, description, tags, subcategory, isRecurring, recurringRule, currency, notes } = req.body;

    const transaction = new Transaction({
      user: mongoose.Types.ObjectId(req.userId),
      amount,
      type,
      category,
      date,
      description,
      tags,
      subcategory,
      isRecurring,
      recurringRule,
      currency,
      notes,
      status: 'completed'
    });

    await transaction.save();
    await transaction.populate('user', 'name email');

    logger.info(`Transaction created: ${transaction._id} for user ${req.userEmail}`);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    logger.error('Create transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a transaction
router.put('/:id', authMiddleware, validateTransactionCreate, handleValidationErrors, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: mongoose.Types.ObjectId(req.userId)
      },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    logger.info(`Transaction updated: ${req.params.id}`);
    res.json({ success: true, data: transaction });
  } catch (err) {
    logger.error('Update transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: mongoose.Types.ObjectId(req.userId)
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    logger.info(`Transaction deleted: ${req.params.id}`);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    logger.error('Delete transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get transaction summary/analytics
router.get('/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: mongoose.Types.ObjectId(req.userId) };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const summary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          max: { $max: '$amount' },
          min: { $min: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ success: true, data: summary });
  } catch (err) {
    logger.error('Analytics error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get transaction by category
router.get('/analytics/by-category', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: mongoose.Types.ObjectId(req.userId) };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const byCategory = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ success: true, data: byCategory });
  } catch (err) {
    logger.error('Category analytics error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 