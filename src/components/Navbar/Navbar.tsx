import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/nearby-pharmacies", label: "Nearest Pharmacies" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/pharmacy-registration/help", label: "Register Pharmacy" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 shadow-sm backdrop-blur-md"
          : "bg-white dark:bg-gray-900"
      } transition-all duration-300`}
    >
      <div className="mx-auto flex items-center justify-between px-6 lg:px-12 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 dark:from-lime-300 dark:to-emerald-400 bg-clip-text text-transparent"
        >
          <motion.span className="inline-block">fetanfews</motion.span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <motion.li
                key={link.to}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`relative px-1 py-2 ${
                    location.pathname === link.to
                      ? "text-green-600 dark:text-lime-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-lime-400"
                  } transition-colors`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600 dark:bg-lime-400"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}

            {user ? (
              <motion.li
                className="flex items-center gap-2"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-lg text-green-600 dark:text-lime-400" />
                  <span className="text-sm dark:text-white">
                    {user.first_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <FiLogOut className="text-sm" />
                </button>
              </motion.li>
            ) : (
              <motion.li whileHover={{ y: -2 }}>
                <Link
                  to="/user/login"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 dark:from-lime-500 dark:to-emerald-400 text-white font-medium hover:shadow-lg transition-all"
                >
                  Login
                </Link>
              </motion.li>
            )}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4 text-sm font-medium border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              {navLinks.map((link) => (
                <motion.div
                  key={link.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 px-2 rounded-lg ${
                      location.pathname === link.to
                        ? "bg-green-50 dark:bg-gray-800 text-green-600 dark:text-lime-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-green-600 dark:text-lime-400" />
                    <span>{user.first_name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/user/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 dark:from-lime-500 dark:to-emerald-400 text-white font-medium hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
