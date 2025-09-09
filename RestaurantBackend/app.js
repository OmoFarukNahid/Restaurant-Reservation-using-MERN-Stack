import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './error/error.js';
import reservationRouter from './routes/reservation.js';
import authRouter from "./routes/authRoutes.js";
import recommendationRouter from "./routes/recommendationRoutes.js";

// Error handling at startup
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

dotenv.config({ path: './.env' });
const app = express();

// ✅ Trust proxy (needed for Render HTTPS + secure cookies)
app.set('trust proxy', 1);

// ✅ CORS (place this before routes)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://onlinerestaurantreservation.netlify.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Sessions
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true on Render
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/v1/reservation', reservationRouter);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/recommendations', recommendationRouter);

// ✅ Database
dbConnection();

// ✅ Error handling
app.use(errorMiddleware);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
