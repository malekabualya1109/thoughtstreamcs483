import mongoose from "mongoose";
import DiaryEntry from "../models/DiaryEntry.js";
import { fetchWeather } from "./weatherController.js";

/**
 * @route   GET /api/diary
 * @desc    Fetch all diary entries with optional filters
 * @access  Protected (Only for logged-in users)
 */
export const getAllEntries = async (req, res) => {
  try {
    // Only filter by user ID
    let filter = { user: req.user.userId }; 

    // Fetch all entries without additional filters
    const entries = await DiaryEntry.find(filter).sort({createdAt: -1});
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to fetch diary entries" });
  }
};


/**
 * @route   GET /api/diary/:id
 * @desc    Fetch a single diary entry by ID
 * @access  Protected (Only if user owns the entry)
 */
export const getEntryById = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid diary entry ID format" });
    }

    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // 🔒 Ownership check
    if (entry.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to retrieve diary entry" });
  }
};

/**
 * @route   POST /api/diary
 * @desc    Create a new diary entry
 * @access  Protected (Only logged-in users can create)
 */
export const createEntry = async (req, res) => {
  try {
    const { title, content, reflection, tags, location } = req.body;

    if (!title || !content || !location) {
      return res.status(400).json({ message: "Title, content, and location are required." });
    }

    const weatherData = location ? await fetchWeather(location) : null;

    const newEntry = new DiaryEntry({
      user: req.user.userId,  // Matches token and middleware
      title,
      content,
      reflection,
      tags,
      location,
      weather: weatherData,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/diary/:id
 * @desc    Update an existing diary entry
 * @access  Protected (Only if user owns the entry)
 */
export const updateEntry = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid diary entry ID format" });
    }

    const entry = await DiaryEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    if (
        entry.user.toString() !== req.user.userId.toString() &&
        entry.user.toString() !== req.user._id.toString()
      ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("Existing entry:", entry);

    const { title, content, reflection, tags, location } = req.body;

    console.log("Data to be updated:", { title, content, reflection, tags, location });

    entry.title = title ?? entry.title;
    entry.content = content ?? entry.content;
    entry.reflection = reflection ?? entry.reflection;
    entry.tags = tags ?? entry.tags;
    entry.location = location ?? entry.location;

    const updated = await entry.save();
    console.log("Updated entry:", updated);

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updating entry:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/diary/:id
 * @desc    Delete a diary entry
 * @access  Protected (Only if user owns the entry)
 */
export const deleteEntry = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid diary entry ID format" });
    }

    const entry = await DiaryEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // Ownership check
    if (entry.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await entry.deleteOne();
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};