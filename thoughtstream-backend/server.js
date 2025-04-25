import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; 


// Route imports
import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());             // Enable CORS (frontend on localhost:5173)
app.use(express.json());     // Parse JSON request bodies

// API Routes
app.use("/api/auth", authRoutes);   // Handles Google login (POST /api/auth/google)
app.use("/api/diary", diaryRoutes); // JWT-protected diary endpoints

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
