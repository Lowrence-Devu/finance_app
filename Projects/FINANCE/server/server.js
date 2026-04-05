require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server: SocketIOServer } = require('socket.io');
const logger = require('./utils/logger');

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan(':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.warn('MONGODB_URI is not defined in .env file - using in-memory mode');
} else {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      logger.info('MongoDB connected successfully');
    })
    .catch(err => {
      logger.warn('MongoDB connection warning (server will continue):', err.message);
      logger.info('Running in limited mode - database operations may fail');
    });
}

// Monitor MongoDB connection changes
mongoose.connection.on('connected', () => {
  logger.info('MongoDB re-connected');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected - retrying...');
});

// Import routes
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Finance App API is running',
    timestamp: new Date(),
    version: '2.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'operational',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Real-time WebSocket connection
let connectedUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('user-join', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('users-online', Array.from(connectedUsers.keys()));
    logger.info(`User ${userId} joined (socket: ${socket.id})`);
  });

  socket.on('transaction-created', (data) => {
    io.emit('new-transaction', data);
    logger.info(`Transaction created by user ${data.userId}`);
  });

  socket.on('transaction-updated', (data) => {
    io.emit('update-transaction', data);
  });

  socket.on('transaction-deleted', (data) => {
    io.emit('delete-transaction', data);
  });

  socket.on('disconnect', () => {
    // Find and remove user from connectedUsers
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('users-online', Array.from(connectedUsers.keys()));
        logger.info(`User ${userId} disconnected`);
        break;
      }
    }
  });

  socket.on('error', (err) => {
    logger.error(`Socket error for ${socket.id}:`, err);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date(),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, gracefully shutting down');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
}); 