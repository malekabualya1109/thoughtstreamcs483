import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/index.css";

const WeatherWidget = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      axios.get(url)
        .then((response) => {
          setWeather(response.data);
        })
        .catch((err) => {
          setError("Failed to fetch weather data.");
        });
    }
  }, [location]);

  if (error) {
    return <div>{error}</div>;
  }
  if (weather) {
    return (
      <div className="WeatherWidget">
        <h3>Weather in {weather.name}</h3>
        <p className="condition">{weather.weather[0].description}</p>
        <p className="temp">{weather.main.temp}°C</p>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default WeatherWidget;
