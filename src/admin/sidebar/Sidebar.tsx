import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  SettingsRounded as SettingsRoundedIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  onLinkClick: () => void;
  isShrunk: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, isShrunk }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  const menuItemClasses = (path: string) =>
    `flex items-center gap-3 p-3 rounded-md transition hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer 
		${
      isActive(path)
        ? "bg-indigo-200 dark:bg-indigo-700 font-semibold"
        : "text-gray-700 dark:text-gray-300"
    }`;

  const sectionTitle =
    "px-4 mt-6 mb-2 text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400";

  return (
    <div
      className={`h-full bg-white dark:bg-gray-900 text-sm border-r dark:border-gray-700 
			transition-all duration-300 ease-in-out ${
        isShrunk ? "w-20" : "w-64"
      } overflow-y-auto`}
    >
      <ul className="pt-4">
        {/* MAIN */}
        <p className={sectionTitle}>Main</p>
        <Link to="/admin/dashboard" onClick={onLinkClick}>
          <li className={menuItemClasses("/admin/dashboard")}>
            <DashboardIcon className="text-lg" />
            {!isShrunk && <span>Dashboard</span>}
          </li>
        </Link>

        {/* PHARMACY SECTION */}
        {user?.role === "admin" && (
          <>
            <p className={sectionTitle}>Pharmacies</p>
            <Link to="/admin/manage-pharmacies" onClick={onLinkClick}>
              <li className={menuItemClasses("/admin/manage-pharmacies")}>
                <GroupIcon className="text-lg" />
                {!isShrunk && <span>Manage Pharmacies</span>}
              </li>
            </Link>
            <Link to="/admin/manage-pharmacists" onClick={onLinkClick}>
              <li className={menuItemClasses("/admin/manage-pharmacists")}>
                <GroupIcon className="text-lg" />
                {!isShrunk && <span>Pharmacists</span>}
              </li>
            </Link>
          </>
        )}

        {/* DRUGS SECTION */}
        <p className={sectionTitle}>Drugs</p>
        <Link to="/admin/manage-categories" onClick={onLinkClick}>
          <li className={menuItemClasses("/admin/manage-categories")}>
            <EditIcon className="text-lg" />
            {!isShrunk && <span>Drug Category</span>}
          </li>
        </Link>
        <Link to="/admin/manage-drugs" onClick={onLinkClick}>
          <li className={menuItemClasses("/admin/manage-drugs")}>
            <EditIcon className="text-lg" />
            {!isShrunk && <span>Manage Drugs</span>}
          </li>
        </Link>

        {/* USERS (ADMIN ONLY) */}
        {user?.role === "admin" && (
          <>
            <p className={sectionTitle}>Users</p>
            <Link to="/admin/users" onClick={onLinkClick}>
              <li className={menuItemClasses("/admin/users")}>
                <GroupIcon className="text-lg" />
                {!isShrunk && <span>View Users</span>}
              </li>
            </Link>
          </>
        )}

        {/* REPORTS */}
        <p className={sectionTitle}>Reports</p>
        <Link
          to={
            user?.role === "pharmacist"
              ? "/admin/pharmacist/reports"
              : "/admin/reports"
          }
          onClick={onLinkClick}
        >
          <li
            className={menuItemClasses(
              user?.role === "pharmacist"
                ? "/admin/pharmacist/reports"
                : "/admin/reports"
            )}
          >
            <AssessmentIcon className="text-lg" />
            {!isShrunk && <span>Reports</span>}
          </li>
        </Link>

        {/* SETTINGS */}
        <p className={sectionTitle}>Settings</p>
        <Link to="/admin/pharmacist/settings" onClick={onLinkClick}>
          <li className={menuItemClasses("/admin/pharmacist/settings")}>
            <SettingsRoundedIcon className="text-lg" />
            {!isShrunk && <span>Settings</span>}
          </li>
        </Link>
        <Link to="/admin/profile" onClick={onLinkClick}>
          <li className={menuItemClasses("/admin/profile")}>
            <AccountCircleIcon className="text-lg" />
            {!isShrunk && <span>Profile</span>}
          </li>
        </Link>

        {/* LOGOUT (You can wire this later to actual logic) */}
        <li
          className="flex items-center gap-3 p-3 mt-6 hover:bg-red-100 dark:hover:bg-red-700 text-red-500 cursor-pointer"
          onClick={() => console.log("Log out clicked")}
        >
          <LogoutIcon className="text-lg" />
          {!isShrunk && <span>Log Out</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
