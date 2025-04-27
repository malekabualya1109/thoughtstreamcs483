import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  console.log("Inside api.js, token is =", token); 

  if (token) {
    console.log("Adding Authorization header to the request with token.");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage");
  }

  return config;
}, (error) => {
  console.error("Request error:", error);  
  return Promise.reject(error);
});



export default api;
