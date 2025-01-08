import React, { useState } from "react";
import { FiSearch, FiMapPin, FiTag } from "react-icons/fi"; // Importing relevant icons
import "./SearchBar.scss";
import { useNavigate } from "react-router-dom";
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [drugName, setDrugName] = useState<string>("");
  const [pharmacyName, setPharmacyName] = useState<string>("");
  const queryParams = new URLSearchParams();
  if (pharmacyName) queryParams.append("pharmacy", pharmacyName);
  if (drugName) queryParams.append("medication", drugName);
  const handleSearch = () => {
    navigate(`/search-results/?${queryParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <FiMapPin className="input-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="search with pharmacy's name"
          value={pharmacyName}
          onChange={(e) => setPharmacyName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="search-input-container">
        <FiTag className="input-icon" />

        <input
          type="text"
          className="search-input"
          placeholder=" search with Medication or drug category"
          value={drugName}
          onChange={(e) => setDrugName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <button className="search-button" onClick={handleSearch}>
        <FiSearch className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;
