import express from "express";
import {
 createEntry,
 getAllEntries,
 getEntryById,
 updateEntry,
 deleteEntry,
} from "../controllers/diaryController.js";

import { fetchWeather } from "../controllers/weatherController.js";

import authenticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();
/**
* @route  GET /api/diary
* @desc   Fetch all diary entries
* @access Public (Authentication will be added in Part 2)
*/
router.get("/", authenticateJWT, getAllEntries);
/**
* @route  GET /api/diary/:id
* @desc   Fetch a specific diary entry by ID
* @access Public (Authentication will be added in Part 2)
*/
router.get("/:id", authenticateJWT, getEntryById);

/**
 * @route   POST /api/diary
 * @desc    Create a new diary entry
 * @access  Public (Authentication will be added in Part 2)
 */
router.post("/", authenticateJWT, createEntry)

/**
 * @route   PUT /api/diary/:id
 * @desc    Update an exissting diary entry
 * @access  Public (Authentication will be added in Part 2)
 */
router.put("/:id", authenticateJWT, updateEntry)

/**
 * @route   DELETE /api/diary/:id
 * @desc    Delete a diary entry
 * @access  Public (Authentication will be added in Part 2)
 */
router.delete("/:id", authenticateJWT, deleteEntry);

export default router;
