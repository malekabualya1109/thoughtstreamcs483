import DiaryEntry from "../models/DiaryEntry.js";
import { fetchWeather } from "./weatherController.js";
 
/**
 * @route   POST /api/diary
 * @desc    Create a new diary entry
 * @access  Public (Authentication will be added in Part 2)
 */
export const createEntry = async (req, res) => {
  try {


    // extract required fields from request body
    const { user, title, content, location, tags, reflection, weather } = req.body;
    console.log("Request Body: ", req.body);

    // validate that title, content and location are provided
    if( !title || !content || !location ) {
        return res.status(400).json({ message: "Title, content, and location are required "});
    }

    // create a new DiaryEntry object
    const weatherData = await fetchWeather(location);
    const newEntry = new DiaryEntry({
      user: req.user._id,
      title, 
      content, 
      location, 
      reflection: reflection || "",
      tags: tags || [],
      weather: {
        condition: weatherData?.weather?.[0]?.description || "Unknown",
        temperature: weatherData?.main?.temp || 0,
        location: location
      }
    });

    // save the new entry to the database
    const savedEntry = await newEntry.save();

    console.log("diary entry saved: ", savedEntry);
    
    // return a success response with the created entry
    res.status(201).json({
        message: "Diary entry created successfully",
        entry: newEntry,
    });

  } catch (error) {
    // handl any server errors
    console.error("error creating entry: ", error);
    res.status(500).json({ message: "Server error: unable to create diary entry" });
  }
 };

 /**
  * @route  GET /api/diary
  * @desc   Fetch all diary entries with optional filters
  * @access Public (Authentication will be added in Part 2)
  */
 export const getAllEntries = async (req, res) => {
    try {
        const { search, tag, location } = req.query;
        let filter = {} // no authentication in Part 1, so no user filter is applied
           
        //search filter (matches title or content)
        if(search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        // tag filter (exact match)
        if (tag) {
            filter.tags = tag;
        }

        // location filter
        if (location) {
            filter.location = location;
        }

        console.log("filter applied: ", JSON.stringify(filter, (key, value) =>
            value instanceof RegExp ? value.toString(): value
        ));

        //fetch filtered results and sort by newest first
        const entries = await DiaryEntry.find({ user: req.user._id });
        res.status(200).json(entries);

    } catch (error) {
        res.status(500).json({ message: "Server error: unable to fetch diary entries" });
    }
 };

 /**
  * @route      GET /api/diary/:id
  * @desc       Fetch a single diary entry by ID 
  * @access     Public (Authentication will be addede in Part 2)
  */
 export const getEntryById = async (req, res) => {
    try {
        console.log("fetching entry with ID: ", req.params.id);
        //const entry = await DiaryEntry.findById(String(req.params.id));
        const entry = await DiaryEntry.findById(req.params.id);
        if(!entry) {
            return res.status(404).json({ message: "Diary entry not found" });
        }
        res.status(200).json(entry);
    } catch (error) {
        console.error("error fetching diary entry: ", error);
        res.status(500).json({ message: "Server Error: unable to retrieve diary entry" });
    }
 };

 /**
  * @route      PUT /api/diary/:id
  * @desc       Update an existing diary entry
  * @access     Public (Authentication will be added in Part 2)
  * @returns 
  */
 export const updateEntry = async (req, res) => {
    try {
        // extract updated fields from requested body
        const { title, content, location, tags } = req.body;

        // ensure that the entry exists before updating
        const entry = await DiaryEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: "Diary entry not found" });
        }

        if(entry.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Don't own this diary." })
        }

        // update the fields that were provided in the request body
        if(title) entry.title = title;
        if(content) entry.content = content;
        if(location && location !== entry.location) {
            entry.location = location;
            const weatherData = await fetchWeather(location);
            entry.weather = {
                condition: weatherData?.weather?.[0]?.description || "Unknown",
                temperature: weatherData?.main?.temp || 0,
                location: location
            };
        }
        
        if(tags) entry.tags = tags;

        // save the update entry to the database
        await entry.save();

        //return the updated entry with a 200 OK status
        res.status(200).json({
            message: "Diary entry updated successfully",
            entry 
        });
    } catch (error) {
        // handle any server errors
        console.error(error);
        res.status(500).json({ message: "Server Error: Unable to update diary entry" });
    }
 };

 // delete a diary entry by ID
 export const deleteEntry = async (req, res) => {
    try {
        // find the entry by id from the request parameters 
        const entry = await DiaryEntry.findById(req.params.id);

        // ensure that the entry exists before deleting
        if (!entry) {
            return res.status(404).json({ message: "deleting: sdiary entry not found" });
        }

        if(entry.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Don't own this diary." })
        }

        // delete the entry from the database
        await entry.deleteOne();

        // return a success message with a 200 OK status
        res.status(200).json({ message: "Diary entry deleted successfully" });
    } catch (error) {
        // handle any server errors
        console.error(error);
        res.status(500).json({ message: "Server error: unable to delete diary entry" });
    }
 };

