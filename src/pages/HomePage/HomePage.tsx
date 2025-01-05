// HomePage.tsx
import React, { useState } from "react";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import SearchBar from "../../components/SearchBar/SearchBar";
import pharmacistImage from "../../assets/images/pharmacist1.svg";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
  };
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

  const handleShowAll = () => {
    setVisibleCount(filteredPharmacies.length);
  };

  return (
    <div className="home-page">
      <div className="hero-wrapper">
        <div className="hero-container">

        
        <div className="hero-content">
          <h1 className="hero-title">
            Find Drugs & Pharmacies <br /> Near You ,in Bahir Dar
          </h1>
          <p className="hero-subtitle">
            We have all the drugs your doctor prescribed for your health and
            what’s more, we can get it to you.{" "}
          </p>
          <SearchBar onSearch={handleSearch} />
          {/* Frequently Searched Drugs */}
          <div className="frequently-searched">
            <h2 className="frequently-searched-title">
              Frequently Searched Drugs
            </h2>
            <ul className="frequently-searched-list">
              {[
                "Paracetamol",
                "Ibuprofen",
                "Amoxicillin",
                "Metformin",
                "Aspirin",
              ].map((drug) => (
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
      <WhyUseMedLocator />
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
  );
};

export default HomePage;
