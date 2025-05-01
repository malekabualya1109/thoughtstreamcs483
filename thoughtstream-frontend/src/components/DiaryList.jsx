import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewEntryForm from '../components/NewEntryForm';
import "../styles/index.css";
import api from "../services/api";
import DiaryEntryCard from './DiaryEntryCard'

//managing and displaying diary entries
const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAllEntriesModal, setShowAllEntriesModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", content: "", reflection: "", tags: "", location: "", weather: {location: "" }, 
  });

  //fetch entries when the component loads 
  useEffect(() => { fetchEntries(); }, []);

  // fetch diary entries from backend
  const fetchEntries = async () => {
    try{
      const token = localStorage.getItem('jwt');
      console.log("Token fetched:", token); 
      
      //fetch entries from API
      const res = await api.get('/diary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Entries:", res.data);
      
      if(res.data.length === 0){ console.log("no enteries found") }
      
      //update entries state
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch diary entries", error.response?.data || error.message);
    }
  };

  // update edit form data when an entry is selected for editing
  useEffect(() => {
    if (editingEntry) {
      setEditFormData({
        title: editingEntry.title,
        content: editingEntry.content,
        reflection: editingEntry.reflection,
        tags: editingEntry.tags?.join(", ") || "",
        weather: { location: editingEntry.weather?.location || "" },
      });
    }
  }, [editingEntry]);

  // handle changes in the edit form
  const handleEditChange = async (e) => {
    const { name, value } = e.target;
  
    if (name === "location") {
      // Update the location in the form data
      setEditFormData((prevData) => ({
        ...prevData,
        weather: { ...prevData.weather, location: value },
      }));
      const weatherData = await fetchWeatherData(value);
      if (weatherData) {
        setEditFormData((prevData) => ({
          ...prevData,
          weather: {
            ...prevData.weather,
            condition: weatherData.condition,
            temperature: weatherData.temperature,
          },
        }));
      }
    } else {
      // update other form fields
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  // handle click on an entry to display details
  const handleEntryClick = async (entry) => {
    console.log("Clicked entry:", entry);

    // fetch weather data if not already available
    const weatherData = entry.weather?.location
      ? entry.weather
      : await fetchWeatherData(entry.weather.location);
    
    // update selected entry state
    setSelectedEntry({
      ...entry,
      weather: weatherData || entry.weather,  // Update weather if fetched or fallback
    });
  };
  
  // close details modal
  const closeDetailsModal = () => {
    setSelectedEntry(null);
  };

  // show all entries modal
  const handleShowAllEntries = () => {
    setShowAllEntriesModal(true);
  };

  // handle edit submission
  const closeAllEntriesModal = () => {
    setShowAllEntriesModal(false);
  };

  // handle change
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  /*handle edit submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/diary', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("Fetched Entries:", res.data);
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch diary entries", error);
    }
  };*/

  //handle delete request for an entry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this diary entry?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('jwt');
      await api.delete(`/diary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchEntries();
      setSelectedEntry(null);
    } catch (error) {
      alert("Failed to delete entry.");
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  //fetch weahter based on data ( this was supposed to be for updating weather if location changes)
  const fetchWeatherData = async (location) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Use your API key
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
  
      if (response.data) {
        return {
          condition: response.data.weather[0]?.description || "No condition data",
          temperature: `${response.data.main?.temp} °C` || "No temperature data",
          location: response.data.name || location, // Fallback to input location
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null; // Return null if there's an error
    }
  };
  
  // handle edit submission
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!editingEntry) {
        throw new Error("No entry selected for editing");
      }
  
      const updatedEntry = {
        ...editFormData,
        tags: editFormData.tags ? editFormData.tags.split(",").map((tag) => tag.trim()) : [],
      };
  
      // Fetch new weather data for the updated location
      const weatherData = await fetchWeatherData(updatedEntry.weather.location);
      if (weatherData) {
        updatedEntry.weather = weatherData;
      }
  
      // Send updated entry to the backend
      const response = await api.put(`/diary/${editingEntry._id}`, updatedEntry, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // Update the entries state with the response data
      const updatedEntries = entries.map((entry) =>
        entry._id === editingEntry._id ? response.data : entry
      );
      setEntries(updatedEntries);
  
      // Update the selectedEntry state directly after the edit
      if (selectedEntry?._id === editingEntry._id) {
        setSelectedEntry({
          ...selectedEntry,
          weather: response.data.weather, // Ensure weather is updated
        });
        console.log("Updated selectedEntry:", selectedEntry);
      }
  
      setEditingEntry(null); // Close edit modal
    } catch (error) {
      console.error("Failed to update the entry:", error);
      alert(`Failed to update the entry: ${error.message}`);
    }
  };
  
  const handleEntryCreated = () => {
    fetchEntries();
    setShowModal(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry); // Trigger edit modal directly
    setSelectedEntry(null); // Close detail view if it's open
  };

  return (
    <div className="diaryEntryList">
      {/* button to create a new diary entry */}
      <button onClick={() => setShowModal(true)} className="newEntryButton">
        + New Diary Entry
      </button>

      {/* button to show all entries */}
      <button onClick={handleShowAllEntries} className="showAllEntriesButton">
        Show All Entries
      </button>

      {/* dislay entries as cards*/ }
      <div className="entryListContainer">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div
              key={entry._id}
              className="diaryEntryCard"
              onClick={() => handleEntryClick(entry)}
            >
              <h3>{entry.title}</h3>
            </div>
          ))
        ) : (
          <p>No diary entries yet!</p>
        )}
      </div>

      {/* Modal to show all entries' content */}
      {showAllEntriesModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button onClick={closeAllEntriesModal}>Close</button>
            <h2>All Diary Entries</h2>
            {entries.map(entry => (
              <div key={entry._id}>
                <h3>{entry.title}</h3>
                <p><strong>Content:</strong> {entry.content}</p>
                <p><strong>Reflection:</strong> {entry.reflection || "No reflection added."}</p>
                <p><strong>Tags:</strong> {entry.tags?.join(", ") || "No tags."}</p>
                <p><strong>Location:</strong> {entry.location || "No location provided."}</p>
                <p><strong>Weather:</strong> 
                  {entry.weather ? (
                    <>
                      <span>{entry.weather.condition}</span>, 
                      <span>{entry.weather.temperature}</span> 
                      in <span>{entry.weather.location}</span>
                    </>
                  ) : (
                    "Weather data unavailable."
                  )}
                </p>
                <hr/>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingEntry && (
        <div className="modalOverlay" onClick={() => setEditingEntry(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Entry</h2>
            <form>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Content:
                <textarea
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditChange}
                ></textarea>
              </label>
              <label>
                Reflection:
                <textarea
                  name="reflection"
                  value={editFormData.reflection}
                  onChange={handleEditChange}
                ></textarea>
              </label>
              <label>
                Tags (comma-separated):
                <input
                  type="text"
                  name="tags"
                  value={editFormData.tags}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={editFormData.weather.location}
                  onChange={handleEditChange}
                />
              </label>
            </form>
            <button onClick={() => setEditingEntry(null)}>Cancel</button>
            <button onClick={handleEditSubmit}>Save Changes</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <NewEntryForm onEntryCreated={handleEntryCreated} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>{selectedEntry.title}</h2>
              <p><strong>Content:</strong> {selectedEntry.content}</p>
              <p><strong>Reflection:</strong> {selectedEntry.reflection || "No reflection added."}</p>
              <p><strong>Tags:</strong> {selectedEntry.tags?.join(", ") || "No tags."}</p> 
              <p><strong>Location:</strong> {selectedEntry.weather?.location || "No location provided."}</p>
              <p><strong>Weather:</strong> 
              {selectedEntry.weather ? (
              <>
                <span>{selectedEntry.weather.condition}</span>, 
                <span>{selectedEntry.weather.temperature}</span> 
                in <span>{selectedEntry.weather.location}</span>
              </>
              ) : (
              "Weather data unavailable."
              )}</p>
                <button onClick={closeDetailsModal}>Close</button>
                <button onClick={() => handleEditEntry(selectedEntry)}>Edit</button>
                <button onClick={() => handleDelete(selectedEntry._id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;