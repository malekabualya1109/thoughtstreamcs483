import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.WEATHER_API;

/**
 * Fetches weather data from OpenWeather API for a given location.
 * @param {string} location - The city or city,country format (e.g., "Portland" or "Seattle,US")
 * @returns {Object|null} Weather info or null if the request fails
 */
export const fetchWeather = async (location) => {
  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: location,
        appid: API_KEY,
        units: "imperial" // Fahrenheit
      }
    });

    const data = response.data;

    return {
      condition: data.weather[0].main, // e.g., "Cloudy"
      temperature: data.main.temp,     // Fahrenheit
      location: data.name              // Cleaned up city name
    };
  } catch (error) {
    console.error("Weather fetch failed:", error.message);
    return null; // Let diary entry still save if weather fails
  }
};
