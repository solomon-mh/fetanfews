import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  SettingsRounded as SettingsRoundedIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { ColorContext } from "../../contexts/ColorContext";
import { useLocation } from "react-router-dom";
// import { AuthContext } from '../../contexts/AuthContext';
interface SidebarProps {
  onLinkClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const { pathname } = useLocation();
  const { darkMode } = useContext(ColorContext);
  const colorStyle: React.CSSProperties = {
    color: darkMode ? "#fff" : "#000",
  };
  // const {logout} = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div className="links">
        <ul>
          <p className="spann">Main</p>
          <Link to="/" style={{ textDecoration: "none" }} onClick={onLinkClick}>
            <li className={pathname === "/" ? "active-link" : ""}>
              <DashboardIcon className="icon" /> Home
            </li>
          </Link>

          <p className="spann">Pharmacies</p>
          <Link
            to="/admin/manage-pharmacies"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li  className={pathname === "/admin/manage-pharmacies" ? "active-link" : ""}>
              <GroupIcon className="icon" /> Manage Pharmacies
            </li>
          </Link>

          <p className="spann">Drugs</p>
          <Link
            to="/admin/drugs"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/drugs" ? "active-link" : ""}>
              <EditIcon className="icon" /> Manage Drugs
            </li>
          </Link>

          <p className="spann">Users</p>
          <Link
            to="/admin/users"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/users" ? "active-link" : ""}>
              <GroupIcon className="icon" /> Manage Users
            </li>
          </Link>

          <p className="spann">Analytics</p>
          <Link
            to="/admin/analytics"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/analytics" ? "active-link" : ""}>
              <AssessmentIcon className="icon" /> Search Analytics
            </li>
          </Link>

          <p className="spann">Reports</p>
          <Link
            to="/admin/reports"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/reports" ? "active-link" : ""}>
              <AssessmentIcon className="icon" /> Reports
            </li>
          </Link>

          <p className="spann">Settings</p>
          <Link
            to="/admin/settings"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/settings" ? "active-link" : ""}>
              <SettingsRoundedIcon className="icon" /> Settings
            </li>
          </Link>

          <Link
            to="/admin/profile"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/profile" ? "active-link" : ""}>
              <AccountCircleIcon className="icon" /> Profile
            </li>
          </Link>

          <li >
            <LogoutIcon className="icon" /> Log Out
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
