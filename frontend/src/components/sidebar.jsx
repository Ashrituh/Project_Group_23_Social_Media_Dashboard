import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">SocialDashboard</h2>

      <nav>
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/feed" className="nav-item">Feed</Link>
        <Link to="/integrations" className="nav-item">Integrations</Link>
      </nav>
    </div>
  );
}
