import axios from "axios";

console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

});

<<<<<<< HEAD
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    console.log("Inside api.js, token is =", token); 
    
    if (token) {
      console.log("Adding Authorization header to the request with token.");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No token found in localStorage");
    }

    return config;  // This was missing in your original code
  },
  (error) => {
    console.error("Request error:", error);  
    return Promise.reject(error);
  }
);
=======
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
>>>>>>> f9fc8c5a11c7fd88942cc68ed53e92cfff69ccab





export default api;

