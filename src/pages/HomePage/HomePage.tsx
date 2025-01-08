import React, { useState } from "react";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
// import { useNavigate } from "react-router-dom";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import the styles
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
// interface Drug {
//   name: string;
// }

const HomePage: React.FC = () => {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [loadingProgress, setLoadingProgress] = useState<number>(0); // State for progress bar
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(
      pharmacies.flatMap((pharmacy) =>
        pharmacy.available_drugs.map((drug) => drug.category)
      )
    )
  );
  // const navigate = useNavigate();

  const filteredPharmacies = selectedCategory
    ? pharmacies.filter((pharmacy) =>
        pharmacy.available_drugs.some(
          (drug) => drug.category === selectedCategory
        )
      )
    : pharmacies;

  const visiblePharmacies = filteredPharmacies.slice(0, visibleCount);

  // const handleSearch = (searchCriteria: {
  //   drugName: string;
  //   pharmacyName: string;
  // }) => {
  //   setIsLoading(true);
  //   setLoadingProgress(0);

  //   const { drugName, pharmacyName } = searchCriteria;

  //   if (!drugName.trim() && !pharmacyName.trim()) {
  //     setSearchResults([]);
  //     setIsLoading(false);
  //     return;
  //   }

  //   const progressTimer = setInterval(() => {
  //     if (loadingProgress < 100) {
  //       setLoadingProgress((prev) => prev + 10);
  //     }
  //   }, 200);

  //   const results = pharmacies.filter((pharmacy) => {
  //     const pharmacyNameMatch = pharmacyName
  //       ? pharmacy.pharmacy_name
  //           .toLowerCase()
  //           .includes(pharmacyName.toLowerCase())
  //       : true;
  //     const drugNameMatch = drugName
  //       ? pharmacy.available_drugs.some((drug) =>
  //           drug.name.toLowerCase().includes(drugName.toLowerCase())
  //         )
  //       : true;
  //     return pharmacyNameMatch && drugNameMatch;
  //   });

  //   clearInterval(progressTimer);

  //   navigate("/search-results", { state: { searchResults: results } });
  // };

  const handleShowAll = () => {
    setVisibleCount(filteredPharmacies.length);
  };

  return (
    <div className="home-page">
      <HeroSection />
      {/* 
      {searchResults.length > 0 ? (
        <div className="pharmacies-list-wrapper">
          <h2 className="section-title">
            {searchResults.length} pharmacies found
          </h2>
          <PharmacyList
            pharmacies={searchResults}
            calculateDistance={calculateDistance}
          />
        </div>
      ) : (
        <p className="no-results">
          No results found. Please refine your search.
        </p>
      )}

      {searchResults.length === 0 && (
        <>
          {isLoading ? (
            <div className="loading-indicator">
              <p>Searching...</p>
              <CircularProgressbar
                value={loadingProgress}
                maxValue={100}
                text={`${loadingProgress}%`}
                styles={buildStyles({
                  pathColor: "#4caf50",
                  textColor: "#4caf50",
                  trailColor: "#f3f3f3",
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
          ) : ( */}
      <div className="browse-categories-wrapper">
        <h2 className="section-title">Browse by Medication Category</h2>
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category}
              className={`category-item ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
          <li
            className={`category-item ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </li>
        </ul>
      </div>
      {!selectedCategory && <WhyUseMedLocator />}
        <h2 className="section-title">Featured Pharmacies</h2>
        <PharmacyList
        pharmacies={visiblePharmacies}
        calculateDistance={calculateDistance}
        onShowAll={handleShowAll}
        showAllButton={visibleCount < filteredPharmacies.length}
      />
  
    </div>
  );
};

export default HomePage;
