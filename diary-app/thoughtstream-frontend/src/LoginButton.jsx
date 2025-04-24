// button to trigger login
import React from 'react';
import { GoogleLogin } from 'react-google-login';  // Import the Google Login component
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const GoogleLoginButton = () => {
  const { login } = useContext(AuthContext);  // Using context to update global auth state
  
  const responseGoogle = async (response) => {
    if (response.tokenId) {
      try {
        // Send the Google token to your backend
        const { data } = await axios.post('http://localhost:5000/api/auth/google', {
          token: response.tokenId,  // The token from Google
        });
        
        // Assuming your backend sends back the JWT
        login(data.token, data.user);  // Store JWT and user data in the AuthContext
      } catch (error) {
        console.error("Error logging in with Google", error);
      }
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"  // Replace with your Google Client ID
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleLoginButton;
