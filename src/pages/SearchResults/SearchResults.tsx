import React from "react";
import { useLocation} from "react-router-dom";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import "./SearchResults.scss";
import HeroSection from "../../components/HeroSection/HeroSection";

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  // Extract search results passed through state
  const { searchResults } = location.state || { searchResults: [] };

  return (
    <div className="search-results-page">
      <HeroSection />

      <h2 className="section-title">{searchResults.length} pharmacies found</h2>
      {searchResults.length > 0 ? (
        <PharmacyList
          pharmacies={searchResults}
          calculateDistance={calculateDistance}
        />
      ) : (
        <p className="no-results">
          No results found. Please refine your search.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
