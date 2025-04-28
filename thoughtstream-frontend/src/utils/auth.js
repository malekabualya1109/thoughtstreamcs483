// Get the stored JWT token
export const getAuthToken = () => {
  return localStorage.getItem("jwt");
};

// Save JWT token and user info
export const storeAuthData = (token, user) => {
  localStorage.setItem("jwt", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear stored auth data (on logout)
export const clearAuthData = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};

// Get the stored user object (parsed from string)
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
