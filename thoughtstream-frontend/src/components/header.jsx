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

<<<<<<< HEAD
export default Header;
=======
export default Header;
>>>>>>> f9fc8c5a11c7fd88942cc68ed53e92cfff69ccab
