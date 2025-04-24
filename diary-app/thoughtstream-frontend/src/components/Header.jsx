//Site header with nax, maybe logout
// src/components/Header.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <h1>Welcome to ThoughtStream</h1>
      {user && (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </header>
  );
}

export default Header;
