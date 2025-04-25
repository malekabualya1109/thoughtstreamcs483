import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <header>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </header>

      {/* Add WeatherWidget, NewEntryForm, DiaryList here */}
      <p>Dashboard content coming soon...</p>
    </div>
  );
};

export default Dashboard;
