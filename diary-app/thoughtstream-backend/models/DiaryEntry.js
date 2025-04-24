import mongoose from 'mongoose';

// Define the schema for the DiaryEntry
const diaryEntrySchema = new mongoose.Schema(
  {
    // User who owns the diary entry (ObjectId referencing the User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming you have a User model
    },
    
    // Title of the diary entry (required)
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    
    // Main content of the diary entry (required)
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    
    // Reflection on the day (optional, max 500 characters)
    reflection: {
      type: String,
      maxlength: [500, 'Reflection cannot exceed 500 characters'],
      default: '',
    },
    
    // Location where the diary entry took place (optional)
    location: {
      type: String,
      default: '',
    },
    
    // Timestamp when the entry was created (auto-generated)
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
    // Timestamp when the entry was last updated (auto-updated)
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    
    // Tags for categorization (optional)
    tags: {
      type: [String],
      default: [],
    },
    
    // Weather data at the time of the diary entry (optional)
    weather: {
      condition: {
        type: String,
        default: 'Unknown',
      },
      temperature: {
        type: Number,
        default: 0,
      },
      location: {
        type: String,
        default: 'Unknown',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create and export the DiaryEntry model
const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema, "diaryCollection");

export default DiaryEntry;


