import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logout } from "../../api/auth";
import { useEffect } from "react";
const Header = () => {
  const { user,setLoggedin,loggedin } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

    if (storedUser) {

      setLoggedin(true);
    }
  }, [setLoggedin]);
  
  const handleLogout = async () => {
    await Logout()
    setLoggedin(false);

  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">MedLocator</div>
        <ul className="navbar-links">
          <li>
            <Link className="link" to="/admin/dashboard">
              AdminPage
            </Link>
          </li>
          <li>
            <Link className="link" to="/pharmacy-registration/help">
              Registor pharmacy
            </Link>
          </li>
          <li>
            <Link className="link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="link" to="/about">
              About
            </Link>
          </li>

          <li>
            {loggedin ? (
              <Link className="link" to='' onClick={handleLogout} title={user?.first_name}>
                Logout 
              </Link>
            ) : (
              <Link className="link" to="/user/login">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
