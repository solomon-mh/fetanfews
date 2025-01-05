import React, { useState } from "react";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import the styles

interface Drug {
  name: string;
}

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0); // State for progress bar
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(
      pharmacies.flatMap((pharmacy) =>
        pharmacy.available_drugs.map((drug) => drug.category)
      )
    )
  );

  const filteredPharmacies = selectedCategory
    ? pharmacies.filter((pharmacy) =>
        pharmacy.available_drugs.some(
          (drug) => drug.category === selectedCategory
        )
      )
    : pharmacies;

  const visiblePharmacies = filteredPharmacies.slice(0, visibleCount);

  const calculateDistance = (latitude: number, longitude: number): string => {
    const userLatitude = 0; // Replace with user's actual latitude
    const userLongitude = 0; // Replace with user's actual longitude
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(latitude - userLatitude);
    const dLon = toRad(longitude - userLongitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLatitude)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${(R * c).toFixed(2)} km`;
  };

  const handleSearch = (searchCriteria: {
    drugName: string;
    pharmacyName: string;
  }) => {
    setIsLoading(true);
    setLoadingProgress(0); // Reset progress bar on each search

    const { drugName, pharmacyName } = searchCriteria;

    if (!drugName.trim() && !pharmacyName.trim()) {
      setSearchResults([]);
      setIsLoading(false); // Stop loading if no search criteria
      return;
    }
    const progressTimer = setInterval(() => {
      if (loadingProgress < 100) {
        setLoadingProgress((prev) => prev + 10); // Increase progress
      }
    }, 200);

  
      const results = pharmacies.filter((pharmacy) => {
        const pharmacyNameMatch = pharmacyName
          ? pharmacy.pharmacy_name
              .toLowerCase()
              .includes(pharmacyName.toLowerCase())
          : true;
        const drugNameMatch = drugName
          ? pharmacy.available_drugs.some((drug) =>
              drug.name.toLowerCase().includes(drugName.toLowerCase())
            )
          : true;
        return pharmacyNameMatch && drugNameMatch;
      });
      setSearchResults(results);
      setIsLoading(false);
      clearInterval(progressTimer); 
   
  };

  const handleShowAll = () => {
    setVisibleCount(filteredPharmacies.length);
  };

  return (
    <div className="home-page">
      <HeroSection onSearch={handleSearch} />

      {searchResults.length > 0 ? (
        <div className="pharmacies-list-wrapper">
          <h2 className="section-title">{ searchResults.length} pharmacies found</h2>
          <ul className="pharmacies-list">
            {searchResults.map((pharmacy) => (
              <li key={pharmacy.pharmacy_id} className="pharmacy-item">
                <img
                  src={pharmacy.image}
                  alt={pharmacy.pharmacy_name}
                  className="pharmacy-image"
                />
                <h3>{pharmacy.pharmacy_name}</h3>
                <p>{pharmacy.address}</p>
                <p>
                  Distance:{" "}
                  {calculateDistance(pharmacy.latitude, pharmacy.longitude)}
                </p>
              </li>
            ))}
          </ul>
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
          ) : (
            
              <>
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

          <WhyUseMedLocator />
          <div className="pharmacies-list-wrapper">
            <h2 className="section-title">Nearby Pharmacies</h2>
            <ul className="pharmacies-list">
              {visiblePharmacies.map((pharmacy) => (
                <li key={pharmacy.pharmacy_id} className="pharmacy-item">
                  <img
                    src={pharmacy.image}
                    alt={pharmacy.pharmacy_name}
                    className="pharmacy-image"
                  />
                  <h3>{pharmacy.pharmacy_name}</h3>
                  <p>{pharmacy.address}</p>
                  <p>
                    Distance:{" "}
                    {calculateDistance(pharmacy.latitude, pharmacy.longitude)}
                  </p>
                </li>
              ))}
            </ul>
            {visibleCount < filteredPharmacies.length && (
              <button className="show-all-button" onClick={handleShowAll}>
                Show All
              </button>
            )}
          </div>
        </>
      )}
              
              </> 
              
          )}
         
    </div>
  );
};

export default HomePage;
