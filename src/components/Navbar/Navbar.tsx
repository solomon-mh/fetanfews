import "./Navbar.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header-overlay">
        <div className="header-content">
          <h1 className="header-title">
            Find Drugs & Pharmacies <br /> Near You
          </h1>
          <p className="header-subtitle">
            Quick and easy access to essential medicines, just a search away.
          </p>
          <form className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Search for drugs or pharmacies..."
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
