// src/components/FlowerAnimation.jsx
import React from 'react';
import "../styles/index.css"


const DiaryEntryCard = ({ entry, onClose, onEdit, onDelete }) => {
  if (!entry) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{entry.title}</h2>
        <div className = "box1">
          <div className="content"><strong>Content:</strong></div> 
          <div className="actualContent">{entry.content}</div>
        </div> 
        <div className="box2">
          <div className="reflection"><strong>Reflection:</strong> </div>
          <div className="actualReflection">{entry.reflection || "No reflection added."}</div>
        </div>
        <div className="box2">
          <div className="tags"><strong>Tags:</strong> </div>
          <div className="actualTags">{entry.tags?.join(", ") || "No tags."}</div>
        </div>
        <div className="box2">
          <div className="location"><strong>Location:</strong></div>
          <div className="actualLocation">{entry.location || "No location provided."}</div>
        </div>
        <div className="box2">
          <div className="weather"><strong>Weather:</strong> </div> 
          <div className="actualWeather">
        {entry.weather ? (
            <>
              <span>{entry.weather.condition}</span>, <span>{entry.weather.temperature}</span> in <span>{entry.weather.location}</span>
            </>
          ) : (
            "Weather data unavailable."
          )}
        </div>
        </div>
        <div className="buttons">
          <button className="button1" onClick={onClose}>Close</button>
          <button className="button2" onClick={() => onEdit(entry)}>Edit</button>
          <button className="button3" onClick={() => onDelete(entry._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntryCard;
