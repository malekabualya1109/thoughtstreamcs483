import React from 'react';
import "../styles/index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-regular-svg-icons';

const Header = ({ user, logout }) => {
  return (
       <div className="headerArea">
            <div className="leftContent">
              <FontAwesomeIcon icon={faSun} className="sun1" />
              <h2>Welcome, {user?.name}</h2>
            </div>
            <button className="headerButton" onClick={logout}>logout</button>
        </div> 
  );
};

export default Header;