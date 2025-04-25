// routes/authRoutes.js
import express from "express";
import { handleGoogleLogin } from "../controllers/authController.js";

const router = express.Router();

// Handles login POST from frontend with Google ID token
router.post("/google", handleGoogleLogin);

export default router;
