import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import "./SearchResults.scss";
import HeroSection from "../../components/HeroSection/HeroSection";
import { Search } from "../../utils/handleSearch";

const SearchResultsPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const drugName = searchParams.get("medication");
    const pharmacyName = searchParams.get("pharmacy");

    if (!drugName?.trim() && !pharmacyName?.trim()) {
      navigate("/"); 
      return;
    }

    // Call Search function
    const results = Search({ drugName, pharmacyName });

    setSearchResults(results);
    setIsLoading(false);
  }, [searchParams, navigate]);

  return (
    <div className="search-results-page">
      <HeroSection />

      {isLoading ? (
        <p>Loading...</p>
      ) : searchResults.length > 0 ? (
        <>
          <h2 className="section-title">
            {searchResults.length} pharmacies found
          </h2>
          <PharmacyList
            pharmacies={searchResults}
            calculateDistance={calculateDistance}
          />
        </>
      ) : (
        <p className="no-results">
          No results found. Please refine your search.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
