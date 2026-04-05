const jwt = require('jsonwebtoken');
const logger = require('./logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    logger.warn('Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const generateToken = (userId, email, expiresIn = '7d') => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = {
  authMiddleware,
  generateToken,
};
