import React from "react";
import Sidebar from "../components/sidebar";
import "./../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <h1>Welcome to Social Dashboard</h1>
        <p>Your connected accounts, feed, and stats in one place.</p>

        <div className="cards">
          <div className="card">Total Accounts Connected: 3</div>
          <div className="card">Feed Posts Today: 12</div>
          <div className="card">New Messages: 5</div>
        </div>
      </div>
    </div>
  );
}
