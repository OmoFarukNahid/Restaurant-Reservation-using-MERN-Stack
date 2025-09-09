// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './error/error.js';
import reservationRouter from './routes/reservation.js';
import authRouter from "./routes/authRoutes.js";
import recommendationRouter from "./routes/recommendationRoutes.js";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Database
dbConnection();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // local development
  process.env.FRONTEND_URL, // production
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    name: 'sessionId',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // prevents JS access to cookie
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // required for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error('CORS policy: This origin is not allowed.'),
          false
        );
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recommendations', recommendationRouter);

// Error handling
app.use(errorMiddleware);

// Global uncaught exception handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
