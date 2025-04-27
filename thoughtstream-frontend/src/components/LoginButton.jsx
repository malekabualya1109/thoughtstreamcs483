import React from 'react';
import "../styles/index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-regular-svg-icons';
const LoginButton = ({ user, logout }) => {
  return (
    <div className="thoughtStream">
        <FontAwesomeIcon icon={faSun} className="sun" />
        <h2>Welcome to</h2>
        <h3>ThoughtStream</h3>
        <div id="login-button"></div>   
    </div> 
  );
};

export default LoginButton;