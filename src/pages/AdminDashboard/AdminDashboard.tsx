import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.scss";
import {
  Group as GroupIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  SettingsRounded as SettingsRoundedIcon,
} from "@mui/icons-material";

const AdminHome: React.FC = () => {
  return (
    <div className="dashboard-index">
      <h1 className="welcome">Welcome to Admin Dashboard</h1>
      <p className="subtitle">Manage pharmacies, drugs, users, and analytics effectively.</p>

      <div className="quick-links">
        <div className="card">
          <Link to="/admin/pharmacies" className="link">
            <GroupIcon className="icon" />
            <h3>Manage Pharmacies</h3>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/drugs" className="link">
            <EditIcon className="icon" />
            <h3>Manage Drugs</h3>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/users" className="link">
            <GroupIcon className="icon" />
            <h3>Manage Users</h3>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/analytics" className="link">
            <AssessmentIcon className="icon" />
            <h3>Search Analytics</h3>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/settings" className="link">
            <SettingsRoundedIcon className="icon" />
            <h3>Settings</h3>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/profile" className="link">
            <AccountCircleIcon className="icon" />
            <h3>Profile</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
