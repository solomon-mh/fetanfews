import React, { useState } from "react";
import { FiSearch, FiMapPin, FiTag } from "react-icons/fi"; // Importing relevant icons
import "./SearchBar.scss";

interface SearchBarProps {
  onSearch: (searchCriteria: { name: string; location: string}) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ name, location });
    }
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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="search-input-container">
      <FiTag className="input-icon" />

        <input
          type="text"
          className="search-input"
          placeholder=" search with Medication or drug category"
          value={name}
          onChange={(e) => setName(e.target.value)}
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