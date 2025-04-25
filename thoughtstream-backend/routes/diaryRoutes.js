import express from "express";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} from "../controllers/diaryController.js";

// Import the correct JWT middleware
import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/diary
 * @desc    Fetch all diary entries (with optional filters)
 * @access  Protected (JWT required)
 */
router.get("/", authenticateJWT, getAllEntries);

/**
 * @route   GET /api/diary/:id
 * @desc    Fetch a single diary entry by ID
 * @access  Protected (JWT required)
 */
router.get("/:id", authenticateJWT, getEntryById);

/**
 * @route   POST /api/diary
 * @desc    Create a new diary entry
 * @access  Protected (JWT required)
 */
router.post("/", authenticateJWT, createEntry);

/**
 * @route   PUT /api/diary/:id
 * @desc    Update a diary entry
 * @access  Protected (JWT required)
 */
router.put("/:id", authenticateJWT, updateEntry);

/**
 * @route   DELETE /api/diary/:id
 * @desc    Delete a diary entry
 * @access  Protected (JWT required)
 */
router.delete("/:id", authenticateJWT, deleteEntry);

export default router;
