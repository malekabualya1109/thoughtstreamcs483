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

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
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

  const handleEntryCreated = () => {
    fetchEntries();
    setShowModal(false);
  };

  // NEW: Delete handler
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
                      {entry.weather.condition}, {entry.weather.temperature} in {entry.weather.location}
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
            <p><strong>Location:</strong> {selectedEntry.location || "No location provided."}</p>
            <p><strong>Weather:</strong>{" "} 
              {selectedEntry.weather ? (
                <>
                  {selectedEntry.weather.condition}, {selectedEntry.weather.temperature} in {selectedEntry.weather.location}
                </>
              ) : (
                "Weather data unavailable."
              )}
            </p>
            {/* NEW Delete Button */}
            <button onClick={() => handleDelete(selectedEntry._id)}>Delete</button>
            <button onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;
