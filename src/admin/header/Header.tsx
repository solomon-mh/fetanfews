import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "@mui/material";
import { ColorContext } from "../../contexts/ColorContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../api/auth";

interface propTypes {
  onToggleSidebar: () => void;
  onToggleSidebarShrunk: () => void;
}

const Header: React.FC<propTypes> = ({
  onToggleSidebar,
  onToggleSidebarShrunk,
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { darkMode, dispatch } = useContext(ColorContext);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  const handleToggle = () => onToggleSidebar();
  const handleToggleShrunk = () => {
    setIsFullscreen(!isFullscreen);
    onToggleSidebarShrunk();
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const fetchNotifications = async () => {
    // Simulate notification logic
    setNotificationList([]);
    setUnreadNotifications(0);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationIconClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const markNotificationsAsRead = async () => {
    setUnreadNotifications(0);
    setOpen(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo & Menu */}
      <div className="flex items-center space-x-4">
        <div className="ld:hidden">
          <MenuIcon
            className="text-gray-700 dark:text-gray-200 cursor-pointer"
            onClick={handleToggle}
          />
        </div>
        <Link
          to="/admin/dashboard"
          className="text-xl hidden lg:block font-bold text-indigo-600 dark:text-indigo-400"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* User & Controls */}
      <div className="flex items-center space-x-4 text-sm font-medium">
        {user ? (
          <div className="hidden md:dislay">
            <span className="text-gray-700 dark:text-gray-300">
              WELCOME, {user.first_name.toUpperCase()}
            </span>
            <Link to="/" className="text-indigo-500 hover:underline">
              VIEW SITE
            </Link>
            <span>/</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              LOGOUT
            </button>
            <span>/</span>
            <Link
              to="/admin/change-password"
              className="text-indigo-500 hover:underline"
            >
              CHANGE PASSWORD
            </Link>
          </div>
        ) : (
          <Link to="/admin/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        )}

        {/* Theme toggle */}
        <button onClick={() => dispatch({ type: "TOGGLE" })}>
          {darkMode ? (
            <LightModeIcon className="text-yellow-400 hover:text-yellow-300" />
          ) : (
            <DarkModeIcon className="text-gray-700 hover:text-gray-900" />
          )}
        </button>

        {/* Fullscreen toggle */}
        <button onClick={handleToggleShrunk}>
          {isFullscreen ? (
            <FullscreenIcon className="text-gray-700 dark:text-gray-200" />
          ) : (
            <FullscreenExitIcon className="text-gray-700 dark:text-gray-200" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <NotificationsNoneIcon
            onClick={handleNotificationIconClick}
            className="text-gray-700 dark:text-gray-200 cursor-pointer"
          />
          {unreadNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notification-modal-title"
      >
        <div className="absolute top-1/2 left-1/2 w-96 bg-white rounded-lg shadow-xl p-6 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-xl font-bold mb-4" id="notification-modal-title">
            Notifications
          </h2>
          {notificationList.length > 0 ? (
            notificationList.map((notification, index) => (
              <div key={index} className="mb-2 text-gray-700">
                {notification}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No new notifications</p>
          )}
          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={handleClose} variant="outlined" color="primary">
              Close
            </Button>
            {notificationList.length > 0 && (
              <Button
                onClick={markNotificationsAsRead}
                variant="contained"
                color="primary"
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
