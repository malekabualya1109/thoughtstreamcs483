import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("login-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Store the JWT token in localStorage for later use
          localStorage.setItem('token', data.token);
          // Call the login function from AuthContext to update your app state
          login(data.token, data.user);
        }
      })
      .catch((error) => console.error('Error during authentication:', error));
  };
  

  return (
    <div>
      <h1>Welcome to ThoughtStream</h1>
      <div id="login-button"></div>
    </div>
  );
};

export default Login;