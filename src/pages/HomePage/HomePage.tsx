import React, { useState } from "react";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [searchResults, setSearchResults] = useState<typeof pharmacies>([]);
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
    return `${Math.round(Math.random() * 10 + 1)} km`;
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const results = pharmacies.filter((pharmacy) =>
      pharmacy.available_drugs.some((drug) =>
        drug.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    setSearchResults(results);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredPharmacies.length);
  };

  return (
    <div className="home-page">
      <HeroSection onSearch={handleSearch} />

      {searchResults.length > 0 && (
        <div className="search-results-wrapper">
          <h2 className="section-title">Search Results</h2>
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
      )}

      {searchResults.length === 0 && (
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
    </div>
  );
};

export default HomePage;
