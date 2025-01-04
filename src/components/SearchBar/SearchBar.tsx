import  React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // Importing a search icon
import './SearchBar.scss'
interface SearchBarProps {
    onSearch: (searchTerm: string) => void; // Type definition for the onSearch prop
  }
const SearchBar:React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        handleSearch();
      }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for medacation name or drug name..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </div>
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
