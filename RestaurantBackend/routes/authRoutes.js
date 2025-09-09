// routes/authRoutes.js
import express from "express";
import { register, login, logout, checkAuth } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth); // Add this new route

export default router;