const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0.01,
    max: 999999999
  },
  type: { 
    type: String, 
    enum: ['income', 'expense', 'investment', 'saving'], 
    required: true,
    index: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['salary', 'freelance', 'shopping', 'food', 'transport', 'utilities', 'healthcare', 'entertainment', 'investment', 'savings', 'other'],
    index: true
  },
  subcategory: {
    type: String,
    maxlength: 50
  },
  date: { 
    type: Date, 
    required: true,
    index: true,
    default: Date.now
  },
  description: { 
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    maxlength: 30
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  receiptUrl: {
    type: String
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringRule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: null
    },
    endDate: Date
  },
  currency: {
    type: String,
    default: 'USD',
    match: /^[A-Z]{3}$/
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, { 
  timestamps: true,
  indexes: [
    { user: 1, date: -1 },
    { user: 1, type: 1 },
    { user: 1, category: 1 }
  ]
});

// Compound index for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema); 