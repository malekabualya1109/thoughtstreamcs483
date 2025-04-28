import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewEntryForm from '../components/NewEntryForm';
import "../styles/index.css";
import api from "../services/api";


const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="diaryEntryList">
      <button onClick={() => setShowModal(true)} className="newEntryButton">
        + New Diary Entry
      </button>

      <div className="entryListContainer">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry._id} className="diaryEntryCard">
              <h3>{entry.title}</h3>
            </div>
          ))
        ) : (
          <p>No diary entries yet!</p>
        )}
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <NewEntryForm onEntryCreated={handleEntryCreated} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;
