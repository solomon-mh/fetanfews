import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Welcome to MedLocator, your trusted platform for locating nearby pharmacies and drug availability. 
            Our mission is to make accessing essential medicines easy and convenient for everyone.
          </p>
        </div>
        <div className="footer-section">
          <h3>Our Services</h3>
          <ul>
            <li><a href="/find-drugs">Find Nearby Drugs</a></li>
            <li><a href="/pharmacy-locator">Pharmacy Locator</a></li>
            <li><a href="/order-online">Order Online</a></li>
            <li><a href="/consultation">Consult with Experts</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
         <li> <Link to="/about">About Us </Link></li>
           <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/services">Services </Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@medlocator.com</p>
          <p>Phone: +251 95323 7890</p>
          <p>Address: Bahir Dar, Ethiopia</p>
        </div>
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com/medlocator" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com/medlocator" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com/medlocator" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/medlocator" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://github.com/medlocator" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MedLocator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
