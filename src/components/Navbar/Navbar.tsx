import "./Navbar.scss";
import pharmacistImage from "../../assets/images/pharmacist1.svg";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">PharmaFinder</div>
        <ul className="navbar-links">
          <li>
            <Link className="link" to="#home">
              Home
            </Link>
          </li>
          <li>
            <Link className="link" to="#about">
              About
            </Link>
          </li>
          <li>
            <Link className="link" to="#services">
              Services
            </Link>
          </li>
          <li>
            <Link className="link" to="#contact">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="header-content-wrapper">
        <div className="header-content">
          <h1 className="header-title">
            Find Drugs & Pharmacies <br /> Near You
          </h1>
          <p className="header-subtitle">
            We have all the drugs your doctor prescribed for your health and
            what’s more, we can get it to you.{" "}
          </p>
          <SearchBar onSearch={handleSearch} />
          {/* Frequently Searched Drugs Section */}
          <div className="frequently-searched">
            <h2 className="frequently-searched-title">
              Frequently Searched Drugs
            </h2>
            <ul className="frequently-searched-list">
              <li className="drug-item">Paracetamol</li>
              <li className="drug-item">Ibuprofen</li>
              <li className="drug-item">Amoxicillin</li>
              <li className="drug-item">Metformin</li>
              <li className="drug-item">Aspirin</li>
              <li className="drug-item">Atorvastatin</li>
            </ul>
          </div>
        </div>
        <div className="header-image-container">
          <img src={pharmacistImage} alt="Hero" className="header-image" />
        </div>
      </div>
    </header>
  );
};

export default Header;
