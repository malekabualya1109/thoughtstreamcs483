import React, { useState } from 'react';
import axios from 'axios';
import "../styles/index.css";

const CreateNewDiaryEntry = ({ onEntryCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reflection: '',
    tags: '',
    location: '',
  });

    
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
      await axios.post('/api/diary', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setFormData({ title: '', content: '', reflection: '', tags: '', location: '' });
      onEntryCreated();
    } catch (error) {
      console.error("Failed to create diary entry", error.response?.data || error.message);
    }
  };

  return (
    <div className="newEntryForm">
      <h2>New Diary Entry</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="column">
        <input
          className="titleOfForm"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="formContent"
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <textarea
          className="formReflection"
          name="reflection"
          placeholder="Reflection (Optional)"
          value={formData.reflection}
          onChange={handleChange}
        />
        <input
          className="tagForm"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <input
          className="locationForm"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        </div>
        <div className="vertical">
        <button className="submitButton" type="submit">Create Entry</button>
        <button className="cancelButton" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewDiaryEntry;
