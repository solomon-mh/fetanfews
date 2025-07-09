import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logout } from "../../api/auth";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const { user, setUser } = useAuth();
  console.log("user");
  console.log(user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await Logout();
    setUser(null);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/nearest-pharmacies", label: "Nearest Pharmacies" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/pharmacy-registration/help", label: "Register Pharmacy" },
  ];

  return (
    <header className="fixed w-full dark:bg-gray-900 backdrop-blur-lg dark:text-white shadow-md">
      <div className="mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-green-700 dark:text-lime-300"
        >
          fetanfews
        </Link>
        <div className="md:flex gap-4">
          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-green-600 dark:hover:text-lime-400 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  title={user?.first_name}
                  className="hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/user/login"
                  className="hover:text-green-600 dark:hover:text-lime-400 transition"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl hover:text-yellow-500 dark:hover:text-yellow-300 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-3xl focus:outline-none text-gray-700 dark:text-white transition"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-6 py-4 space-y-4 text-sm font-medium  dark:bg-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block hover:text-green-600 dark:hover:text-lime-400"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="block hover:text-red-600 dark:hover:text-red-400"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/user/login"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-green-600 dark:hover:text-lime-400"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
