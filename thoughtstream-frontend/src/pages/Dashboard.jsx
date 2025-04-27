import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/header";
import WeatherWidget from "../components/WeatherWidget.jsx";
import FlowerAnimation from "../components/FlowersAnimation.jsx"; 
import DiaryEntryCard from "../components/DiaryEntryCard";
import DiaryList from "../components/DiaryList"; 

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  return (
      <div className="dashboard">
        {/*Calling header */}
        <Header user={user} logout={logout} />

        {/*Inner dash has the four grid components*/} 
        <div className="innerDash">
          <section className="section1">
            <WeatherWidget />
          </section>
          <section className="section2">
            <DiaryEntryCard />
          </section>
          <section className="section3">
            <DiaryList /> 
          </section>
          <section className="section4">
            <FlowerAnimation />
          </section>
        </div>
      </div>
    );
  };

export default Dashboard;