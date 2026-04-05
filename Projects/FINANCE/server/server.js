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

/* =========================
   ✅ ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://financeapp-pink.vercel.app"
];

/* =========================
   ✅ SOCKET.IO CONFIG
========================= */
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* =========================
   ✅ SECURITY MIDDLEWARE
========================= */
app.use(helmet());

// Fix Firebase popup issue
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

/* =========================
   ✅ CORS CONFIG (IMPORTANT)
========================= */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Handle preflight requests
app.options("/*", cors());

/* =========================
   ✅ RATE LIMITING
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use('/api/', limiter);

/* =========================
   ✅ BODY PARSER
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   ✅ LOGGING
========================= */
app.use(morgan('dev'));

/* =========================
   ✅ DATABASE CONNECTION
========================= */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.warn('No MongoDB URI provided');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB error:', err));
}

/* =========================
   ✅ ROUTES
========================= */
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

/* =========================
   ✅ TEST ROUTES
========================= */
app.get('/', (req, res) => {
  res.json({ message: "Finance API running" });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected"
  });
});

/* =========================
   ✅ SOCKET EVENTS
========================= */
let connectedUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('user-join', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('users-online', Array.from(connectedUsers.keys()));
  });

  socket.on('transaction-created', (data) => {
    io.emit('new-transaction', data);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

/* =========================
   ✅ ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: err.message });
});

/* =========================
   ✅ 404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   ✅ START SERVER
========================= */
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});