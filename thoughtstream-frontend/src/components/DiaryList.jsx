import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewEntryForm from '../components/NewEntryForm';
import "../styles/index.css";
import api from "../services/api";
import DiaryEntryCard from './DiaryEntryCard'

const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAllEntriesModal, setShowAllEntriesModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    reflection: "",
    tags: "",
    location: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try{
      const token = localStorage.getItem('jwt');
      console.log("Token fetched:", token); 
      
      const res = await api.get('/diary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Entries:", res.data);
      if(res.data.length === 0){
        console.log("no enteries found")
      }
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch diary entries", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (editingEntry) {
      setEditFormData({
        title: editingEntry.title,
        content: editingEntry.content,
        reflection: editingEntry.reflection,
        tags: editingEntry.tags?.join(", ") || "",
        location: editingEntry.location || ""
      });
    }
  }, [editingEntry]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  
  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
  }

  const closeDetailsModal = () => {
    setSelectedEntry(null);
  };

  const handleShowAllEntries = () => {
    setShowAllEntriesModal(true);
  };

  const closeAllEntriesModal = () => {
    setShowAllEntriesModal(false);
  };


  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

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
  };

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

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("jwt");
  
      if (!editingEntry) {
        throw new Error("No entry selected for editing");
      }
  
      // Log the current editingEntry to make sure it's correct
      console.log("Currently editing entry:", editingEntry);
  
      // Prepare the updated entry data
      const updatedEntry = {
        ...editFormData,
        tags: editFormData.tags ? editFormData.tags.split(",").map((tag) => tag.trim()) : [], // Make sure tags is an array
      };
  
      // Log the data you're sending to the server
      console.log("Updated entry data to be sent:", updatedEntry);
  
      // Check if any required fields are missing or invalid
      if (!updatedEntry.title || !updatedEntry.content) {
        throw new Error("Title and Content are required fields.");
      }
  
      // Send the PUT request to the backend
      const response = await api.put(`/diary/${editingEntry._id}`, updatedEntry, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // Log the response data from the API
      console.log("Response from server after update:", response.data);
  
      // Update the local state with the response from the server
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === editingEntry._id ? response.data : entry
        )
      );
  
      // Close the edit modal
      setEditingEntry(null);
      console.log("Entry updated successfully:", response.data);
    } catch (error) {
      // Log the detailed error information
      console.error("Failed to update the entry:", error);
  
      // Check if error response contains additional information
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error occurred";
  
      // Display a more descriptive error message
      alert(`Failed to update the entry: ${errorMessage}`);
    }
  };
  
  
 

  const handleEntryCreated = () => {
    fetchEntries();
    setShowModal(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry); 
    setSelectedEntry(null); 
  };

  return (
    <div className="diaryEntryList">
      <button onClick={() => setShowModal(true)} className="newEntryButton">
        + New Diary Entry
      </button>

      <button onClick={handleShowAllEntries} className="showAllEntriesButton">
        Show All Entries
      </button>

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
                    {" "}
                    <span>{entry.weather.condition}</span>
                    {", "}
                    <span>{entry.weather.temperature}</span> 
                    {" in "}
                    <span>{entry.weather.location}</span>
                  </>
                  ) : (
                    "Weather data unavailable."
                  )}
                </p>
                <hr />
              </div>
            ))}
            <button onClick={closeAllEntriesModal}>Close</button>
          </div>
        </div>
      )}

{editingEntry && (
        <div className="modalOverlay" onClick={() => setEditingEntry(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Entry</h2>
            <form className="Editor">
              <p>Title</p>
              <label>
                <input
                  className="titleEdit"
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                />
              </label>
              <p>Content</p>
              <label>
                <textarea
                  className="contentEdit"
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditChange}
                ></textarea>
              </label>
              <p>Reflection</p>
              <label>
                <textarea
                  className="reflectionEdit"
                  name="reflection"
                  value={editFormData.reflection}
                  onChange={handleEditChange}
                ></textarea>
              </label>
              <p>Tags (comma-seperated)</p>
              <label>
                <input
                  className="tagEdit"
                  type="text"
                  name="tags"
                  value={editFormData.tags}
                  onChange={handleEditChange}
                />
              </label>
              <p>Location</p>
              <label>
                <input
                  className="locationEdit"
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                />
              </label>
            </form>
            <div className="buttons">
              <button onClick={() => setEditingEntry(null)}>Cancel</button>
              <button onClick={handleEditSubmit}>Save Changes</button>
            </div> 
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
        <div className = "section2">
         <DiaryEntryCard
         entry={selectedEntry}
         onClose={closeDetailsModal}
         onEdit={handleEditEntry}
         onDelete={handleDelete}
       />
       </div> 
      )};

      </div>
  );  

};

export default DiaryList;