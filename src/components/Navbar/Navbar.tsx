import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logout } from "../../api/auth";
const Header = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await Logout()

  }
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">MedLocator</div>
        <ul className="navbar-links">
          <li>
            <Link className="link" to="/admin">
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
            {user ? (
              <Link className="link" to='' onClick={handleLogout} title={user.first_name}>
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
