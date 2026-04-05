const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// User validation rules
const validateUserUpsert = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('userType')
    .optional()
    .isIn(['employee', 'freelancer', 'business'])
    .withMessage('Invalid user type'),
  body('currency')
    .optional()
    .isISO4217()
    .withMessage('Invalid currency code'),
  body('savingsGoal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Savings goal must be a positive number'),
];

const validateUserEmail = [
  param('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
];

// Transaction validation rules
const validateTransactionCreate = [
  body('amount')
    .isFloat({ min: 0.01, max: 999999999 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['income', 'expense', 'investment', 'saving'])
    .withMessage('Invalid transaction type'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

const validateTransactionQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  handleValidationErrors,
  validateUserUpsert,
  validateUserEmail,
  validateTransactionCreate,
  validateTransactionQuery,
};
