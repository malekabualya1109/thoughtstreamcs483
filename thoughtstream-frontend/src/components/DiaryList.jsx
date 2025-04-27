import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/index.css";
import api from "../services/api";


const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reflection: '',
    tags: '',
    location: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('jwt');
      console.log("Token fetched:", token); // Check token in console
      
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
      console.log("Token fetched:", token); 
  
      await axios.post('/api/diary', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      setShowModal(false);
      setFormData({ title: '', content: '', reflection: '', tags: '', location: '' });
      fetchEntries();
    } catch (error) {
      console.error("Failed to create diary entry", error.response?.data || error.message);
    }
  };

  return (
    <div className="diaryEntryList">
      <button onClick={() => setShowModal(true)} className="newEntryButton">
        + New Diary Entry
      </button>
      <div className="entryListContainer">
  {entries.length > 0 ? (
    entries.map(entry => {
      console.log("Entry:", entry); 
      return (
        <div key={entry._id} className="diaryEntryCard">
          <h3>{entry.title}</h3>
        </div>
      );
    })
  ) : (
    <p>No diary entries yet!</p>
  )}
</div>
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>New Diary Entry</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                required
              />
              <textarea
                name="reflection"
                placeholder="Reflection (Optional)"
                value={formData.reflection}
                onChange={handleChange}
              />
              <input
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleChange}
              />
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <button type="submit">Create Entry</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;
