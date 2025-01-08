import React, { useState, useCallback } from "react";
import { FiSearch, FiMapPin, FiTag } from "react-icons/fi"; // Importing relevant icons
import "./SearchBar.scss";
import { useNavigate } from "react-router-dom";
import { pharmacies } from "../../data/pharmacies";
import { debounce } from "../../utils/debounce";
import { highlightText } from "../../utils/highlightText";
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [drugName, setDrugName] = useState<string>("");
  const [pharmacyName, setPharmacyName] = useState<string>("");
  const [drugSuggestions, setDrugSuggestions] = useState<any[]>([]);
  const [pharmacySuggestions, setPharmacySuggestions] = useState<any[]>([]);

  const queryParams = new URLSearchParams();
  if (pharmacyName) queryParams.append("pharmacy", pharmacyName);
  if (drugName) queryParams.append("medication", drugName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (e.target.name === "pharmacy") {
      setPharmacyName(input);
      debouncedFilterPharmacy(input);
    } else if (e.target.name === "medication") {
      setDrugName(input);
      debouncedFilterMedication(input);
    }
  };

  const debouncedFilterPharmacy = useCallback(
    debounce((input: string) => {
      if (input) {
        const filteredPharmacy = pharmacies.filter((pharmacy) =>
          pharmacy.pharmacy_name.toLowerCase().includes(input.toLowerCase())
        );
        setPharmacySuggestions(filteredPharmacy);
      } else {
        setPharmacySuggestions([]);
      }
    }, 300),
    [pharmacies] // Dependencies
  );

  const debouncedFilterMedication = useCallback(
    debounce((input: string) => {
      if (input) {
        const allDrugs = pharmacies.flatMap(
          (pharmacy) => pharmacy.available_drugs
        );
        const filteredDrug = allDrugs.filter((drug) =>
          drug.name.toLowerCase().includes(input.toLowerCase())
        );
        setDrugSuggestions(filteredDrug);
      } else {
        setDrugSuggestions([]);
      }
    }, 300),
    [pharmacies] // Dependencies
  );

  const handleSuggestionClick = (value: any) => {
    if (value.pharmacy_name) {
      setPharmacyName(value.pharmacy_name);
      setPharmacySuggestions([]);
    } else {
      setDrugName(value.name);
      setDrugSuggestions([]);
    }
  };
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
          aria-autocomplete="list"
          aria-controls="pharmacy-suggestions"
          aria-expanded={pharmacySuggestions.length > 0}
          aria-activedescendant=""
          value={pharmacyName}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          name="pharmacy"
        />
        {pharmacySuggestions.length > 0 && (
          <ul className="suggestions">
            {pharmacySuggestions.map((pharmacy, index) => (
          <li
          key={index}
          onClick={() => handleSuggestionClick(pharmacy)}
          dangerouslySetInnerHTML={{
            __html: highlightText(pharmacy.pharmacy_name, pharmacyName),
          }}
        />
            ))}
          </ul>
        )}
      </div>
      <div className="search-input-container">
        <FiTag className="input-icon" />

        <input
          type="text"
          className="search-input"
          placeholder=" search with Medication or drug category"
          value={drugName}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          name="medication"
        />
        {drugSuggestions.length > 0 && (
          <ul id="pharmacy-suggestions" role="listbox" className="suggestions">
            {drugSuggestions.map((drug, index) => (
              <li key={index} onClick={() => handleSuggestionClick(drug)}>
                {drug.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="search-button" onClick={handleSearch}>
        <FiSearch className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;
