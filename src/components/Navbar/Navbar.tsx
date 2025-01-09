import "./Navbar.scss";
import { Link } from "react-router-dom";
const Header = () => {
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
            <Link className="link" to="/services">
              Services
            </Link>
          </li>
          <li>
            <Link className="link" to="/contact">
              Contact
            </Link>
          </li>
          <li>
            <Link className="link" to="/user/login">
              Login
            </Link>
          </li>
        </ul>
      </nav>
     
    </header>
  );
};

export default Header;
