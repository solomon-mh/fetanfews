import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import pharmacistImage from "../../assets/images/pharmacist1.svg"; // Update the path as needed
import "./HeroSection.scss";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const frequentlySearchedDrugs = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Metformin",
    "Aspirin",
  ];

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Drugs & Pharmacies <br /> Near You, in Bahir Dar
          </h1>
          <p className="hero-subtitle">
            We have all the drugs your doctor prescribed for your health and
            what’s more, we can get it to you.
          </p>
          <SearchBar onSearch={handleSearch} />

          {/* Frequently Searched Drugs */}
          <div className="frequently-searched">
            <h2 className="frequently-searched-title">Frequently Searched Drugs</h2>
            <ul className="frequently-searched-list">
              {frequentlySearchedDrugs.map((drug) => (
                <li
                  key={drug}
                  className="drug-item"
                  onClick={() => handleSearch(drug)}
                >
                  {drug}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="hero-image-container">
        <img src={pharmacistImage} alt="Hero" className="hero-image" />
      </div>
    </div>
  );
};

export default HeroSection;
