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
import { useAuth } from "../../contexts/AuthContext";
// import { AuthContext } from '../../contexts/AuthContext';
interface SidebarProps {
  onLinkClick: () => void;
  isShrunk: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, isShrunk }) => {
  const { pathname } = useLocation();
  const { darkMode } = useContext(ColorContext);
  const colorStyle: React.CSSProperties = {
    color: darkMode ? "#fff" : "#000",
  };
  const { user } = useAuth();
  return (
    <div className={`sidebar ${isShrunk ? "shrunk" : ""}`}>
      <div className="links">
        <ul>
          <p className="spann">Main</p>

          <Link
            to="admin/dashboard"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li
              className={
                pathname === "/admin/dashboard" ||
                pathname === "/admin/pharmacies" ||
                pathname === "/admin/pharmacy/medications"
                  ? "active-link"
                  : ""
              }
            >
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          {user?.role === "admin" && (
            <>
              <p className="spann">Pharmacies</p>
              <Link
                to="/admin/manage-pharmacies"
                style={{ textDecoration: "none" }}
                onClick={onLinkClick}
              >
                <li
                  className={
                    pathname === "/admin/manage-pharmacies" ? "active-link" : ""
                  }
                >
                  <GroupIcon className="icon" />
                  <span>Manage Pharmacies</span>
                </li>
              </Link>
              <Link
                to="/admin/manage-pharmacists"
                style={{ textDecoration: "none" }}
                onClick={onLinkClick}
              >
                <li
                  className={
                    pathname === "/admin/manage-pharmacists"
                      ? "active-link"
                      : ""
                  }
                >
                  <GroupIcon className="icon" />
                  <span>Pharmicists</span>
                </li>
              </Link>
            </>
          )}
          <p className="spann">Drugs</p>
          <Link
            to="/admin/manage-categories"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li
              className={
                pathname === "/admin/manage-categories" ? "active-link" : ""
              }
            >
              <EditIcon className="icon" />
              <span>Drug Category</span>
            </li>
          </Link>
          <Link
            to="/admin/manage-drugs"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li
              className={
                pathname === "/admin/manage-drugs" ? "active-link" : ""
              }
            >
              <EditIcon className="icon" />
              <span>Manage Drugs</span>
            </li>
          </Link>
          {user?.role === "admin" && (
            <>
              <p className="spann">Users</p>
              <Link
                to="/admin/users"
                style={{ textDecoration: "none" }}
                onClick={onLinkClick}
              >
                <li
                  className={pathname === "/admin/users" ? "active-link" : ""}
                >
                  <GroupIcon className="icon" />
                  <span>View Users</span>
                </li>
              </Link>
            </>
          )}
       

          <p className="spann">Reports</p>
          <Link
            to="/admin/reports"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li
              className={
                pathname === "/admin/reports"
                  ? "active-link"
                  : ""
              }
            >
              <AssessmentIcon className="icon" />
              <span>Reports</span>
            </li>
          </Link>

        

          <p className="spann">Settings</p>
          <Link
            to="/admin/settings"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/settings" ? "active-link" : ""}>
              <SettingsRoundedIcon className="icon" />
              <span>Settings</span>
            </li>
          </Link>

          <Link
            to="/admin/profile"
            style={{ textDecoration: "none" }}
            onClick={onLinkClick}
          >
            <li className={pathname === "/admin/profile" ? "active-link" : ""}>
              <AccountCircleIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>

          <li>
            <LogoutIcon className="icon" />
            <span>Log Out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
