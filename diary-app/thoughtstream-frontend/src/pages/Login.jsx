import React, { useEffect } from "react";

const Login = () => {
  // Callback function to handle the Google response
  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: ", response.credential);
    
    // Send the token to your backend for verification
    fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: response.credential,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("User authenticated successfully:", data);
          // Handle successful login (e.g., redirect to a dashboard)
          localStorage.setItem("token", data.jwt);
          

        } else {
          console.error("Authentication failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
      });
  };

  useEffect(() => {
    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Fetch Client ID from environment variables
      callback: handleCredentialResponse, // Callback function
    });

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return <div id="googleSignInButton" style={{ marginTop: "20px" }}></div>;
};

export default Login;
