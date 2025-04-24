import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WEATHER_API = process.env.WEATHER_API;
const WEATHER_FORECAST_API = process.env.WEATHER_FORECAST_API;
const WEATHER_KEY = process.env.WEATHER_KEY;

// Function to fetch current weather data from OpenWeather API
export const fetchWeather = async (city) => {
  const apiURL = `${WEATHER_API}?q=${city}&appid=${WEATHER_KEY}&units=imperial`;

  try {
    // Sending GET request to fetch weather data
    const response = await axios.get(apiURL);

    // Returning the weather data received from the API
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw new Error('Unable to fetch weather data');
  }
};

// Function to fetch the 5-day weather forecast data from OpenWeather API
export const fetchForecast = async (city) => {
  const apiURL = `${WEATHER_FORECAST_API}?q=${city}&appid=${WEATHER_KEY}&units=imperial`;

  try {
    // Sending GET request to fetch weather forecast data
    const response = await axios.get(apiURL);

    // Returning the forecast data received from the API
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    throw new Error('Unable to fetch forecast data');
  }
};
