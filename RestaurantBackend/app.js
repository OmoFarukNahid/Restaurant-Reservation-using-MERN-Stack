import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './error/error.js';
import reservationRouter from './routes/reservation.js';
import authRouter from "./routes/authRoutes.js";
import recommendationRouter from "./routes/recommendationRoutes.js"; // Added this import

// Error handling at startup
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

dotenv.config({ path: './.env' });
const app = express();

// Middleware
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/reservation', reservationRouter);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/recommendations', recommendationRouter); // Added this line

// Database
dbConnection();

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;