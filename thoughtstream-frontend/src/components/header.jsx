import React from 'react';
import "../styles/index.css";

const Header = ({ user, logout }) => {
  return (
    <div className="headerArea">
        <h2>Welcome, {user?.name}</h2>
        <button className= "headerButton" onClick={logout}>logout</button>
    </div> 
  );
};

export default Header;