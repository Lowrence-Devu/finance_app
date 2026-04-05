const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  name: { 
    type: String,
    minlength: 2,
    maxlength: 100
  },
  avatar: { type: String },
  password: {
    type: String,
    select: false // Don't include password by default in queries
  },
  userType: { 
    type: String, 
    enum: ['employee', 'freelancer', 'business'],
    default: 'employee' 
  },
  currency: { 
    type: String, 
    default: 'USD',
    match: /^[A-Z]{3}$/ // ISO 4217 currency code
  },
  savingsGoal: { 
    type: Number, 
    default: 0,
    min: 0
  },
  monthlyBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: { type: Date },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Prevent sensitive data from being returned
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema); 