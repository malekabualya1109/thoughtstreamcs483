// src/components/Dashboard.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <div>Welcome to your Dashboard!</div>;
};

export default Dashboard;

